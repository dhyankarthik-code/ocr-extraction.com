"use client"

import { useState, useRef, useEffect } from "react"
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Check, X, RefreshCw } from "lucide-react"
import getCroppedImg from "@/lib/crop-image"
import { Slider } from "@/components/ui/slider"

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [rotation, setRotation] = useState(0)
  const [processing, setProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 16 / 9))
  }

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return

    setProcessing(true)
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        completedCrop,
        rotation,
        { horizontal: false, vertical: false },
        imgRef.current
      )
      if (croppedBlob) {
        onCropComplete(croppedBlob)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to crop image")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl flex flex-col items-center gap-6">
        {/* Image Crop Area */}
        <div className="w-full h-[70vh] flex items-center justify-center overflow-auto rounded-xl bg-black/50">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{ transform: `rotate(${rotation}deg)`, maxHeight: '70vh', display: 'block' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md p-6 rounded-xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 w-full">
            <span className="text-white text-xs font-medium w-16">Rotate</span>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(vals) => setRotation(vals[0])}
              className="flex-1"
            />
            <span className="text-white text-xs font-medium w-16 text-right">{rotation}°</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={processing || !completedCrop}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {processing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
