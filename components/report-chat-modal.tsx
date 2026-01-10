"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Download, X, Copy, Check, FileText, Bot, User, AlertCircle, Sparkles, ChevronLeft } from "lucide-react"
import {
    Bulb as Lightbulb,
    CreditCard01 as DollarSign,
    ChartBarVertical01 as BarChart3,
    TrendingUp,
    Settings as Settings2
} from "react-coolicons"
import { saveAs } from "file-saver"
import ReactMarkdown from 'react-markdown'
import { Document, Packer, Paragraph, TextRun } from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import * as XLSX from "xlsx"
import html2canvas from "html2canvas"

interface ReportChatModalProps {
    isOpen: boolean
    onClose: () => void
    documentText: string
}

type ReportCategory = 'key-insights' | 'cost-analysis' | 'performance' | 'trend-forecast' | 'operational-efficiency'

const REPORT_CATEGORIES: { id: ReportCategory; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'key-insights', label: 'Key Insights Report', icon: <Lightbulb className="w-5 h-5" />, description: 'Extract top findings and executive summary' },
    { id: 'cost-analysis', label: 'Cost Analysis Report', icon: <DollarSign className="w-5 h-5" />, description: 'Analyze financial data, expenses, and pricing' },
    { id: 'performance', label: 'Performance Report', icon: <BarChart3 className="w-5 h-5" />, description: 'Evaluate metrics, KPIs, and achievements' },
    { id: 'trend-forecast', label: 'Trend & Forecast Report', icon: <TrendingUp className="w-5 h-5" />, description: 'Identify patterns and future projections' },
    { id: 'operational-efficiency', label: 'Operational Efficiency', icon: <Settings2 className="w-5 h-5" />, description: 'Analyze workflows and process improvements' },
]

