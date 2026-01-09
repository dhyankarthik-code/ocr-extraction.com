"use client"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Download, Settings, CheckCircle2, Loader2, Search } from "lucide-react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import ImageCropper from "@/components/image-cropper"

interface UploadZoneProps {
  onDrop: (files: File[]) => void
  uploading: boolean
  progress: number
  processingSteps?: string[]
  lastUploadTime?: number
}

// Helper to truncate middle of string
const truncateFilename = (name: string, maxLength: number = 20) => {
  if (name.length <= maxLength) return name
  const half = Math.floor((maxLength - 3) / 2)
  return name.slice(0, half) + "..." + name.slice(-half)
}

export default function UploadZone({ onDrop, uploading, progress, processingSteps = [], accept, hideUsage = false, lastUploadTime = 0 }: UploadZoneProps & { accept?: Record<string, string[]>, hideUsage?: boolean }) {
  const [isDragging, setIsDragging] = useState(false)
  const [quota, setQuota] = useState<{ used: number, limit: number } | null>(null)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [cropFileName, setCropFileName] = useState<string>("camera-capture.jpg")

  // Fetch quota on mount and when lastUploadTime changes
  useEffect(() => {
    if (hideUsage) return;

    fetch('/api/user/usage')
      .then(res => res.json())
      .then(data => {
        if (data.usageMB !== undefined) {
          setQuota({ used: data.usageMB, limit: data.limit })
        }
      })
      .catch(() => { }) // Ignore errors, just don't show bar
  }, [hideUsage, lastUploadTime])

  // Calculate usage percentage
  const usagePercent = quota ? Math.min((quota.used / quota.limit) * 100, 100) : 0
  const usedMB = quota ? quota.used.toFixed(1) : "0"

  // Color code usage: Green < 70%, Yellow < 90%, Red > 90%
  const usageColor = usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-yellow-500" : "bg-green-500"

  const defaultAccept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "image/bmp": [".bmp"],
    "image/svg+xml": [".svg"],
    "application/pdf": [".pdf"],
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Intercept single image uploads for cropping
      if (acceptedFiles.length === 1 && acceptedFiles[0].type.startsWith("image/") && !acceptedFiles[0].type.includes("svg")) {
        const file = acceptedFiles[0]
        setCropFileName(file.name)
        const reader = new FileReader()
        reader.onload = () => {
          setImageToCrop(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // Pass through strict files (PDFs, multiple images, etc.)
        onDrop(acceptedFiles)
      }
    },
    accept: accept || defaultAccept,
    multiple: true,
    disabled: uploading,
    noClick: false, // Ensure click works on dropzone
    noKeyboard: false
  })

  // Listen for custom trigger event from CTA button
  useEffect(() => {
    const handleTrigger = () => {
      open()
    }
    window.addEventListener('trigger-file-upload', handleTrigger)
    return () => window.removeEventListener('trigger-file-upload', handleTrigger)
  }, [open])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative w-full">
        {/* Main Drop Zone */}
        <div
          {...getRootProps()}
          className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-8 md:p-12
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center
          ${isDragActive ? "border-red-500 bg-red-50 scale-[1.02]" : "border-gray-300 hover:border-red-400 hover:bg-gray-50"}
          ${uploading ? "opacity-50 pointer-events-none border-gray-200" : ""}
        `}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <input {...getInputProps()} aria-label="File upload dropzone" />

          {/* Icon & Text */}
          <div className={`
          w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6
          transition-transform duration-300 group-hover:scale-110
          ${isDragActive ? "bg-red-100" : ""}
        `}>
            <Upload className={`w-10 h-10 text-red-700 ${isDragActive ? "animate-bounce" : ""}`} />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
            {isDragActive ? "Drop files here!" : "Select or Drop Files"}
          </h3>

          <p className="text-gray-500 text-center max-w-sm mb-8">
            Upload images or PDFs to extract text. Max 10MB total.
          </p>

          {/* Button-like visual */}
          <div className="flex gap-5 items-center justify-center flex-wrap">
            <div className="pointer-events-none">
              <InteractiveHoverButton
                text="Browse Files"
                aria-label="Browse Files"
                className="pointer-events-auto w-48"
              />
            </div>

            {/* Camera Button - Mobile Only */}
            <div className="md:hidden flex flex-col items-center gap-3 w-full">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                aria-label="Take Photo"
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    const file = files[0]
                    setCropFileName(file.name)
                    const reader = new FileReader()
                    reader.onload = () => {
                      setImageToCrop(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                    e.target.value = '' // Reset input
                  }
                }}
                className="hidden"
                id="camera-input"
              />
              <label htmlFor="camera-input" className="cursor-pointer w-full max-w-[200px]">
                <InteractiveHoverButton
                  text={
                    <span className="flex items-center gap-2">
                      {/* Custom "Modern Camera" Icon - Safe generic alternative to Instagram logo */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="3.5" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                      </svg>
                      Take Photo
                    </span>
                  }
                  className="w-full"
                  showDot={false}
                />
              </label>

              <p className="text-xs text-center text-gray-500 max-w-[260px]">
                Take a photo via camera and convert it to text immediately
              </p>
            </div>
          </div>
        </div>

        {/* Image Cropper Modal */}
        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCancel={() => setImageToCrop(null)}
            onCropComplete={(croppedBlob) => {
              const file = new File([croppedBlob], cropFileName, { type: "image/jpeg" })
              onDrop([file])
              setImageToCrop(null)
            }}
          />
        )}

        {/* Processing Overlay / Steps */}
        {uploading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-8 border border-gray-200 shadow-xl">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Image</h3>
                <p className="text-gray-500 text-sm">Please wait while we work our magic...</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps Log */}
              <div className="space-y-3 mt-4">
                {processingSteps.map((step, index) => {
                  // Determine if this step is likely a "Processing image X..." step which might contain a filename
                  const displayStep = step.length > 50 ? truncateFilename(step, 45) : step

                  const isCompleted = index < processingSteps.length - 1;
                  const isCurrent = index === processingSteps.length - 1;

                  return (
                    <div key={index} className="flex items-center gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-red-500 animate-spin flex-shrink-0" />
                      )}
                      <span className={`break-all ${isCurrent ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                        {displayStep}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quota Usage Bar (Shown for all logged-in users where quota data is loaded) */}
      {!hideUsage && quota && (
        <div className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center gap-4 text-xs md:text-sm">
          <span className="text-gray-600 font-medium whitespace-nowrap">Usage Limit:</span>
          <div className="flex-1 space-y-1">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${usageColor} transition-all duration-500`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-gray-500 text-[10px]">
              <span>{usedMB} MB used</span>
              <span>10 MB limit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
