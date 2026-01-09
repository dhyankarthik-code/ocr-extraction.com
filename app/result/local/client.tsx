"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, FileText, Search, ArrowLeft, Loader2, Upload } from "lucide-react"
import { saveAs } from "file-saver"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import DocumentChat from "@/components/document-chat"
import * as XLSX from "xlsx"
import pptxgen from "pptxgenjs"
import { jsPDF } from "jspdf"
import ShinyText from "@/components/ui/shiny-text"


export default function LocalResultPage() {
    const router = useRouter()
    const [text, setText] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<Array<{ text: string, similarity: number }>>([])
    const [searching, setSearching] = useState(false)
    const [summary, setSummary] = useState("")
    const [generatingSummary, setGeneratingSummary] = useState(false)
    const [isMultiPage, setIsMultiPage] = useState(false)
    const [isBatch, setIsBatch] = useState(false)
    const [pages, setPages] = useState<Array<{ pageNumber: number, text: string, imageName?: string }>>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [fileName, setFileName] = useState<string>("document")
    const [reportFormatModal, setReportFormatModal] = useState(false)
    const [isCustomReportOpen, setIsCustomReportOpen] = useState(false)

    useEffect(() => {
        const storedData = sessionStorage.getItem("ocr_result")
        if (!storedData) {
            router.push("/")
            return
        }

        try {
            const parsed = JSON.parse(storedData)
            const baseName = parsed.fileName?.split('.').slice(0, -1).join('.') || "document"
            setFileName(baseName)

            if ((parsed.isPDF || parsed.isBatch) && parsed.pages) {
                setIsMultiPage(true)
                setIsBatch(parsed.isBatch === true)
                setPages(parsed.pages)
                setCurrentPage(1)
                setText(parsed.pages[0]?.text || "")
            } else if (parsed.text) {
                setText(parsed.text)
            } else if (typeof parsed === 'string') {
                setText(parsed)
            } else {
                setText(storedData)
            }
        } catch {
            setText(storedData)
        }
        setLoading(false)
    }, [router])

    // Debounced semantic search
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 3) {
            setSearchResults([])
            return
        }

        console.log('Triggering search for:', searchTerm)

        const timeoutId = setTimeout(async () => {
            setSearching(true)
            console.log('Calling semantic search API...')
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchTerm, text: getFullText() }),
                })

                console.log('API Response status:', response.status)

                if (response.ok) {
                    const data = await response.json()
                    console.log('Search results:', data)
                    setSearchResults(data.results || [])
                } else {
                    const errorData = await response.json()
                    console.error('Search API error:', errorData)
                    alert(`Search failed: ${errorData.error || 'Unknown error'}`)
                }
            } catch (error) {
                console.error('Search failed:', error)
                alert(`Search error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            } finally {
                setSearching(false)
            }
        }, 500) // 500ms debounce

        return () => clearTimeout(timeoutId)
    }, [searchTerm, isMultiPage, pages, text])

    // Get full text from all pages for download
    const getFullText = () => {
        if (isMultiPage && pages.length > 0) {
            return pages.map((page, idx) => {
                const header = isBatch
                    ? `--- Image ${idx + 1}: ${page.imageName || 'Untitled'} ---`
                    : `--- Page ${idx + 1} ---`;
                return `${header}\n\n${page.text}`;
            }).join('\n\n');
        }
        return text;
    };

    const handleDownloadTxt = () => {
        const fullText = getFullText();
        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" })
        saveAs(blob, `${fileName} ocr result.txt`)
    }

    const handleDownloadDocx = async () => {
        const fullText = getFullText();
        const doc = new Document({
            sections: [{
                properties: {},
                children: fullText.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })),
            }],
        })
        const blob = await Packer.toBlob(doc)
        saveAs(blob, `${fileName} ocr result.docx`)
    }

    const handleDownloadPdf = () => {
        try {
            const doc = new jsPDF()
            const fullText = getFullText()

            const pageWidth = doc.internal.pageSize.getWidth()
            const margin = 15
            const maxLineWidth = pageWidth - (margin * 2)
            const lineHeight = 7

            // Clean text to remove characters that might cause issues (basic sanitization)
            // jsPDF handles most things, but let's be safe against control chars
            const cleanText = fullText.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, "")

            const lines = doc.splitTextToSize(cleanText, maxLineWidth)
            let cursorY = 20

            // Add content
            lines.forEach((line: string) => {
                if (cursorY > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage()
                    cursorY = 20
                }
                doc.text(line, margin, cursorY)
                cursorY += lineHeight
            })

            doc.save(`${fileName} ocr result.pdf`)
        } catch (error) {
            console.error("PDF generation failed:", error)
            alert("Failed to generate PDF. Please try 'Word' or 'TXT' format if the issue persists.")
        }
    }

    const handleDownloadXlsx = () => {
        const fullText = getFullText()
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet([[fullText]])
        // Set column width for better readability
        ws['!cols'] = [{ wch: 100 }];
        XLSX.utils.book_append_sheet(wb, ws, "OCR Result")
        XLSX.writeFile(wb, `${fileName} ocr result.xlsx`)
    }

    const handleDownloadPpt = async () => {
        const pres = new pptxgen()

        if (isMultiPage && pages.length > 0) {
            pages.forEach((page, idx) => {
                let slide = pres.addSlide()
                slide.addText(`Page ${idx + 1}`, { x: 0.5, y: 0.5, fontSize: 14, bold: true })
                slide.addText(page.text, { x: 0.5, y: 1.0, w: '90%', h: '80%', fontSize: 12, color: '363636' })
            })
        } else {
            let slide = pres.addSlide()
            slide.addText(text, { x: 0.5, y: 0.5, w: '90%', h: '90%', fontSize: 12, color: '363636' })
        }
        await pres.writeFile({ fileName: `${fileName} ocr result.pptx` })
    }

    const handleDownloadReport = async (format: 'txt' | 'docx' | 'pdf' | 'xlsx' | 'pptx') => {
        if (format === 'txt') {
            const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
            saveAs(blob, `${fileName} AI Report.txt`)
        } else if (format === 'docx') {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: summary.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })),
                }],
            })
            const blob = await Packer.toBlob(doc)
            saveAs(blob, `${fileName} AI Report.docx`)
        } else if (format === 'pdf') {
            const pdfDoc = await PDFDocument.create()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            let page = pdfDoc.addPage()
            const { width, height } = page.getSize()
            const fontSize = 11
            const lineHeight = fontSize + 4
            let y = height - 50

            const lines = summary.split('\n')
            for (const line of lines) {
                if (y < 50) {
                    page = pdfDoc.addPage()
                    y = height - 50
                }

                const isBold = line.match(/^\*\*(.+?)\*\*:?/)
                const text = isBold ? isBold[1] : line.replace(/^[•\-]\s*/, '')
                const useFont = isBold ? boldFont : font
                const useFontSize = isBold ? fontSize + 2 : fontSize

                if (text.trim()) {
                    page.drawText(text, {
                        x: line.startsWith('-') || line.startsWith('•') ? 70 : 50,
                        y,
                        size: useFontSize,
                        font: useFont,
                        color: rgb(0, 0, 0)
                    })
                }
                y -= lineHeight
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
            saveAs(blob, `${fileName} AI Report.pdf`)
        } else if (format === 'xlsx') {
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet([[summary]])
            ws['!cols'] = [{ wch: 100 }];
            XLSX.utils.book_append_sheet(wb, ws, "AI Report")
            XLSX.writeFile(wb, `${fileName} AI Report.xlsx`)
        } else if (format === 'pptx') {
            const pres = new pptxgen()
            let slide = pres.addSlide()
            slide.addText("AI Report", { x: 0.5, y: 0.5, fontSize: 18, bold: true })
            slide.addText(summary, { x: 0.5, y: 1.0, w: '90%', h: '80%', fontSize: 12, color: '363636' })
            await pres.writeFile({ fileName: `${fileName} AI Report.pptx` })
        }
        setReportFormatModal(false)
    }

    const handleGenerateSummary = async () => {
        setGeneratingSummary(true)
        const start = Date.now()
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

            const response = await fetch("/api/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: getFullText().slice(0, 100000) }),
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Failed to generate summary")
            const summaryValue = typeof data.summary === "string"
                ? data.summary
                : Array.isArray(data.summary)
                    ? data.summary.map((v: any) => (typeof v === "string" ? v : (v?.content ?? JSON.stringify(v)))).join("")
                    : (data?.summary?.content ?? JSON.stringify(data.summary))
            setSummary(summaryValue)
        } catch (error) {
            console.error("Summary generation failed", error)
            alert("Failed to generate summary. Please try again.")
        } finally {
            // Ensure at least 1s of loading state to avoid flicker
            const elapsed = Date.now() - start
            setTimeout(() => setGeneratingSummary(false), Math.max(0, 1000 - elapsed))
        }
    }

    const highlightedText = () => {
        // If no search or semantic results, show full text
        if (!searchTerm || (searchResults.length === 0 && !searching)) {
            return text
        }

        // If searching, show loading
        if (searching) {
            return text
        }

        // Highlight semantic search results
        if (searchResults.length > 0) {
            let highlightedContent = text
            let hasMatches = false

            // Try to highlight each result chunk with better matching
            searchResults.forEach((result) => {
                // Split result into significant words (3+ chars) for flexible matching
                const words = result.text
                    .split(/\s+/)
                    .filter(w => w.length >= 3)
                    .slice(0, 5) // Use first 5 significant words
                    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

                if (words.length > 0) {
                    // Create a pattern that matches if most words appear nearby
                    const pattern = words.join('|')
                    const regex = new RegExp(`(${pattern})`, 'gi')
                    const matches = highlightedContent.match(regex)

                    if (matches && matches.length > 0) {
                        hasMatches = true
                        highlightedContent = highlightedContent.replace(
                            regex,
                            `<mark class="bg-yellow-300 font-semibold px-0.5 rounded" data-similarity="${Math.round(result.similarity * 100)}%">$1</mark>`
                        )
                    }
                }
            })

            if (hasMatches) {
                return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
            }
        }

        return text
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="bg-gray-50 flex-1 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <div className="flex justify-center md:justify-start">
                        <Button
                            onClick={() => router.push("/")}
                            className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-[1.02] py-4 px-8 text-lg font-bold"
                        >
                            <Upload className="w-4 h-4" /> Upload More Files
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 w-full md:w-auto md:col-start-2">
                        <span className="text-xl font-bold text-gray-700 text-center">Download the extracted data in:</span>
                        <div className="flex gap-2 flex-wrap justify-center w-full">
                            <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white border-none min-w-[80px]" variant="outline" onClick={handleDownloadTxt}>
                                <FileText className="w-4 h-4 mr-2" /> TXT
                            </Button>
                            <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white border-none min-w-[80px]" variant="outline" onClick={handleDownloadDocx}>
                                <FileText className="w-4 h-4 mr-2" /> Word
                            </Button>
                            <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white border-none min-w-[80px]" variant="outline" onClick={handleDownloadPdf}>
                                <FileText className="w-4 h-4 mr-2" /> PDF
                            </Button>
                            <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white border-none min-w-[80px]" variant="outline" onClick={handleDownloadXlsx}>
                                <FileText className="w-4 h-4 mr-2" /> Excel
                            </Button>
                            <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white border-none min-w-[80px]" variant="outline" onClick={handleDownloadPpt}>
                                <FileText className="w-4 h-4 mr-2" /> PPT
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-col space-y-3 pb-4">
                                {/* Page Indicator for Multi-page Documents */}
                                {isMultiPage && (
                                    <div className="flex items-center justify-between w-full relative z-10">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md">
                                            <span className="text-lg font-bold">
                                                {isBatch
                                                    ? `🖼️ Image ${currentPage} of ${pages.length}: ${pages[currentPage - 1]?.imageName || ''}`
                                                    : `📄 Page ${currentPage} of ${pages.length}`
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-md border border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newPage = Math.max(1, currentPage - 1);
                                                    setCurrentPage(newPage);
                                                    setText(pages[newPage - 1]?.text || "");
                                                }}
                                                disabled={currentPage === 1}
                                                className="px-4 font-semibold hover:bg-blue-50 disabled:opacity-50"
                                            >
                                                ◀ Prev
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newPage = Math.min(pages.length, currentPage + 1);
                                                    setCurrentPage(newPage);
                                                    setText(pages[newPage - 1]?.text || "");
                                                }}
                                                disabled={currentPage === pages.length}
                                                className="px-4 font-semibold hover:bg-blue-50 disabled:opacity-50"
                                            >
                                                Next ▶
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="text-xl font-bold">
                                        {isMultiPage ? `Extracted Text - Page ${currentPage}` : 'Extracted Text'}
                                    </CardTitle>
                                    <div className="relative w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="Search in text..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-4 bg-gray-50 rounded-md border font-mono text-sm whitespace-pre-wrap">
                                    {highlightedText()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* AI Document Chat */}
                        <div className="h-[600px]">
                            <DocumentChat documentText={getFullText()} />
                        </div>
                    </div>
                </div>

                {/* Floating AI Report Button */}
                {!summary && !generatingSummary && (
                    <button
                        onClick={handleGenerateSummary}
                        className="fixed bottom-6 right-6 z-[1000] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group"
                        title="Generate AI Report"
                    >
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">✨</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-sm">Generate AI Report and Download</span>
                            <span className="text-xs opacity-90">Click to generate</span>
                        </div>
                    </button>
                )}

                {/* Shiny Loading Overlay */}
                {generatingSummary && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1001] backdrop-blur-md">
                        <div className="text-center">
                            <ShinyText
                                text="Generating..."
                                className="text-8xl font-black text-white drop-shadow-2xl"
                                speed={1.5}
                            />
                        </div>
                    </div>
                )}

                {/* AI Report Modal */}
                {summary && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-4 backdrop-blur-sm" onClick={() => setSummary("")}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            {/* Floating Action Buttons at Top */}
                            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-b border-purple-100 flex-shrink-0 z-10 rounded-t-3xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white p-2 rounded-xl shadow-sm">
                                            <img src="/logo.png" alt="Infy Galaxy" className="w-12 h-12 rounded-lg" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-purple-900">AI Report</h2>
                                    </div>
                                    <button
                                        onClick={() => setSummary("")}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setReportFormatModal(true)}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> Download Report
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSummary("");
                                            setIsCustomReportOpen(true);
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-base transition-all"
                                    >
                                        Get Customized Report
                                    </button>
                                </div>
                            </div>
                            {/* Scrollable Content */}
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="text-gray-800 leading-relaxed space-y-3 text-sm">
                                    {summary.split('\n').map((line, index) => {
                                        // Clean markdown: remove ** for bold, just render as regular text
                                        const cleanLine = line.replace(/\*\*/g, '');

                                        // Check if it's a heading (ends with :)
                                        if (cleanLine.trim().endsWith(':') && !cleanLine.trim().startsWith('-')) {
                                            return (
                                                <h4 key={index} className="font-bold text-gray-900 text-base mt-4 mb-2">
                                                    {cleanLine.trim()}
                                                </h4>
                                            );
                                        }
                                        // List items
                                        if (cleanLine.trim().startsWith('-')) {
                                            return (
                                                <p key={index} className="pl-6 text-gray-700 leading-relaxed mb-1.5">
                                                    • {cleanLine.trim().substring(1).trim()}
                                                </p>
                                            );
                                        }
                                        // Regular paragraphs
                                        if (cleanLine.trim()) {
                                            return <p key={index} className="text-gray-700 leading-relaxed mb-2">{cleanLine}</p>;
                                        }
                                        return <div key={index} className="h-1"></div>;
                                    })}
                                </div>
                                {/* Format Selection Modal */}
                                <div className="mt-6">
                                    {reportFormatModal && (
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
                                            <p className="text-sm font-bold text-purple-900 mb-3 text-center">Select Download Format</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                <button
                                                    onClick={() => handleDownloadReport('txt')}
                                                    className="bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                                >
                                                    <FileText className="w-3 h-3" /> Text File (.txt)
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport('docx')}
                                                    className="bg-white hover:bg-purple-100 text-blue-700 border border-blue-200 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                                >
                                                    <FileText className="w-3 h-3" /> Word Doc (.docx)
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport('pdf')}
                                                    className="bg-white hover:bg-purple-100 text-red-700 border border-red-200 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                                >
                                                    <FileText className="w-3 h-3" /> PDF File (.pdf)
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport('xlsx')}
                                                    className="bg-white hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                                >
                                                    <FileText className="w-3 h-3" /> Excel (.xlsx)
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadReport('pptx')}
                                                    className="bg-white hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                                >
                                                    <FileText className="w-3 h-3" /> PPT (.pptx)
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setReportFormatModal(false)}
                                                className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customized Report Chat Modal */}
                {isCustomReportOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-4 backdrop-blur-sm" onClick={() => setIsCustomReportOpen(false)}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b flex items-center justify-between flex-shrink-0 rounded-t-3xl">
                                <div className="flex items-center gap-5">
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        <img src="/logo.png" alt="Infy Galaxy" className="w-12 h-12 rounded-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-blue-900 leading-tight">Get Customized AI Report</h2>
                                        <p className="text-[10px] text-blue-600 font-medium">Ask for specific analysis, tables, or translations</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCustomReportOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 min-h-0">
                                <DocumentChat documentText={getFullText()} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
