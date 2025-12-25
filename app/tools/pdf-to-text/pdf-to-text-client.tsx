"use client"

import { useState, useEffect } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"

export default function PdfToTextClient() {
    const [extractedText, setExtractedText] = useState<string>("")
    const [copied, setCopied] = useState(false)
    const [originalName, setOriginalName] = useState<string>("")

    useEffect(() => {
        // Dynamically import pdfjs to avoid SSR issues
        const initPdfJs = async () => {
            const pdfjsLib = await import('pdfjs-dist');
            // Set worker to local public file for reliability
            pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
        }
        initPdfJs()
    }, [])

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        setOriginalName(file.name.replace(/\.[^/.]+$/, ""))

        // We only process one file for now as text extraction is usually per-doc
        const arrayBuffer = await file.arrayBuffer()

        const pdfjsLib = await import('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = ""

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');

            fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
        }

        setExtractedText(fullText)
    }

    const downloadText = () => {
        const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" })
        const fileName = originalName ? `${originalName}-extracted.txt` : "extracted-text.txt"
        saveAs(blob, fileName)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <ToolShell
            title="PDF to Text Converter"
            description="Extract text from your PDF documents securely. Works locally in your browser."
            acceptedFileTypes={{
                "application/pdf": [".pdf"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Extracted Text</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                            <Button size="sm" onClick={downloadText} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm">
                                <Download className="w-4 h-4" /> Download .txt
                            </Button>
                        </div>
                    </div>

                    <div className="w-full h-96 p-4 rounded-md border bg-muted/50 overflow-auto whitespace-pre-wrap font-mono text-sm">
                        {extractedText}
                    </div>
                </div>
            )}
        />
    )
}
