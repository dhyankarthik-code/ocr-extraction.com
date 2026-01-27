"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Download,
    FileDocument as FileText,
    SearchMagnifyingGlass as Search,
    FileUpload as Upload,
    Globe,
    Chat,
} from "react-coolicons"
import { Loader2, X, File as FileIcon, Table as TableIcon, Presentation as PresentationIcon, FileType as FileTypeIcon, FileText as LucideFileText, Languages } from "lucide-react"
import { saveAs } from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import DocumentChat from "@/components/document-chat"
import { sendGAEvent } from "@/lib/gtag"

import * as XLSX from "xlsx"
import pptxgen from "pptxgenjs"
import ShinyText from "@/components/ui/shiny-text"
import PremiumLoadingOverlay from "@/components/ui/premium-loading"
import ReportChatModal from "@/components/report-chat-modal"
import { generatePdfFromText } from "@/lib/pdf-utils"



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
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [showTranslateDropdown, setShowTranslateDropdown] = useState(false)
    const translateDropdownRef = useRef<HTMLDivElement>(null)
    const desktopDownloadRef = useRef<HTMLDivElement>(null)
    const mobileDownloadRef = useRef<HTMLDivElement>(null)


    // Translation State
    const [translateLanguage, setTranslateLanguage] = useState("")
    const [translatedText, setTranslatedText] = useState("")
    const [isTranslating, setIsTranslating] = useState(false)
    const [languageSearch, setLanguageSearch] = useState("")
    const [translationScope, setTranslationScope] = useState<'current' | 'all'>('current')
    const [showTranslation, setShowTranslation] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showTranslationDownload, setShowTranslationDownload] = useState(false)
    const [showMobileDownload, setShowMobileDownload] = useState(false)
    const mobileDocDownloadRef = useRef<HTMLDivElement>(null)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (translateDropdownRef.current && !translateDropdownRef.current.contains(event.target as Node)) {
                setShowTranslateDropdown(false)
            }
            if (showTranslationDownload &&
                (!desktopDownloadRef.current || !desktopDownloadRef.current.contains(event.target as Node)) &&
                (!mobileDownloadRef.current || !mobileDownloadRef.current.contains(event.target as Node))
            ) {
                setShowTranslationDownload(false)
            }
            if (showMobileDownload &&
                (!mobileDocDownloadRef.current || !mobileDocDownloadRef.current.contains(event.target as Node))
            ) {
                setShowMobileDownload(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showTranslationDownload])

    const languages = [
        { code: "en", name: "English", flagCode: "gb" },
        { code: "es", name: "Spanish", flagCode: "es" },
        { code: "fr", name: "French", flagCode: "fr" },
        { code: "de", name: "German", flagCode: "de" },
        { code: "it", name: "Italian", flagCode: "it" },
        { code: "pt", name: "Portuguese", flagCode: "pt" },
        { code: "ru", name: "Russian", flagCode: "ru" },
        { code: "zh", name: "Chinese", flagCode: "cn" },
        { code: "ja", name: "Japanese", flagCode: "jp" },
        { code: "ko", name: "Korean", flagCode: "kr" },
        { code: "hi", name: "Hindi", flagCode: "in" },
        { code: "ar", name: "Arabic", flagCode: "sa" },
        { code: "id", name: "Indonesian", flagCode: "id" },
        { code: "nl", name: "Dutch", flagCode: "nl" },
        { code: "tr", name: "Turkish", flagCode: "tr" },
        { code: "pl", name: "Polish", flagCode: "pl" },
        { code: "ta", name: "Tamil", flagCode: "in" },
        { code: "te", name: "Telugu", flagCode: "in" },
        { code: "kn", name: "Kannada", flagCode: "in" },
        { code: "ml", name: "Malayalam", flagCode: "in" },
    ];

    useEffect(() => {
        // Ensure page starts at top
        window.scrollTo(0, 0)

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
        sendGAEvent({ action: 'file_download', category: 'Download', label: 'txt' })
        const fullText = getFullText();
        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" })
        saveAs(blob, `${fileName} ocr result.txt`)
    }

    const handleDownloadDocx = async () => {
        sendGAEvent({ action: 'file_download', category: 'Download', label: 'docx' })
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
        sendGAEvent({ action: 'file_download', category: 'Download', label: 'pdf' })
        const fullText = getFullText()
        const success = generatePdfFromText(fullText, `${fileName} ocr result`)
        if (!success) {
            alert("Failed to generate PDF. Please try 'Word' or 'TXT' format if the issue persists.")
        }
    }

    // Helper to parse text into a grid for Excel
    const parseTextToGrid = (text: string): string[][] => {
        if (!text) return [[]]

        const lines = text.split('\n');

        // Detect if it's a markdown table (checks if multiple lines contain pipes)
        const isMarkdownTable = lines.filter(l => l.trim().includes('|')).length > 1;

        const rows = lines.map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return [];

            if (isMarkdownTable && trimmedLine.includes('|')) {
                // Markdown Table Logic
                const cells = trimmedLine.split('|').map(cell => {
                    // Clean Markdown formatting (bold, italics)
                    return cell.replace(/\*\*|__/g, '').trim();
                });

                // Remove empty start/end cells that result from | start | end | style
                // Usually split('|') on "| a | b |" gives ["", " a ", " b ", ""]
                const validCells = cells.filter((cell, index, arr) => {
                    // Keep cell if it has content, OR if it's inside the table structure
                    // But usually we just want the content.
                    // Let's filter out purely empty start/end artifacts.
                    if (index === 0 && cell === '') return false;
                    if (index === arr.length - 1 && cell === '') return false;
                    return true;
                });

                // Check for separator line (e.g. "---", ":---", "---:")
                const isSeparator = validCells.every(cell => cell.match(/^[-:]+$/));
                if (isSeparator) return null; // Signal to filter this row out entirely

                return validCells;
            } else {
                // Fallback: Split by tabs or 2+ spaces
                return line.split(/\t|\s{2,}/).map(cell => cell.trim()).filter(cell => cell.length > 0);
            }
        });

        // Filter out null rows (separator lines) and ensure we return string[][]
        return rows.filter((row): row is string[] => row !== null && row.length > 0);
    }

    const handleDownloadXlsx = () => {
        sendGAEvent({ action: 'file_download', category: 'Download', label: 'xlsx' })
        const fullText = getFullText()
        const wb = XLSX.utils.book_new()

        const gridData = parseTextToGrid(fullText)
        const ws = XLSX.utils.aoa_to_sheet(gridData)

        // Auto-width columns based on content (max 50 chars width)
        const colWidths = gridData[0]?.map((_, colIndex) => ({
            wch: Math.min(50, Math.max(...gridData.map(row => (row[colIndex] || "").length)) + 2)
        })) || [{ wch: 20 }]

        ws['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws, "OCR Result")
        XLSX.writeFile(wb, `${fileName} ocr result.xlsx`)
    }

    const handleDownloadPpt = async () => {
        sendGAEvent({ action: 'file_download', category: 'Download', label: 'pptx' })
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
        sendGAEvent({ action: 'ai_report_download', category: 'AI Features', label: format })
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
            const success = generatePdfFromText(summary, `${fileName} AI Report`)
            if (!success) {
                alert("Failed to generate PDF report.")
            }
        } else if (format === 'xlsx') {
            const wb = XLSX.utils.book_new()
            const gridData = parseTextToGrid(summary)
            const ws = XLSX.utils.aoa_to_sheet(gridData)
            // Auto-width columns
            const colWidths = gridData[0]?.map((_, colIndex) => ({
                wch: Math.min(50, Math.max(...gridData.map(row => (row[colIndex] || "").length)) + 2)
            })) || [{ wch: 20 }]

            ws['!cols'] = colWidths;
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
        sendGAEvent({ action: 'ai_summary_generate', category: 'AI Features', label: 'Summary' })
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

    const handleTranslate = async (lang: string, scope: 'current' | 'all' = 'current') => {
        if (!lang) return;
        sendGAEvent({ action: 'translate_text', category: 'Translation', label: lang, scope: scope })
        setTranslateLanguage(lang);
        setIsTranslating(true);
        setShowTranslation(true);
        document.getElementById('translate-dropdown')?.classList.add('hidden');

        // Use scope to determine what to translate
        const textToTranslate = scope === 'all' ? getFullText() : text;

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToTranslate, targetLanguage: lang }),
            });
            const data = await response.json();
            if (response.ok) {
                setTranslatedText(data.translatedText);
            } else {
                alert(`Translation failed: ${data.error}`);
                setShowTranslation(false);
            }
        } catch (error) {
            console.error("Translation error:", error);
            alert("Failed to translate text.");
            setShowTranslation(false);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleDownloadTranslation = async (format: 'txt' | 'docx' | 'pdf' | 'xlsx' | 'pptx') => {
        if (!translatedText) return;
        sendGAEvent({ action: 'translation_download', category: 'Download', label: format })
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Translation_${translateLanguage}_${timestamp}`;

        if (format === 'txt') {
            const blob = new Blob([translatedText], { type: "text/plain;charset=utf-8" });
            saveAs(blob, `${filename}.txt`);
        } else if (format === 'docx') {
            const doc = new Document({
                sections: [{ children: translatedText.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })) }]
            });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${filename}.docx`);
        } else if (format === 'pdf') {
            const filename = `Translation_${translateLanguage}_${timestamp}`
            generatePdfFromText(translatedText, filename)
        } else if (format === 'xlsx') {
            const wb = XLSX.utils.book_new();
            const gridData = parseTextToGrid(translatedText);
            const ws = XLSX.utils.aoa_to_sheet(gridData);

            // Auto-width columns
            const colWidths = gridData[0]?.map((_, colIndex) => ({
                wch: Math.min(50, Math.max(...gridData.map(row => (row[colIndex] || "").length)) + 2)
            })) || [{ wch: 20 }]

            ws['!cols'] = colWidths;
            XLSX.utils.book_append_sheet(wb, ws, "Translation");
            XLSX.writeFile(wb, `${filename}.xlsx`);
        } else if (format === 'pptx') {
            const pres = new pptxgen();
            let slide = pres.addSlide();
            slide.addText(`${translateLanguage} Translation`, { x: 0.5, y: 0.5, fontSize: 18, bold: true });
            slide.addText(translatedText, { x: 0.5, y: 1.0, w: '90%', h: '80%', fontSize: 12, color: '363636' });
            await pres.writeFile({ fileName: `${filename}.pptx` });
        }
        setShowTranslationDownload(false);
    };


    const highlightedText = () => {
        // If no search or semantic results, show full text
        const hasSemanticResults = searchResults.length > 0;
        const hasSearchTerm = searchTerm && searchTerm.length > 2; // Min 3 chars for reliable search

        if (!hasSearchTerm && (!hasSemanticResults && !searching)) {
            return text
        }

        // Allow highlighting to proceed even if "searching" (API call) is in progress
        // This ensures the Exact Match Fallback works instantly.

        let highlightedContent = text
        let hasMatches = false

        // 1. Semantic Highlighting (Priority)
        if (hasSemanticResults) {
            searchResults.forEach((result) => {
                const escapedChunk = result.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                if (escapedChunk) {
                    const regex = new RegExp(`(${escapedChunk})`, 'gi')
                    if (regex.test(highlightedContent)) {
                        hasMatches = true
                        highlightedContent = highlightedContent.replace(
                            regex,
                            `<mark class="bg-red-600 text-white font-semibold px-1 rounded" data-similarity="${Math.round(result.similarity * 100)}%">$1</mark>`
                        )
                    }
                }
            })
        }

        // 2. Fallback: Exact Search Term Highlighting
        // Only run if NO semantic matches were applied, OR run it in addition?
        // Let's run it in addition but ensure we don't double-highlight inside existing marks.
        // Simplified approach: If semantic search failed to find anything but we have a search term, highlight it.
        if (hasSearchTerm && !hasMatches) {
            const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedTerm})`, 'gi');
            if (regex.test(highlightedContent)) {
                hasMatches = true;
                highlightedContent = highlightedContent.replace(
                    regex,
                    `<mark class="bg-red-600 text-white font-bold px-1 rounded shadow-sm ring-1 ring-red-300">$1</mark>`
                );
            }
        }

        if (hasMatches) {
            return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
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
                        {/* Translation Side-by-Side Comparison */}


                        <Card>
                            <CardHeader className="flex flex-col space-y-4 pb-4">
                                {/* Combined Header: Title, Controls, Search, Translate */}
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                                        <CardTitle className="text-xl font-bold whitespace-nowrap text-gray-800">
                                            {isMultiPage ? `Page ${currentPage}` : 'Extracted Text'}
                                        </CardTitle>

                                        {/* Page Controls - Compact */}
                                        {isMultiPage && (
                                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5 shadow-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newPage = Math.max(1, currentPage - 1);
                                                        setCurrentPage(newPage);
                                                        setText(pages[newPage - 1]?.text || "");
                                                    }}
                                                    disabled={currentPage === 1}
                                                    className="h-8 w-8 p-0 rounded-md hover:bg-white text-gray-500 hover:text-gray-900"
                                                >
                                                    ◀
                                                </Button>
                                                <span className="text-xs font-semibold px-3 text-gray-600 tabular-nums tracking-tight">
                                                    {currentPage} / {pages.length}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newPage = Math.min(pages.length, currentPage + 1);
                                                        setCurrentPage(newPage);
                                                        setText(pages[newPage - 1]?.text || "");
                                                    }}
                                                    disabled={currentPage === pages.length}
                                                    className="h-8 w-8 p-0 rounded-md hover:bg-white text-gray-500 hover:text-gray-900"
                                                >
                                                    ▶
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-2 w-full xl:w-auto">
                                        {/* Search Input - Compact */}
                                        {/* Search Input - Prominent */}
                                        {/* Search Input - Moved to left group */}

                                        {/* Translate Dropdown - Compact */}
                                        <div ref={translateDropdownRef} className="relative w-full md:w-auto z-20">
                                            <Button
                                                className="bg-purple-500 hover:bg-purple-600 text-white border-none shadow-sm gap-2 h-11 px-4 w-full md:w-auto min-w-[110px] justify-center rounded-sm transition-all active:scale-95"
                                                variant="default"
                                                onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {isTranslating ? <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" /> : (
                                                        <Languages className="w-5 h-5 flex-shrink-0" />
                                                    )}
                                                    <span className="text-sm font-bold whitespace-nowrap">
                                                        {translateLanguage ? `Translated to ${translateLanguage}` : "Translate"}
                                                    </span>
                                                </span>
                                            </Button>
                                            <div className={`${showTranslateDropdown ? '' : 'hidden'} absolute top-full right-0 mt-2 w-72 max-h-[500px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100`}>
                                                <div className="p-3">
                                                    {/* Scope Selector */}
                                                    <div className="mb-3 pb-3 border-b border-gray-100">
                                                        <label className="text-xs font-bold text-gray-700 mb-2 block">Translation Scope</label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setTranslationScope('current')}
                                                                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${translationScope === 'current'
                                                                    ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <span className="block font-semibold">This Page</span>
                                                                <span className="text-[10px] opacity-75">Fast</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setTranslationScope('all')}
                                                                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${translationScope === 'all'
                                                                    ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                                                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <span className="block font-semibold">All Pages</span>
                                                                <span className="text-[10px] opacity-75">Complete</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="relative mb-2">
                                                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Find language..."
                                                            value={languageSearch}
                                                            onChange={(e) => setLanguageSearch(e.target.value)}
                                                            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                                                        />
                                                    </div>
                                                    <div className="max-h-[280px] overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                                                        {languages
                                                            .filter(lang => lang.name.toLowerCase().includes(languageSearch.toLowerCase()))
                                                            .map((lang) => (
                                                                <button
                                                                    key={lang.code}
                                                                    onClick={() => {
                                                                        handleTranslate(lang.name, translationScope);
                                                                        setLanguageSearch("");
                                                                    }}
                                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center gap-3 transition-all group"
                                                                >
                                                                    <img
                                                                        src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                                                                        srcSet={`https://flagcdn.com/w80/${lang.flagCode}.png 2x`}
                                                                        width="20"
                                                                        height="15"
                                                                        alt={lang.name}
                                                                        className="rounded-[2px] object-cover shadow-sm ring-1 ring-black/5 opacity-90 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                    <span className="font-medium group-hover:translate-x-1 transition-transform">{lang.name}</span>
                                                                </button>
                                                            ))}
                                                        {languages.filter(l => l.name.toLowerCase().includes(languageSearch.toLowerCase())).length === 0 && (
                                                            <div className="text-center py-4 text-gray-400 text-xs">No languages found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* New AI Buttons */}
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Button
                                                onClick={() => setIsReportModalOpen(true)}
                                                className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 text-white border-none h-11 px-4 rounded-sm flex items-center justify-center gap-2 shadow-sm font-bold text-xs transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                <FileText className="w-5 h-5 flex-shrink-0" />
                                                <span>Generate AI Report</span>
                                            </Button>
                                            <Button
                                                onClick={handleGenerateSummary}
                                                className="flex-1 md:flex-none bg-purple-500 hover:bg-purple-600 text-white border-none h-11 px-4 rounded-sm flex items-center justify-center gap-2 shadow-sm font-bold text-xs transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                <Chat className="w-5 h-5 flex-shrink-0" />
                                                <span>AI Summary</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* DESKTOP VIEW */}
                                <div className="hidden md:block">
                                    {showTranslation ? (
                                        <div className="grid grid-cols-2 gap-0">
                                            {/* Original Sidebar (Left) */}
                                            <div className="p-4 bg-gray-50/50 border-r border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                        Original
                                                    </h3>
                                                    <span className="text-[10px] font-normal text-gray-500 px-2 py-0.5 border border-gray-200 rounded-full bg-white">
                                                        {translationScope === 'current' ? `Page ${currentPage}` : 'Full Doc'}
                                                    </span>
                                                </div>
                                                <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-4 bg-white rounded-lg border border-gray-200 font-mono text-xs whitespace-pre-wrap leading-relaxed text-gray-700 shadow-sm custom-scrollbar">
                                                    {translationScope === 'current' ? text : getFullText()}
                                                </div>
                                            </div>

                                            {/* Translated Sidebar (Right) */}
                                            <div className="p-4 bg-purple-50/30">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wide flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                        {translateLanguage}
                                                    </h3>
                                                    <div className="flex items-center gap-1">
                                                        <div ref={desktopDownloadRef} className="relative">
                                                            <Button
                                                                size="sm"
                                                                className="h-7 bg-purple-100/80 hover:bg-purple-200 text-purple-700 gap-1.5 text-xs rounded-lg font-semibold transition-all"
                                                                onClick={() => setShowTranslationDownload(!showTranslationDownload)}
                                                                disabled={!translatedText || isTranslating}
                                                            >
                                                                <Download className="w-3.5 h-3.5" /> Download
                                                            </Button>
                                                            {showTranslationDownload && (
                                                                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
                                                                    <button onClick={() => handleDownloadTranslation('txt')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                        <div className="p-1 rounded bg-gray-100 text-gray-500"><LucideFileText className="w-3.5 h-3.5" /></div> Text (.txt)
                                                                    </button>
                                                                    <button onClick={() => handleDownloadTranslation('docx')} className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                        <div className="p-1 rounded bg-blue-100 text-blue-600"><FileIcon className="w-3.5 h-3.5" /></div> Word (.docx)
                                                                    </button>
                                                                    <button onClick={() => handleDownloadTranslation('pdf')} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                        <div className="p-1 rounded bg-red-100 text-red-600"><FileTypeIcon className="w-3.5 h-3.5" /></div> PDF (.pdf)
                                                                    </button>
                                                                    <button onClick={() => handleDownloadTranslation('xlsx')} className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                        <div className="p-1 rounded bg-emerald-100 text-emerald-600"><TableIcon className="w-3.5 h-3.5" /></div> Excel (.xlsx)
                                                                    </button>
                                                                    <button onClick={() => handleDownloadTranslation('pptx')} className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                        <div className="p-1 rounded bg-orange-100 text-orange-600"><PresentationIcon className="w-3.5 h-3.5" /></div> PPT (.pptx)
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500"
                                                            onClick={() => {
                                                                setShowTranslation(false);
                                                                setTranslatedText("");
                                                                setTranslateLanguage("");
                                                            }}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-4 bg-white rounded-lg border border-purple-100 font-mono text-xs whitespace-pre-wrap leading-relaxed text-gray-800 shadow-sm custom-scrollbar">
                                                    {isTranslating ? (
                                                        <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                                            <p className="text-sm text-gray-500 font-medium">
                                                                Translating...
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        translatedText || <span className="text-gray-400 italic">Translation will appear here...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="min-h-[500px] max-h-[700px] overflow-y-auto p-6 bg-gray-50 rounded-xl m-4 border border-gray-100 font-mono text-sm whitespace-pre-wrap leading-relaxed text-gray-800 shadow-inner">
                                            {highlightedText()}
                                        </div>
                                    )}
                                </div>

                                {/* MOBILE VIEW */}
                                <div className="md:hidden">
                                    <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                                        {highlightedText()}
                                    </div>

                                    <Dialog open={showTranslation && isMobile} onOpenChange={(open) => {
                                        if (!open) {
                                            setShowTranslation(false);
                                            setTranslatedText("");
                                            setTranslateLanguage("");
                                        }
                                    }}>
                                        <DialogContent className="max-h-[85vh] h-[85vh] w-[95vw] max-w-md flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
                                            <DialogHeader className="px-4 py-3 border-b bg-purple-50 flex-shrink-0 relative pr-10">
                                                <div className="flex items-center justify-between">
                                                    <DialogTitle className="flex items-center gap-2 text-purple-800 text-sm">
                                                        <Globe className="w-4 h-4" />
                                                        {translateLanguage}
                                                    </DialogTitle>
                                                    <div ref={mobileDownloadRef} className="relative">
                                                        <Button
                                                            className="h-9 bg-purple-600 hover:bg-purple-700 text-white gap-2 text-sm rounded-lg shadow-md px-4 font-semibold"
                                                            onClick={() => setShowTranslationDownload(!showTranslationDownload)}
                                                            disabled={!translatedText || isTranslating}
                                                        >
                                                            <Download className="w-4 h-4" /> Download Translation
                                                        </Button>
                                                        {showTranslationDownload && (
                                                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
                                                                <button onClick={() => handleDownloadTranslation('txt')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                    <div className="p-1 rounded bg-gray-100 text-gray-500"><LucideFileText className="w-3.5 h-3.5" /></div> Text (.txt)
                                                                </button>
                                                                <button onClick={() => handleDownloadTranslation('docx')} className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                    <div className="p-1 rounded bg-blue-100 text-blue-600"><FileIcon className="w-3.5 h-3.5" /></div> Word (.docx)
                                                                </button>
                                                                <button onClick={() => handleDownloadTranslation('pdf')} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                    <div className="p-1 rounded bg-red-100 text-red-600"><FileTypeIcon className="w-3.5 h-3.5" /></div> PDF (.pdf)
                                                                </button>
                                                                <button onClick={() => handleDownloadTranslation('xlsx')} className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                    <div className="p-1 rounded bg-emerald-100 text-emerald-600"><TableIcon className="w-3.5 h-3.5" /></div> Excel (.xlsx)
                                                                </button>
                                                                <button onClick={() => handleDownloadTranslation('pptx')} className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                                                    <div className="p-1 rounded bg-orange-100 text-orange-600"><PresentationIcon className="w-3.5 h-3.5" /></div> PPT (.pptx)
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogHeader>

                                            <div className="flex-1 overflow-y-auto p-4 bg-white font-mono text-xs whitespace-pre-wrap leading-relaxed text-gray-800 custom-scrollbar">
                                                {isTranslating ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                                        <p className="text-sm text-gray-500 font-medium">Translating...</p>
                                                    </div>
                                                ) : (
                                                    translatedText || <span className="text-gray-400 italic">Translation will appear here...</span>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Mobile Download Button - Interstitial */}
                        <div className="md:hidden w-full relative z-30" ref={mobileDocDownloadRef}>
                            <Button
                                onClick={() => setShowMobileDownload(!showMobileDownload)}
                                className="w-full bg-red-600 text-white hover:bg-red-700 shadow-md flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] hover:shadow-lg border-none"
                            >
                                <div className="p-1 bg-white/20 rounded-full text-white">
                                    <Download className="w-4 h-4" />
                                </div>
                                Download Extracted Data
                            </Button>

                            {showMobileDownload && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="grid grid-cols-1 gap-1">
                                        <button onClick={handleDownloadTxt} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                            <div className="p-1.5 rounded-lg bg-gray-100 text-gray-500"><LucideFileText className="w-4 h-4" /></div>
                                            Text File (.txt)
                                        </button>
                                        <button onClick={handleDownloadDocx} className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600"><FileIcon className="w-4 h-4" /></div>
                                            Word Document (.docx)
                                        </button>
                                        <button onClick={handleDownloadPdf} className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                            <div className="p-1.5 rounded-lg bg-red-100 text-red-600"><FileTypeIcon className="w-4 h-4" /></div>
                                            PDF Document (.pdf)
                                        </button>
                                        <button onClick={handleDownloadXlsx} className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600"><TableIcon className="w-4 h-4" /></div>
                                            Excel Spreadsheet (.xlsx)
                                        </button>
                                        <button onClick={handleDownloadPpt} className="w-full text-left px-4 py-3 hover:bg-orange-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium transition-colors">
                                            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600"><PresentationIcon className="w-4 h-4" /></div>
                                            PowerPoint (.pptx)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Document Chat */}
                        <div className="h-[600px]">
                            <DocumentChat documentText={getFullText()} />
                        </div>
                    </div>
                </div>

                {/* AI Report Modal */}
                <ReportChatModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    documentText={getFullText()}
                />

                {/* Premium Loading Overlay */}
                {generatingSummary && <PremiumLoadingOverlay />}

                {/* AI Report Modal */}
                {summary && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1001] p-4 backdrop-blur-sm" onClick={() => setSummary("")}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            {/* Floating Action Buttons at Top */}
                            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-b border-purple-100 flex-shrink-0 z-10 rounded-t-3xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white p-2 rounded-xl shadow-sm">
                                            <img src="/logo.png" alt="Infy Galaxy" className="w-12 h-12 rounded-lg object-contain" />
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
                                <DocumentChat documentText={getFullText()} hideHeader={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
