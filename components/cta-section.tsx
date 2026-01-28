"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUploadStore } from "@/lib/store"
import SmartUploadZone from "@/components/smart-upload-zone"

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
    const [isExpanded, setIsExpanded] = useState(false)
    const { isUploading, progress, status } = useUploadStore()

    const handleCtaClick = () => {
        setIsExpanded(true)
    }

    return (
        <section className="w-full max-w-5xl mb-12 mt-12 px-4 text-center mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                <h3 className={titleClassName + " mb-4"}>
                    {title}
                </h3>
                {description && (
                    <p className={descriptionClassName}>
                        {description}
                    </p>
                )}
                {subDescription && (
                    <p className="text-gray-500 text-sm italic">
                        {subDescription}
                    </p>
                )}

                <div className="mt-8 transition-all duration-500 ease-in-out">
                    {isExpanded ? (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <SmartUploadZone />
                        </div>
                    ) : (
                        <button
                            onClick={handleCtaClick}
                            aria-label="Upload Your File for OCR"
                            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-red-200 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Your File & Start Now
                        </button>
                    )}
                </div>

                {!isExpanded && isUploading && (
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
            </div>
        </section>
    )
}
