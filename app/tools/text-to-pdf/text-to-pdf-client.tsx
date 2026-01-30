"use client"

import { useState } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"

export default function TextToPdfClient() {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
    const [textContent, setTextContent] = useState<string>("")
    const [originalName, setOriginalName] = useState<string>("")

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        setOriginalName(file.name.replace(/\.[^/.]+$/, ""))

        const text = await file.text()
        setTextContent(text)

        // Generate PDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        })

        doc.setFont("courier", "normal")
        doc.setFontSize(11)

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const marginLeft = 15
        const marginRight = 15
        const marginTop = 15
        const marginBottom = 20
        const maxLineWidth = pageWidth - marginLeft - marginRight

        const usableHeight = pageHeight - marginTop - marginBottom
        const maxLinesPerPage = 45
        const lineHeight = usableHeight / maxLinesPerPage

        const paragraphs = text.replace(/\r\n/g, "\n").split("\n")
        let y = marginTop

        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) {
                if (y + lineHeight > pageHeight - marginBottom) {
                    doc.addPage()
                    y = marginTop
                }
                y += lineHeight
                continue
            }

            const lines = doc.splitTextToSize(paragraph, maxLineWidth) as string[]
            for (const line of lines) {
                if (y + lineHeight > pageHeight - marginBottom) {
                    doc.addPage()
                    y = marginTop
                }
                doc.text(line, marginLeft, y)
                y += lineHeight
            }
        }

        const blob = doc.output("blob")
        setPdfBlob(blob)
    }

    const downloadPdf = () => {
        if (!pdfBlob) return
        saveAs(pdfBlob, `${originalName}-converted.pdf`)
    }

    return (
        <ToolShell
            title="Text to PDF Converter"
            description="Convert simple text files into formatted PDF documents."
            acceptedFileTypes={{
                "text/plain": [".txt"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your PDF is ready.</p>

                    <div className="w-full max-w-2xl text-left bg-gray-50 border p-4 rounded-lg shadow-sm">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Content Preview</h4>
                        <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {textContent}
                        </pre>
                    </div>

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
