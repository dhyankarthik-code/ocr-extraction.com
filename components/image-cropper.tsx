
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import ReactCrop, { Crop, PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Check, X, Loader2 } from "lucide-react"
import getCroppedImg from "@/lib/crop-image"
import { Slider } from "@/components/ui/slider"

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [rotation, setRotation] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Default to full image crop (100%)
    setCrop({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    })
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

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">

      <div className="flex flex-col items-center w-full max-w-5xl gap-6">
        <div className="relative w-full h-[70vh] flex items-center justify-center bg-zinc-900/50 rounded-xl border border-white/10 shadow-2xl overflow-hidden shrink-0">
          {!crop && <div className="absolute text-white/50 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading image...</div>}

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
              style={{ transform: `rotate(${rotation}deg)`, maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }}
              onLoad={onImageLoad}
              className="transition-transform duration-200"
            />
          </ReactCrop>
        </div>

        {/* Controls Overlay - Now relative below image */}
        <div className="relative mt-6 w-auto min-w-[320px] max-w-[90vw] bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-full p-2 px-6 flex flex-col sm:flex-row items-center gap-4 shadow-xl z-[101]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider w-12 text-center">Rotate</span>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={90}
              onValueChange={(vals) => setRotation(vals[0])}
              className="w-32"
            />
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-medium transition-all text-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={processing || !completedCrop}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Crop & Upload
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
