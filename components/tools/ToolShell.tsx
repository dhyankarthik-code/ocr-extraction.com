"use client"

import { useState } from "react"
import UploadZone from "@/components/upload-zone"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface ToolShellProps {
    title: string
    description: string
    acceptedFileTypes: Record<string, string[]>
    onProcess: (files: File[]) => Promise<void>
    renderResult?: () => React.ReactNode
}

import { useVisitorTracker } from "@/hooks/use-visitor-tracker"

export default function ToolShell({
    title,
    description,
    acceptedFileTypes,
    onProcess,
    renderResult
}: ToolShellProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [progress, setProgress] = useState(0)
    const [steps, setSteps] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const { trackUsage } = useVisitorTracker()

    // Wrapper to inject state management into the process
    const handleDrop = async (files: File[]) => {
        if (!files || files.length === 0) return

        // STRICT CONSENT CHECK: Block usage if not accepted (Omitted for now)
        /*
        const termsAccepted = typeof window !== 'undefined' && localStorage.getItem("terms_accepted") === "true"
        const cookiesAccepted = typeof window !== 'undefined' && localStorage.getItem("cookies_accepted") === "true"

        if (!termsAccepted || !cookiesAccepted) {
            alert("Please accept both the Privacy Policy and Cookie Consent to use this tool.")
            return
        }
        */

        // Track usage (Infer tool name from title by removing " Converter")
        const toolName = title.replace(" Converter", "").trim()
        trackUsage(toolName)

        setError(null)
        setIsProcessing(true)
        setIsFinished(false)
        setProgress(10)
        setSteps(["Analyzing file..."])

        try {
            await onProcess(files)
            setProgress(100)
            setSteps(prev => [...prev, "Complete!"])
            setIsFinished(true)
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            setSteps([])
            setIsFinished(false)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReset = () => {
        setIsFinished(false)
        setSteps([])
        setProgress(0)
        window.location.reload()
    }

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">{title}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
            </div>

            {!isFinished || !renderResult ? (
                <UploadZone
                    onDrop={handleDrop}
                    uploading={isProcessing}
                    progress={progress}
                    processingSteps={steps}
                    accept={acceptedFileTypes}
                    hideUsage={true}
                />
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-green-600 justify-center mb-8">
                        <CheckCircle2 className="w-8 h-8" />
                        <span className="text-xl font-medium">Processing Complete</span>
                    </div>

                    <div className="p-6 border rounded-xl bg-card shadow-sm">
                        {renderResult()}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={handleReset}
                            className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                        >
                            Process another file
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-xl mx-auto p-4 border border-red-200 bg-red-50 text-red-900 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
                    <div>
                        <h5 className="font-medium mb-1">Error</h5>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
