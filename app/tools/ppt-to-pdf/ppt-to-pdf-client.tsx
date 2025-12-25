"use client"

import { useState } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import JSZip from "jszip"

interface SlideData {
    id: number;
    title: string;
    content: string[];
}

export default function PptToPdfClient() {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
    const [originalName, setOriginalName] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [slidesPreview, setSlidesPreview] = useState<SlideData[]>([])

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        setOriginalName(file.name.replace(/\.[^/.]+$/, ""))
        setStatus("Parsing PPTX structure...")

        try {
            const zip = await JSZip.loadAsync(file)

            // 1. Find Slides
            // PPTX slides are in ppt/slides/slide1.xml, slide2.xml etc.
            const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"))

            // Sort natural order
            slideFiles.sort((a, b) => {
                const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0")
                const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0")
                return numA - numB
            })

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [10, 5.625] // 16:9 Aspect Ratio roughly
            })

            setStatus(`Found ${slideFiles.length} slides. Converting...`)
            const previewData: SlideData[] = []

            for (let i = 0; i < slideFiles.length; i++) {
                if (i > 0) doc.addPage([10, 5.625], "landscape")

                const slideXmlText = await zip.files[slideFiles[i]].async("text")
                const parser = new DOMParser()
                const xmlDoc = parser.parseFromString(slideXmlText, "text/xml")

                // Extract Text
                const textElements = xmlDoc.getElementsByTagName("a:t") // Powerpoint text tag
                let slideText = ""
                for (let j = 0; j < textElements.length; j++) {
                    slideText += textElements[j].textContent + "\n"
                }

                // Simple Rect for background
                doc.setFillColor(255, 255, 255)
                doc.rect(0, 0, 10, 5.625, "F")

                // Title/Content Heuristic: First text is often title
                const lines = slideText.split("\n").filter(l => l.trim().length > 0)

                // Add to preview
                previewData.push({
                    id: i + 1,
                    title: lines.length > 0 ? lines[0] : "(Untitled)",
                    content: lines.slice(1)
                })

                if (lines.length > 0) {
                    doc.setFontSize(24)
                    doc.setTextColor(0, 0, 0)
                    doc.text(lines[0], 0.5, 1) // Title roughly at top

                    doc.setFontSize(14)
                    doc.setTextColor(60, 60, 60)
                    let y = 2
                    for (let k = 1; k < lines.length; k++) {
                        if (y > 5) {
                            // margin
                        }
                        doc.text(`• ${lines[k]}`, 0.8, y)
                        y += 0.5
                    }
                } else {
                    doc.text("(Empty Slide or Image-only)", 5, 2.8, { align: "center" })
                }

                // Footer
                doc.setFontSize(10)
                doc.setTextColor(150, 150, 150)
                doc.text(`Slide ${i + 1}`, 9, 5.3)
            }

            setSlidesPreview(previewData)
            const blob = doc.output("blob")
            setPdfBlob(blob)
            setStatus("Ready")

        } catch (e) {
            console.error(e)
            setStatus("Error parsing PPTX")
        }
    }

    const downloadPdf = () => {
        if (!pdfBlob) return
        saveAs(pdfBlob, `${originalName}-presentation.pdf`)
    }

    return (
        <ToolShell
            title="PPT to PDF Converter"
            description="Convert PowerPoint presentations to PDF handouts. (Extracts text structure)"
            acceptedFileTypes={{
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your PDF presentation is ready.</p>

                    {slidesPreview.length > 0 && (
                        <div className="w-full max-w-4xl p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-4">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4 text-left">Slide Content Preview ({slidesPreview.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {slidesPreview.map((slide) => (
                                    <div key={slide.id} className="bg-white p-4 rounded-lg shadow-sm border h-48 overflow-y-auto text-left flex flex-col gap-2">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="text-xs font-bold text-gray-400">Slide {slide.id}</span>
                                        </div>
                                        <h5 className="font-bold text-sm line-clamp-2" title={slide.title}>{slide.title}</h5>
                                        <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                                            {slide.content.slice(0, 5).map((line, idx) => (
                                                <li key={idx} className="line-clamp-1" title={line}>{line}</li>
                                            ))}
                                            {slide.content.length > 5 && <li className="text-gray-400 italic">+{slide.content.length - 5} more...</li>}
                                        </ul>
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
