"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import UploadZone from "@/components/upload-zone"
import { useSession } from "@/hooks/use-session"
import LimitWarningModal from "@/components/limit-warning-modal"
import { useVisitorTracker } from "@/hooks/use-visitor-tracker"

import { useUploadStore } from "@/lib/store"
import { sendGAEvent } from "@/lib/gtag"

export default function SmartUploadZone() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("")
    const [processingSteps, setProcessingSteps] = useState<string[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)
    const [showLimitWarning, setShowLimitWarning] = useState(false)
    const [lastUploadTime, setLastUploadTime] = useState<number>(0)

    // Sync with global store
    const { setUploading: setGlobalUploading, setProgress: setGlobalProgress, setStatus: setGlobalStatus } = useUploadStore()

    useEffect(() => {
        setGlobalUploading(uploading)
        setGlobalProgress(progress)
        setGlobalStatus(status)
    }, [uploading, progress, status, setGlobalUploading, setGlobalProgress, setGlobalStatus])

    const { session } = useSession()
    const { trackUsage } = useVisitorTracker()
    const visitorTrackedRef = useRef(false)

    // Track visitor silently on first interaction (OCR Tool)
    const trackVisitor = useCallback(async () => {
        if (visitorTrackedRef.current) return
        visitorTrackedRef.current = true
        trackUsage('OCR')
    }, [trackUsage])

    // Helper to poll for job completion
    const pollForCompletion = async (jobId: string) => {
        const pollUrl = `/api/ocr/status/${jobId}`
        let attempts = 0
        const maxAttempts = 50 // Cap attempts to prevent infinite loops (50 * ~3s avg = ~2.5 mins max wait)
        const baseDelay = 1000 // Start with 1s
        const maxDelay = 10000 // Cap delay at 10s

        while (attempts < maxAttempts) {
            attempts++
            try {
                const res = await fetch(pollUrl)

                if (res.status === 429) {
                    console.warn("Status polling rate limited. Backing off...")
                    // Aggressive backoff for 429s: 5s + exponential factor
                    const backoff = Math.min(5000 + (Math.pow(1.5, attempts) * 1000), 15000)
                    // Add jitter
                    const jitter = Math.random() * 2000
                    await new Promise(r => setTimeout(r, backoff + jitter))
                    continue
                }

                if (res.status === 503 || res.status === 504 || res.status === 502) {
                    // Gateway errors, retry slowly
                    await new Promise(r => setTimeout(r, 4000))
                    continue
                }

                if (!res.ok) {
                    // 404 might mean job not created yet (consistency delay)
                    if (res.status === 404 && attempts < 5) {
                        await new Promise(r => setTimeout(r, 2000))
                        continue
                    }
                    throw new Error(`Status check failed with ${res.status}`)
                }

                const data = await res.json()

                if (data.status === 'completed') {
                    return data.result
                }

                if (data.status === 'failed' || data.error) {
                    throw new Error(data.error || 'Job failed')
                }

                // Still processing
                setStatus("AI Processing... (Running in background)")

                // Standard Exponential Backoff
                // 1s, 1.5s, 2.25s, 3.375s, 5s... capped at 10s
                const delay = Math.min(baseDelay * Math.pow(1.5, attempts - 1), maxDelay)
                // Add slight jitter to prevent thundering herd if multiple tabs open
                const jitter = Math.random() * 500
                await new Promise(r => setTimeout(r, delay + jitter))

            } catch (e) {
                console.error("Polling error", e)
                const errorMessage = e instanceof Error ? e.message : String(e)

                if (errorMessage.includes("Job failed") || errorMessage.includes("Status check failed")) throw e

                // Network glitches - retry
                if (attempts >= maxAttempts) throw new Error("Processing timed out. Please try again.")
                await new Promise(r => setTimeout(r, 3000))
            }
        }
        throw new Error('Processing timed out')
    }

    const handleUpload = async (file: File) => {
        // Basic file size check for single file > 10MB
        if (file.size > 10 * 1024 * 1024) {
            setShowLimitWarning(true)
            return
        }

        const startTime = Date.now()
        sendGAEvent({
            action: "ocr_attempt",
            category: "OCR",
            label: "Single File",
            file_type: file.type,
            file_size: file.size
        })

        setUploading(true)
        setProgress(0)
        setProcessingSteps(["Starting..."])

        try {
            const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            const isExcel = /\.xls(x)?$/i.test(file.name) || file.type.includes('excel') || file.type.includes('spreadsheet')
            const formData = new FormData()

            if (isPDF || isExcel) {
                setStatus("Uploading document...")
                formData.append('file', file)
            } else {
                // 1. Preprocess image (Client-side)

                // Detect device type for optimization strategy
                const isMobile = typeof globalThis !== 'undefined' && (
                    globalThis.innerWidth < 768 ||
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                );

                setProcessingSteps(prev => [...prev, isMobile ? "Optimizing (Fast Mode)..." : "Enhancing image quality..."])
                setStatus("Preparing high-res image...")

                const { quickPreprocess } = await import('@/lib/image-preprocessing')

                // Pass isMobile flag: Mobile = Fast Resize, Desktop = High Quality Filters
                const preprocessedBlob = await quickPreprocess(file, isMobile)

                setStatus("Compressing to speed up upload...")
                console.log(`Final image size: ${(preprocessedBlob.size / 1024 / 1024).toFixed(2)} MB (${isMobile ? 'Mobile' : 'Desktop'} Mode)`)
                formData.append('file', preprocessedBlob, file.name)

                // If on Desktop, we can tell server we already did some work, 
                // BUT better to let server re-run sharp to be safe or set preprocessed=true
                // The user wants QUALITY, so let's let the server do its magic too unless it's redundant.
                // Server logic: if (!processed) -> process.
                // Let's keep it simple: Server always runs its pipeline (it's fast). 
                // This ensures Maximum Quality (Client + Server = Double Strong).
            }

            console.log('Sending to OCR API...')
            setProcessingSteps(prev => [...prev, "Uploading to secure server..."])
            setStatus("Processing with AI...")

            const data = await new Promise<any>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/api/ocr')
                xhr.timeout = 60000 // 60s timeout

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 90)
                        setProgress(percentComplete)
                        if (percentComplete < 90) {
                            setStatus(`Uploading... ${Math.round((event.loaded / event.total) * 100)}%`)
                        } else {
                            // REAL FEEDBACK: No fake delays
                            setStatus("AI Processing... Please wait")
                        }
                    }
                }

                xhr.onload = () => {
                    try {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(JSON.parse(xhr.responseText))
                        } else {
                            let errorData = {}
                            try {
                                errorData = JSON.parse(xhr.responseText || '{}')
                            } catch (e) {
                                // Fallback for HTML errors (like Vercel timeouts)
                                errorData = { details: xhr.responseText || 'Server Error' }
                            }
                            reject({ status: xhr.status, data: errorData })
                        }
                    } catch (e) {
                        reject(new Error('Invalid server response'))
                    }
                }
                xhr.onerror = () => {
                    reject(new Error('Network error during upload.'))
                }
                xhr.ontimeout = () => {
                    reject(new Error('Request timed out. Server took too long to respond.'))
                }
                xhr.send(formData)
            }).catch(err => {
                if (err.status === 403 && (err.data?.error === 'Daily Quota exceeded' || (err.data?.details && err.data?.details.includes('quote')))) {
                    setShowLimitWarning(true)
                    setUploading(false)
                    throw new Error('QUOTA_EXCEEDED')
                }
                throw new Error(err.data?.details || err.data?.error || err.message || 'Processing failed')
            })

            if (data === 'QUOTA_EXCEEDED') return

            // Handle Async Job Response
            let finalData = data;
            if (data.jobId) {
                console.log("Async job started:", data.jobId)
                setStatus("AI Processing... (Queued)")
                finalData = await pollForCompletion(data.jobId)
            }

            setProcessingSteps(prev => [...prev, "Extraction complete!"])
            setProgress(100)

            // Trigger quota refresh in UploadZone
            setLastUploadTime(Date.now())

            sendGAEvent({
                action: "ocr_success",
                category: "OCR",
                label: "Success",
                duration_ms: Date.now() - startTime,
                file_type: isPDF ? 'pdf' : isExcel ? 'excel' : 'image'
            })

            if (finalData.isPDF && finalData.pages) {
                sessionStorage.setItem("ocr_result", JSON.stringify({ ...finalData, fileName: file.name }))
            } else {
                const text = String(finalData?.text || "")
                if (!text || text.trim().length === 0) {
                    throw new Error('No text extracted from image')
                }
                sessionStorage.setItem("ocr_result", JSON.stringify({ text, fileName: file.name }))
            }

            window.location.href = "/result/local"

        } catch (error: any) {
            if (error.message === 'QUOTA_EXCEEDED') return
            console.error("OCR Error:", error)

            sendGAEvent({
                action: "ocr_fail",
                category: "OCR",
                label: error.message || "Unknown",
                duration_ms: Date.now() - startTime
            })

            // Show error in UI instead of alert
            setValidationError(`Processing Failed: ${error.message || "Unknown error occurred"}`)
            setUploading(false)
            setProgress(0)
            setProcessingSteps([])
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setValidationError(null)

            if (!acceptedFiles || acceptedFiles.length === 0) return


            const pdfFiles = acceptedFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
            const excelFiles = acceptedFiles.filter(f => f.name.match(/\.xls(x)?$/i) || f.type.includes('excel') || f.type.includes('spreadsheet') || f.name.toLowerCase().endsWith('.xls') || f.name.toLowerCase().endsWith('.xlsx'))
            const imageFiles = acceptedFiles.filter(f =>
                !f.type.includes('pdf') &&
                !f.name.toLowerCase().endsWith('.pdf') &&
                !f.name.match(/\.xls(x)?$/i) &&
                !f.type.includes('excel') &&
                !f.type.includes('spreadsheet') &&
                !f.name.toLowerCase().endsWith('.xls') &&
                !f.name.toLowerCase().endsWith('.xlsx') ||
                f.type === 'image/svg+xml' ||
                f.name.toLowerCase().endsWith('.svg')
            )

            if (pdfFiles.length + excelFiles.length > 1) {
                setValidationError("Only one document (PDF or Excel) can be uploaded at a time.")
                return
            }

            if ((pdfFiles.length > 0 || excelFiles.length > 0) && imageFiles.length > 0) {
                setValidationError("Please upload either a document or images, not both.")
                return
            }

            // Check if no valid files were found at all
            if (pdfFiles.length === 0 && excelFiles.length === 0 && imageFiles.length === 0) {
                setValidationError("Unsupported file type. Please upload Images, PDFs, or Excel files.")
                return
            }

            // Total size check (max 10MB)
            const oversizedFile = acceptedFiles.find(file => file.size > 10 * 1024 * 1024)
            if (oversizedFile) {
                setShowLimitWarning(true)
                return
            }

            const file = acceptedFiles[0]
            const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            const isExcel = file.name.match(/\.xls(x)?$/i) || file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')

            trackVisitor()

            // Single PDF, Excel or single image
            if (isPDF || isExcel || imageFiles.length === 1) {
                await handleUpload(file)
                return
            }

            // Batch Process
            setUploading(true)
            setProgress(0)
            setStatus("Starting batch process...")

            try {
                const pageResults: Array<{ pageNumber: number; text: string; imageName: string }> = []
                const { quickPreprocess } = await import('@/lib/image-preprocessing')

                const isMobile = typeof window !== 'undefined' && (
                    window.innerWidth < 768 ||
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                );

                for (let i = 0; i < imageFiles.length; i++) {
                    const imageFile = imageFiles[i]
                    setStatus(`Processing ${i + 1}/${imageFiles.length}: ${imageFile.name}`)

                    const stepProgressMultiplier = 1 / imageFiles.length
                    const baseProgress = (i / imageFiles.length) * 100

                    const preprocessedBlob = await quickPreprocess(imageFile, isMobile)
                    const formData = new FormData()
                    formData.append('file', preprocessedBlob, imageFile.name)
                    // REMOVED 'preprocessed' flag - Server will enhance
                    // formData.append('preprocessed', 'true')

                    const data = await new Promise<any>((resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.open('POST', '/api/ocr')
                        xhr.timeout = 60000 // 60s timeout

                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const chunkProgress = (event.loaded / event.total) * 90 * stepProgressMultiplier
                                setProgress(Math.round(baseProgress + chunkProgress))
                            }
                        }
                        xhr.onload = () => {
                            try {
                                if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText))
                                else {
                                    let errorData = {}
                                    try {
                                        errorData = JSON.parse(xhr.responseText || '{}')
                                    } catch (e) {
                                        errorData = { details: xhr.responseText || 'Batch Error' }
                                    }
                                    reject({ status: xhr.status, data: errorData })
                                }
                            } catch (e) {
                                reject(new Error('Invalid batch response'))
                            }
                        }
                        xhr.onerror = () => reject(new Error('Network error'))
                        xhr.ontimeout = () => reject(new Error('Batch request timed out'))
                        xhr.send(formData)
                    })

                    // Handle Async Batch Job
                    let finalBatchData = data;
                    if (data.jobId) {
                        setStatus(`Processing ${i + 1}/${imageFiles.length}: AI working...`)
                        finalBatchData = await pollForCompletion(data.jobId)
                    }

                    pageResults.push({
                        pageNumber: i + 1,
                        text: String(finalBatchData?.text || ""),
                        imageName: imageFiles[i].name
                    })
                }

                setProgress(100)
                setLastUploadTime(Date.now()) // Refresh quota

                sessionStorage.setItem("ocr_result", JSON.stringify({
                    isPDF: false,
                    isBatch: true,
                    fileName: imageFiles[0].name,
                    pages: pageResults,
                    totalPages: pageResults.length
                }))

                window.location.href = "/result/local"

            } catch (error: any) {
                if (error.status === 403) setShowLimitWarning(true)
                else alert(`Batch failed: ${error.message || 'Unknown error'}`)

                sendGAEvent({
                    action: "ocr_fail",
                    category: "OCR",
                    label: error.message || "Batch Error",
                })

                setUploading(false)
                setProgress(0)
            }
        },
        [session],
    )


    return (
        <>
            <UploadZone
                onDrop={onDrop}
                uploading={uploading}
                progress={progress}
                processingSteps={processingSteps}
                lastUploadTime={lastUploadTime}
            />

            {validationError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{validationError}</span>
                    </div>
                    <button
                        onClick={() => setValidationError(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {showLimitWarning && (
                <LimitWarningModal onClose={() => setShowLimitWarning(false)} />
            )}
        </>
    )
}