export default function ReportChatModal({ isOpen, onClose, documentText }: ReportChatModalProps) {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; type?: 'report' | 'error' }>>([])
    const [loading, setLoading] = useState(false)
    const [currentReport, setCurrentReport] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Auto-scroll
    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }, [messages, loading, currentReport])

    if (!isOpen) return null

    const handleGenerateReport = async (category: ReportCategory) => {
        setLoading(true)
        setSelectedCategory(category)
        const categoryLabel = REPORT_CATEGORIES.find(c => c.id === category)?.label

        // Add user request message
        setMessages(prev => [...prev, { role: 'user', content: `Generate ${categoryLabel}` }])

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: documentText, category }),
            })

            if (!response.ok) throw new Error('Report generation failed')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            // Placeholder for AI response
            setMessages(prev => [...prev, { role: 'assistant', content: '', type: 'report' }])
            let fullContent = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6)
                            if (data === '[DONE]') break

                            try {
                                const parsed = JSON.parse(data)
                                if (parsed.content) {
                                    fullContent += parsed.content
                                    setCurrentReport(fullContent)
                                    setMessages(prev => {
                                        const newMsgs = [...prev]
                                        const lastMsg = newMsgs[newMsgs.length - 1]
                                        if (lastMsg.role === 'assistant') {
                                            lastMsg.content = fullContent
                                        }
                                        return newMsgs
                                    })
                                } else if (parsed.error) {
                                    // Handle eligibility error specifically
                                    setMessages(prev => {
                                        const newMsgs = [...prev]
                                        newMsgs[newMsgs.length - 1] = {
                                            role: 'assistant',
                                            content: `⚠️ **Insufficient Data**: The document does not contain enough information to generate a ${categoryLabel}.\n\nReason: ${parsed.reason || "Content not relevant to this category."}`,
                                            type: 'error'
                                        }
                                        return newMsgs
                                    })
                                }
                            } catch (e) {
                                console.error("Parse error", e)
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Report error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't generate that report. Please try another category.", type: 'error' }])
        } finally {
            setLoading(false)
            setCurrentReport("") // Reset stream buffer, msg is saved
        }
    }

    // Download handlers (reused logic)
    const handleDownload = async (format: 'txt' | 'docx' | 'pdf', content: string) => {
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `AI_Report_${selectedCategory}_${timestamp}`

        if (format === 'txt') {
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
            saveAs(blob, `${filename}.txt`)
        } else if (format === 'docx') {
            const doc = new Document({
                sections: [{ children: content.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })) }]
            })
            const blob = await Packer.toBlob(doc)
            saveAs(blob, `${filename}.docx`)
        } else if (format === 'pdf') {
            const doc = await PDFDocument.create()
            const page = doc.addPage()
            const { height } = page.getSize()
            page.drawText(content, { x: 50, y: height - 50, size: 10, color: rgb(0, 0, 0) })
            const pdfBytes = await doc.save()
            const blob = new Blob([Buffer.from(pdfBytes)], { type: "application/pdf" })
            saveAs(blob, `${filename}.pdf`)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        {/* Mobile Back Button */}
                        {selectedCategory && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCategory(null)}
                                className="md:hidden -ml-2 rounded-full text-gray-500"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Sparkles className="w-6 h-6 text-blue-600" fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">AI Report Generator</h2>

                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-200/50">
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Categories */}
                    <div className={`bg-gray-50 border-r border-gray-200 p-4 space-y-3 overflow-y-auto ${selectedCategory ? 'hidden md:block w-1/3' : 'w-full md:w-1/3'}`}>

                        {REPORT_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => !loading && handleGenerateReport(cat.id)}
                                disabled={loading}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${selectedCategory === cat.id
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/50'
                                    }`}
                            >
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className={`p-2 rounded-lg ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors'}`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${selectedCategory === cat.id ? 'text-white' : 'text-gray-800'}`}>
                                            {cat.label}
                                        </div>
                                        <div className={`text-[10px] mt-1 leading-tight ${selectedCategory === cat.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {cat.description}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-col bg-white ${selectedCategory ? 'flex flex-1' : 'hidden md:flex flex-1'}`}>
                        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 p-8">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                        <BarChart3 className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Initialize</h3>
                                    <p className="text-gray-500 max-w-xs">Select a report category from the sidebar to begin analyzing your document.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`w-[90%] md:w-[85%] rounded-2xl p-5 ${msg.role === 'user'
                                                ? 'bg-blue-50 border border-blue-100 text-blue-800'
                                                : msg.type === 'error'
                                                    ? 'bg-red-50 border border-red-100 text-red-800'
                                                    : 'bg-white border border-gray-100 shadow-sm text-gray-800'
                                                } break-words overflow-hidden`}>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`p-1.5 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                                        {msg.role === 'user' ? 'Request' : 'Analysis'}
                                                    </span>
                                                </div>

                                                {msg.role === 'assistant' ? (
                                                    <div className="text-sm leading-relaxed text-gray-800">
                                                        <ReactMarkdown
                                                            components={{
                                                                h1: ({ node, ...props }) => <h1 className="text-sm font-bold mb-3 mt-1 text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-tight" {...props} />,
                                                                h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-2 mt-4 text-gray-800 uppercase tracking-tight" {...props} />,
                                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 mt-3 text-gray-700" {...props} />,
                                                                p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                                                li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                        {/* Action Buttons for Assistant Msgs */}
                                                        {msg.type !== 'error' && !loading && idx === messages.length - 1 && (
                                                            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2 text-[10px]">
                                                                <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1.5 rounded-lg border-gray-200 hover:bg-gray-50 font-bold" onClick={() => handleDownload('txt', msg.content)}>
                                                                    <Download className="w-3.5 h-3.5" /> Plain Text
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1.5 rounded-lg border-gray-200 hover:bg-gray-50 font-bold" onClick={() => handleDownload('docx', msg.content)}>
                                                                    <FileText className="w-3.5 h-3.5" /> Word Report
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1.5 rounded-lg border-gray-200 hover:bg-gray-50 font-bold" onClick={() => handleDownload('pdf', msg.content)}>
                                                                    <FileText className="w-3.5 h-3.5" /> PDF Report
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm font-semibold leading-relaxed text-blue-900">
                                                        {msg.content}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="w-[90%] md:w-[85%] bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-3">
                                                <div className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                                </div>
                                                <span className="text-sm text-gray-500 font-bold animate-pulse">Analyzing document data...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    )
}
