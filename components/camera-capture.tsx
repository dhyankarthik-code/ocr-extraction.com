"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, Camera, SwitchCamera, Loader2 } from "lucide-react"

interface CameraCaptureProps {
    onCapture: (blob: Blob) => void
    onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const [mounted, setMounted] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }, [stream])

    const startCamera = useCallback(async () => {
        setLoading(true)
        setError(null)
        stopStream()

        try {
            const constraints = {
                video: {
                    facingMode: facingMode
                },
                audio: false
            }

            const newStream = await navigator.mediaDevices.getUserMedia(constraints)
            setStream(newStream)
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
        } catch (err: any) {
            console.error("Camera error:", err)
            setError("Unable to access camera. Please ensure permissions are granted.")
        } finally {
            setLoading(false)
        }
    }, [facingMode, stopStream])

    // Initial start
    useEffect(() => {
        if (mounted) {
            startCamera()
        }
        return () => {
            stopStream()
        }
    }, [mounted, startCamera, stopStream])

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context) {
            // Set canvas dimensions to match video stream
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            // Flip horizontal if using front camera (mirror effect)
            if (facingMode === 'user') {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
                if (blob) {
                    stopStream() // Stop camera before handing off
                    onCapture(blob)
                } else {
                    setError("Failed to capture image")
                }
            }, "image/jpeg", 0.95)
        }
    }

    const switchCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    const handleClose = () => {
        stopStream()
        onClose()
    }

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Main Viewport */}
            <div className="relative w-full h-full flex flex-col">

                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="text-white font-medium text-sm drop-shadow-md">Take Photo</div>
                    <div className="w-10" /> {/* Spacer for balance */}
                </div>

                {/* Video Feed */}
                <div className="flex-1 relative flex items-center justify-center bg-zinc-900 overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/70">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span>Starting camera...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                            <div className="max-w-xs text-red-400 bg-red-950/30 p-4 rounded-xl border border-red-900/50">
                                <p>{error}</p>
                                <button
                                    onClick={() => startCamera()}
                                    className="mt-4 px-4 py-2 bg-red-900/50 rounded-lg text-white text-sm hover:bg-red-800 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                </div>

                {/* Bottom Controls */}
                <div className="h-32 bg-black flex items-center justify-around px-8 pb-4 pt-2">

                    {/* Gallery / Placeholder (Empty for now) */}
                    <div className="w-12 h-12" />

                    {/* Shutter Button */}
                    <button
                        onClick={handleCapture}
                        disabled={loading || !!error}
                        className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform group-active:scale-95">
                            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-gray-200 transition-colors" />
                        </div>
                    </button>

                    {/* Switch Camera */}
                    <button
                        onClick={switchCamera}
                        disabled={loading || !!error}
                        className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        <SwitchCamera className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </div>,
        document.body
    )
}
