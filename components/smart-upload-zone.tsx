"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import UploadZone from "@/components/upload-zone"
import { useSession } from "@/hooks/use-session"
import LimitWarningModal from "@/components/limit-warning-modal"
import { useVisitorTracker } from "@/hooks/use-visitor-tracker"

import { useUploadStore } from "@/lib/store"

export default function SmartUploadZone() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("")
    const [processingSteps, setProcessingSteps] = useState<string[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)
    const [showLimitWarning, setShowLimitWarning] = useState(false)
    const [quota, setQuota] = useState<{ used: number, limit: number } | null>(null)

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

    const handleUpload = async (file: File) => {
        // STRICT CONSENT CHECK (Omitted for now)
        /*
        const termsAccepted = typeof window !== 'undefined' && localStorage.getItem("terms_accepted") === "true"
        const cookiesAccepted = typeof window !== 'undefined' && localStorage.getItem("cookies_accepted") === "true"

        if (!termsAccepted || !cookiesAccepted) {
            alert("Please accept both the Privacy Policy and Cookie Consent to use this tool.")
            return
        }
        */

        // Basic file size check for single file > 10MB
        if (file.size > 10 * 1024 * 1024) {
            setShowLimitWarning(true)
            return
        }

        setUploading(true)
        setProgress(0)
        setProcessingSteps(["Starting..."])

        try {
            const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            const isExcel = file.name.match(/\.xls(x)?$/i) || file.type.includes('excel') || file.type.includes('spreadsheet')
            const formData = new FormData()

            if (isPDF || isExcel) {
                setStatus("Uploading document...")
                formData.append('file', file)
            } else {
                setProcessingSteps(prev => [...prev, "Optimizing image..."])
                setStatus("Compressing image for faster upload...")

                const { quickPreprocess } = await import('@/lib/image-preprocessing')
                const preprocessedBlob = await quickPreprocess(file)
                console.log(`Optimized image size: ${(preprocessedBlob.size / 1024 / 1024).toFixed(2)} MB`)
                formData.append('file', preprocessedBlob, file.name)
            }

            // Real Upload Progress using XMLHttpRequest
            const data = await new Promise<any>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/api/ocr')

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 90)
                        setProgress(percentComplete)
                        if (percentComplete < 90) {
                            setStatus(`Uploading... ${Math.round((event.loaded / event.total) * 100)}%`)
                        } else {
                            setStatus("AI Processing... Please wait")
                        }
                    }
                }

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText))
                    } else {
                        const errorData = JSON.parse(xhr.responseText || '{}')
                        reject({ status: xhr.status, data: errorData })
                    }
                }
                xhr.onerror = () => reject(new Error('Network error during upload.'))
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

            setProcessingSteps(prev => [...prev, "Extraction complete!"])
            setProgress(100)

            if (data.isPDF && data.pages) {
                sessionStorage.setItem("ocr_result", JSON.stringify({ ...data, fileName: file.name }))
            } else {
                const text = String(data?.text || "")
                if (!text || text.trim().length === 0) {
                    throw new Error('No text extracted from image')
                }
                sessionStorage.setItem("ocr_result", JSON.stringify({ text, fileName: file.name }))
            }

            window.location.href = "/result/local"

        } catch (error: any) {
            if (error.message === 'QUOTA_EXCEEDED') return
            console.error("OCR Error:", error)
            alert(`Failed: ${error.message}`)
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
            const excelFiles = acceptedFiles.filter(f => f.name.match(/\.xls(x)?$/i) || f.type.includes('excel') || f.type.includes('spreadsheet'))
            const imageFiles = acceptedFiles.filter(f =>
                !f.type.includes('pdf') &&
                !f.name.toLowerCase().endsWith('.pdf') &&
                !f.name.match(/\.xls(x)?$/i) &&
                !f.type.includes('excel') &&
                !f.type.includes('spreadsheet')
            )

            if (pdfFiles.length + excelFiles.length > 1) {
                setValidationError("Only one document (PDF or Excel) can be uploaded at a time.")
                return
            }

            if ((pdfFiles.length > 0 || excelFiles.length > 0) && imageFiles.length > 0) {
                setValidationError("Please upload either a document or images, not both.")
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
            const isExcel = file.name.match(/\.xls(x)?$/i) || file.type.includes('excel') || file.type.includes('spreadsheet')

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

                for (let i = 0; i < imageFiles.length; i++) {
                    const imageFile = imageFiles[i]
                    setStatus(`Processing ${i + 1}/${imageFiles.length}: ${imageFile.name}`)

                    const stepProgressMultiplier = 1 / imageFiles.length
                    const baseProgress = (i / imageFiles.length) * 100

                    const preprocessedBlob = await quickPreprocess(imageFile)
                    const formData = new FormData()
                    formData.append('file', preprocessedBlob, imageFile.name)

                    const data = await new Promise<any>((resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.open('POST', '/api/ocr')
                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const chunkProgress = (event.loaded / event.total) * 90 * stepProgressMultiplier
                                setProgress(Math.round(baseProgress + chunkProgress))
                            }
                        }
                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText))
                            else reject({ status: xhr.status, data: JSON.parse(xhr.responseText || '{}') })
                        }
                        xhr.onerror = () => reject(new Error('Network error'))
                        xhr.send(formData)
                    })

                    pageResults.push({
                        pageNumber: i + 1,
                        text: String(data?.text || ""),
                        imageName: imageFile.name
                    })
                }

                setProgress(100)
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
                setUploading(false)
                setProgress(0)
            }
        },
        [session, quota],
    )


    return (
        <>
            <UploadZone
                onDrop={onDrop}
                uploading={uploading}
                progress={progress}
                processingSteps={processingSteps}
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
