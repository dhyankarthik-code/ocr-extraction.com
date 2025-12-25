"use client"

import { useState, useEffect } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import pptxgen from "pptxgenjs"

export default function PdfToPptClient() {
    const [pptPres, setPptPres] = useState<any | null>(null)
    const [slidesPreview, setSlidesPreview] = useState<string[]>([])
    const [originalName, setOriginalName] = useState<string>("")

    useEffect(() => {
        // Dynamically import pdfjs to avoid SSR issues
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

        // Create new Pres
        const pres = new pptxgen();
        const previews: string[] = []

        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // 2x scale

            // Render to canvas
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) continue;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            // Explicit cast
            await page.render(renderContext as any).promise;

            // Get image data
            const imgData = canvas.toDataURL("image/jpeg", 0.8);
            previews.push(imgData);

            // Add Slide
            const slide = pres.addSlide();
            slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
        }

        setSlidesPreview(previews)
        setPptPres(pres)
    }

    const downloadPpt = () => {
        if (!pptPres) return
        const fileName = originalName ? `${originalName}-extracted.pptx` : "converted-presentation.pptx"
        pptPres.writeFile({ fileName })
    }

    return (
        <ToolShell
            title="PDF to PowerPoint Converter"
            description="Convert PDF slides to editable PowerPoint presentations. High-quality image preservation."
            acceptedFileTypes={{
                "application/pdf": [".pdf"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your PowerPoint presentation is ready.</p>

                    {slidesPreview.length > 0 && (
                        <div className="w-full max-w-4xl p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4 text-left">Slide Preview ({slidesPreview.length} slides)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {slidesPreview.map((src, idx) => (
                                    <div key={idx} className="relative aspect-video bg-white rounded-lg shadow-sm border overflow-hidden">
                                        <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-full object-contain" />
                                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button size="lg" onClick={downloadPpt} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <Download className="w-4 h-4" /> Download PPT
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}
