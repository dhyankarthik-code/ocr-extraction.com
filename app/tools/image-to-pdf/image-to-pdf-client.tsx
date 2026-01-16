"use client"

import { useState } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function ImageToPdfClient() {
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [originalName, setOriginalName] = useState<string>("")

    const handleProcess = async (files: File[]) => {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create()
        const previews: string[] = []

        if (files.length > 0) {
            setOriginalName(files[0].name.replace(/\.[^/.]+$/, ""))
        }

        for (const file of files) {
            const imageBytes = await file.arrayBuffer()

            // Create preview
            const blob = new Blob([imageBytes], { type: file.type });
            const previewUrl = URL.createObjectURL(blob);
            previews.push(previewUrl);

            let image
            // Embed the image
            if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
                image = await pdfDoc.embedJpg(imageBytes)
            } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
                image = await pdfDoc.embedPng(imageBytes)
            } else {
                continue
            }

            const { width, height } = image.scale(1)
            const page = pdfDoc.addPage([width, height])
            page.drawImage(image, { x: 0, y: 0, width, height })
        }

        setImagePreviews(previews)
        const pdfData = await pdfDoc.save()
        setPdfBytes(pdfData)
    }

    const downloadPdf = () => {
        if (!pdfBytes) return
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
        const fileName = originalName ? `${originalName}-extracted.pdf` : "converted-images.pdf"
        saveAs(blob, fileName)
    }

    return (
        <ToolShell
            title="Image to PDF Converter"
            description="Convert your images (JPG, PNG) into a single PDF file instantly. No upload needed - runs 100% in your browser."
            acceptedFileTypes={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your PDF is ready for download.</p>

                    {imagePreviews.length > 0 && (
                        <div className="w-full max-w-4xl p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4 text-left">Included Images ({imagePreviews.length})</h4>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
                                        <img src={src} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button size="lg" onClick={downloadPdf} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}
