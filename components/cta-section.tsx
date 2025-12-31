"use client"

import { useRouter, usePathname } from "next/navigation"
import { useUploadStore } from "@/lib/store"

interface CtaSectionProps {
    title?: string
    description?: string
    subDescription?: string
    titleClassName?: string
    descriptionClassName?: string
}

export default function CtaSection({
    title = "Try It Now",
    description = "Upload your file, click convert, and experience the most accurate OCR tool available online in 2025.",
    subDescription = "Your data stays secure, your results stay precise, and your workflow becomes effortless.",
    titleClassName = "text-2xl md:text-3xl font-bold text-gray-900",
    descriptionClassName = "text-gray-600 mb-6"
}: CtaSectionProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { isUploading, progress, status } = useUploadStore()

    const handleCtaClick = () => {
        // Dispatch custom event to trigger file upload in UploadZone
        window.dispatchEvent(new CustomEvent('trigger-file-upload'))
    }

    return (
        <section className="w-full max-w-3xl mb-12 mt-20 px-4 text-center mx-auto">
            <h3 className={titleClassName + " mb-4"}>
                {title}
            </h3>
            {description && (
                <p className={descriptionClassName}>
                    {description}
                </p>
            )}
            {subDescription && (
                <p className="text-gray-500 text-sm">
                    {subDescription}
                </p>
            )}
            <button
                onClick={handleCtaClick}
                aria-label="Upload Your File for OCR"
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Your File
            </button>

            {isUploading && (
                <div className="w-full max-w-md mx-auto mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden border border-gray-200">
                        <div
                            className="bg-red-500 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 font-medium animate-pulse">
                        {status || 'Processing file...'} {progress > 0 && `(${Math.round(progress)}%)`}
                    </p>
                </div>
            )}
        </section>
    )
}
