"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import UploadZone from "@/components/upload-zone"
import { useSession } from "@/hooks/use-session"
import LimitWarningModal from "@/components/limit-warning-modal"

export default function SmartUploadZone() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("")
    const [processingSteps, setProcessingSteps] = useState<string[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)
    const [showLimitWarning, setShowLimitWarning] = useState(false)
    const [quota, setQuota] = useState<{ used: number, limit: number } | null>(null)

    const { session } = useSession()
    const visitorTrackedRef = useRef(false)

    // Fetch quota 
    useEffect(() => {
        fetch('/api/user/usage')
            .then(res => res.json())
            .then(data => {
                if (data.usagebytes !== undefined) {
                    setQuota({ used: data.usagebytes, limit: data.limit })
                }
            })
            .catch(() => { })
    }, [])

    // Track visitor silently on first interaction
    const trackVisitor = useCallback(async () => {
        if (visitorTrackedRef.current) return
        visitorTrackedRef.current = true

        try {
            const email = session?.email || 'anonymous'
            await fetch('/api/visitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
        } catch (error) {
            console.error('Visitor tracking failed:', error)
        }
    }, [session])

    const handleUpload = async (file: File) => {
        // Basic file size check for single file > 10MB
        if (file.size > 10 * 1024 * 1024) {
            setShowLimitWarning(true)
            return
        }

        setUploading(true)
        setProgress(0)
        setProcessingSteps(["Starting upload..."])

        try {
            const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            const isExcel = file.name.match(/\.xls(x)?$/i) || file.type.includes('excel') || file.type.includes('spreadsheet')
            const formData = new FormData()

            if (isPDF || isExcel) {
                console.log('Document detected, skipping client-side optimization...')
                formData.append('file', file)
            } else {
                // 1. Preprocess image (Client-side)
                setProcessingSteps(prev => [...prev, "Optimizing image quality (Grayscale, Contrast)..."])
                setStatus("Optimizing image for better accuracy...")

                await new Promise(r => setTimeout(r, 800))

                const { quickPreprocess } = await import('@/lib/image-preprocessing')
                const preprocessedBlob = await quickPreprocess(file)
                formData.append('file', preprocessedBlob, file.name)
            }

            console.log('Sending optimized image to OCR API...')
            setProcessingSteps(prev => [...prev, "Sending to AI OCR engine..."])
            setStatus("Processing with AI...")

            setProgress(30)
            const response = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            })

            console.log('API Response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('API Error:', errorData)

                // Check for Quota Error from Backend
                if (response.status === 403 && (errorData.error === 'Daily Quota exceeded' || (errorData.details && errorData.details.includes('quote')))) {
                    setShowLimitWarning(true)
                    setUploading(false)
                    return
                }

                const specificError = errorData.details || errorData.error || `OCR API failed: ${response.statusText}`
                throw new Error(specificError)
            }

            setProcessingSteps(prev => [...prev, "Extracting text from response..."])
            const data = await response.json()
            console.log('OCR Response:', data)

            if (data.isPDF && data.pages) {
                console.log(`PDF processed: ${data.totalPages} pages`)
                setProcessingSteps(prev => [...prev, "Finalizing PDF results..."])
                setProgress(100)
                sessionStorage.setItem("ocr_result", JSON.stringify({ ...data, fileName: file.name }))

                await new Promise(r => setTimeout(r, 500))
                console.log('Redirecting to results page...')
                window.location.href = "/result/local"
                return
            }

            const text = String(data?.text || "")
            console.log('Extracted text length:', text.length)

            if (!text || text.trim().length === 0) {
                throw new Error('No text extracted from image')
            }

            setProcessingSteps(prev => [...prev, "Finalizing results..."])
            setProgress(100)
            sessionStorage.setItem("ocr_result", JSON.stringify({ text, fileName: file.name }))

            await new Promise(r => setTimeout(r, 500))
            console.log('Redirecting to results page...')
            window.location.href = "/result/local"

        } catch (error) {
            console.error("OCR Error:", error)
            alert(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

            // Document size check (max 10MB) - SHOW WARNING MODAL
            const docFile = pdfFiles[0] || excelFiles[0]
            if (docFile && docFile.size > 10 * 1024 * 1024) {
                setShowLimitWarning(true)
                return
            }

            // Check remaining quota for Document
            if (docFile && quota) {
                const fileSizeMB = docFile.size / (1024 * 1024)
                const usedMB = quota.used / (1024 * 1024)
                const limitMB = quota.limit / (1024 * 1024) // likely 10

                if (usedMB + fileSizeMB > limitMB) {
                    setShowLimitWarning(true)
                    return
                }
            }

            // Individual file size check
            const oversizedFile = acceptedFiles.find(file => file.size > 10 * 1024 * 1024)
            if (oversizedFile) {
                setShowLimitWarning(true)
                return
            }

            // Total batch size check
            if (imageFiles.length > 1) {
                const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0)

                // Strict 10MB limit for batch
                if (totalSize > 10 * 1024 * 1024) {
                    setShowLimitWarning(true)
                    return
                }

                // Check against Quota if available
                if (quota) {
                    const totalSizeMB = totalSize / (1024 * 1024)
                    const usedMB = quota.used / (1024 * 1024)
                    const limitMB = quota.limit / (1024 * 1024)

                    if (usedMB + totalSizeMB > limitMB) {
                        setShowLimitWarning(true)
                        return
                    }
                }
            }

            // Single Image Check against Quota
            if (imageFiles.length === 1 && quota) {
                const fileSizeMB = imageFiles[0].size / (1024 * 1024)
                const usedMB = quota.used / (1024 * 1024)
                // 10MB is hardcoded in many places, assuming it matches quota.limit which is likely bytes

                if (usedMB + fileSizeMB > 10) { // Safety check
                    setShowLimitWarning(true)
                    return
                }
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
            setProcessingSteps(["Starting batch upload..."])

            try {
                const pageResults: Array<{ pageNumber: number; text: string; imageName: string }> = []

                for (let i = 0; i < imageFiles.length; i++) {
                    const imageFile = imageFiles[i]
                    setProcessingSteps(prev => [...prev, `Processing image ${i + 1} of ${imageFiles.length}: ${imageFile.name}...`])

                    setProgress(Math.round(((i) / imageFiles.length) * 80))

                    const { quickPreprocess } = await import('@/lib/image-preprocessing')
                    const preprocessedBlob = await quickPreprocess(imageFile)

                    const formData = new FormData()
                    formData.append('file', preprocessedBlob, imageFile.name)

                    const response = await fetch('/api/ocr', {
                        method: 'POST',
                        body: formData,
                    })

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}))

                        // QUOTA CHECK IN BATCH
                        if (response.status === 403 && (errorData.error === 'Daily Quota exceeded' || (errorData.details && errorData.details.includes('quote')))) {
                            setShowLimitWarning(true)
                            setUploading(false)
                            return
                        }

                        throw new Error(errorData.details || errorData.error || `Failed to process ${imageFile.name}`)
                    }

                    const data = await response.json()
                    const extractedText = String(data?.text || "")

                    pageResults.push({
                        pageNumber: i + 1,
                        text: extractedText,
                        imageName: imageFile.name
                    })
                }

                setProcessingSteps(prev => [...prev, "Finalizing batch results..."])
                setProgress(100)

                sessionStorage.setItem("ocr_result", JSON.stringify({
                    isPDF: false,
                    isBatch: true,
                    fileName: imageFiles[0].name,
                    pages: pageResults,
                    totalPages: pageResults.length
                }))

                await new Promise(r => setTimeout(r, 500))
                window.location.href = "/result/local"

            } catch (error) {
                console.error("Batch OCR Error:", error)
                setValidationError(`Failed to process images: ${error instanceof Error ? error.message : 'Unknown error'}`)
                setUploading(false)
                setProgress(0)
                setProcessingSteps([])
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
