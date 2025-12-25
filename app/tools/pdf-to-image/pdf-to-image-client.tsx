"use client"

import { useState, useEffect } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import JSZip from "jszip"

export default function PdfToImageClient() {
    const [images, setImages] = useState<string[]>([])
    const [originalName, setOriginalName] = useState<string>("")
    const [isZipping, setIsZipping] = useState(false)

    useEffect(() => {
        const initPdfJs = async () => {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
        }
        initPdfJs()
    }, [])

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        setOriginalName(file.name.replace(/\.[^/.]+$/, ""))

        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = await import('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const urlList: string[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // High quality 2x

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) continue;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext as any).promise;

            const imgUrl = canvas.toDataURL("image/jpeg", 0.9);
            urlList.push(imgUrl);
        }
        setImages(urlList)
    }

    const downloadImages = async () => {
        if (images.length === 0) return

        if (images.length === 1) {
            // Download processed single image
            saveAs(images[0], `${originalName}-page-1.jpg`)
        } else {
            // Zip multiple
            setIsZipping(true)
            const zip = new JSZip()
            const folder = zip.folder("images")

            images.forEach((dataUrl, idx) => {
                const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "")
                folder?.file(`${originalName}-page-${idx + 1}.jpg`, base64Data, { base64: true })
            })

            const content = await zip.generateAsync({ type: "blob" })
            saveAs(content, `${originalName}-images.zip`)
            setIsZipping(false)
        }
    }

    return (
        <ToolShell
            title="PDF to Image Converter"
            description="Convert PDF pages into high-quality JPG images. Downloads as a ZIP for multiple pages."
            acceptedFileTypes={{
                "application/pdf": [".pdf"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your images are ready.</p>

                    {images.length > 0 && (
                        <div className="w-full max-w-4xl p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4 text-left">Page Previews ({images.length})</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((src, idx) => (
                                    <div key={idx} className="relative aspect-[1/1.4] bg-white rounded-lg shadow-sm border overflow-hidden group">
                                        <img src={src} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Page {idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button size="lg" onClick={downloadImages} disabled={isZipping} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <Download className="w-4 h-4" />
                            {isZipping ? "Zipping..." : (images.length > 1 ? "Download All (ZIP)" : "Download Image")}
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}
