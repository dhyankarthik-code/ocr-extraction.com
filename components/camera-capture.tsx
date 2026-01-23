"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, SwitchCamera, Loader2, AlertCircle, Play } from "lucide-react"

interface CameraCaptureProps {
    onCapture: (blob: Blob) => void
    onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const [mounted, setMounted] = useState(false)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<string>("")
    const [needsManualStart, setNeedsManualStart] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const isComponentActive = useRef(true)

    useEffect(() => {
        setMounted(true)
        return () => {
            setMounted(false)
            isComponentActive.current = false
        }
    }, [])

    const stopTracks = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }, [])

    const startCamera = useCallback(async (retryCount = 0) => {
        if (!isComponentActive.current) return

        setLoading(true)
        setError(null)
        setNeedsManualStart(false)

        stopTracks()

        const constraintsList = [
            { video: { facingMode: facingMode }, audio: false },
            { video: { facingMode: facingMode === 'environment' ? 'user' : 'environment' }, audio: false },
            { video: true, audio: false }
        ]

        if (retryCount >= constraintsList.length) {
            if (isComponentActive.current) {
                setError("Could not access any camera. Please check permissions.")
                setLoading(false)
            }
            return
        }

        const currentConstraints = constraintsList[retryCount]
        if (isComponentActive.current) setDebugInfo(`Trying: ${JSON.stringify(currentConstraints)}`)

        try {
            const newStream = await navigator.mediaDevices.getUserMedia(currentConstraints as MediaStreamConstraints)

            if (!isComponentActive.current) {
                newStream.getTracks().forEach(t => t.stop())
                return
            }

            streamRef.current = newStream

            setLoading(false)
            setDebugInfo("")

            if (videoRef.current) {
                videoRef.current.srcObject = newStream

                videoRef.current.play().catch(e => {
                    console.warn("Autoplay blocked/failed", e)
                    if (isComponentActive.current) setNeedsManualStart(true)
                })
            }

        } catch (err: any) {
            console.error("Camera error:", err)

            if (!isComponentActive.current) return;

            if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
                console.log("Constraint failed, retrying...")
                startCamera(retryCount + 1)
                return
            }

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Camera permission denied. Please allow access in browser settings.")
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError("No camera found on this device.")
            } else {
                setDebugInfo(`Error: ${err.name} - ${err.message}`)
                if (retryCount < constraintsList.length - 1) {
                    startCamera(retryCount + 1)
                    return
                }
                setError("Unable to access camera.")
            }

            setLoading(false)
        }
    }, [facingMode, stopTracks])

    useEffect(() => {
        isComponentActive.current = true
        startCamera()

        const timer = setTimeout(() => {
            if (isComponentActive.current && !streamRef.current) {
                setNeedsManualStart(true)
                setLoading(false)
            }
        }, 5000)

        return () => {
            clearTimeout(timer)
            if (!isComponentActive.current) stopTracks()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode])

    const handleCapture = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context) {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                setError("Video stream not ready yet.")
                return
            }

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            if (facingMode === 'user') {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
                if (blob) {
                    stopTracks()
                    onCapture(blob)
                } else {
                    setError("Failed to capture image")
                }
            }, "image/jpeg", 0.95)
        }
    }

    const switchCamera = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation()
        stopTracks()
        onClose()
    }

    if (!mounted) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
        >
            <canvas ref={canvasRef} className="hidden" />

            <div className="relative w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors"
                        type="button"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="font-medium text-sm drop-shadow-md">Take Photo</div>
                    <div className="w-10" />
                </div>

                <div className="flex-1 relative flex items-center justify-center bg-zinc-900 overflow-hidden w-full">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />

                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
                            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                            <span className="text-sm text-gray-400">Starting camera...</span>
                            <div className="text-[10px] text-gray-600 font-mono mt-2 px-4 text-center max-w-xs">{debugInfo}</div>
                        </div>
                    )}

                    {needsManualStart && !loading && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30 bg-black/80">
                            <button
                                onClick={() => startCamera(0)}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition"
                            >
                                <Play className="w-12 h-12 text-green-500 fill-current" />
                                <span className="font-medium">Tap to Start Camera</span>
                            </button>
                            <p className="text-xs text-gray-400 max-w-[200px] text-center">Browser requires interaction</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-40 bg-black/90">
                            <div className="max-w-xs flex flex-col items-center gap-4 text-red-400">
                                <AlertCircle className="w-10 h-10" />
                                <p className="font-medium">{error}</p>
                                {debugInfo && <p className="text-xs text-red-900/50 break-all">{debugInfo}</p>}

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 py-2 px-4 rounded-lg bg-zinc-800 text-gray-300 hover:bg-zinc-700 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => startCamera(0)}
                                        className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-32 bg-black flex items-center justify-around px-8 pb-4 pt-2 shrink-0">
                    <div className="w-12 h-12" />

                    <button
                        onClick={handleCapture}
                        disabled={loading || !!error || needsManualStart}
                        className="relative group disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
                        type="button"
                    >
                        <div className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-gray-200 transition-colors shadow-lg" />
                        </div>
                    </button>

                    <button
                        onClick={switchCamera}
                        disabled={loading || !!error || needsManualStart}
                        className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 flex flex-col items-center gap-1"
                        type="button"
                    >
                        <SwitchCamera className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
