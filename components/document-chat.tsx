"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, User, Loader2, MoreVertical, Copy, Download, FileText, Image as ImageIcon, MoreHorizontal, Trash2, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { saveAs } from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import * as XLSX from "xlsx"
import pptxgen from "pptxgenjs"
import html2canvas from "html2canvas"

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp?: string
}

interface DocumentChatProps {
    documentText: string
    hideHeader?: boolean
}

// StatusBadge removed as it is no longer used

function UserActionsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="User actions"
                    className="border-muted-foreground/30"
                    size="icon"
                    type="button"
                    variant="outline"
                >
                    <MoreVertical
                        aria-hidden="true"
                        className="size-4"
                        focusable="false"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl z-[9999]">
                <div className="flex flex-col gap-1">
                    <Button
                        className="w-full justify-start gap-2 rounded bg-transparent text-rose-600 hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Trash2 aria-hidden="true" className="size-4" focusable="false" />
                        <span className="font-medium text-xs">Clear Chat</span>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MessageActions({ isMe, text, messageRef }: { isMe: boolean, text: string, messageRef?: React.RefObject<HTMLDivElement | null> }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownloadTxt = () => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `AI_Report_${Date.now()}.txt`);
    };

    const handleDownloadDocx = async () => {
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: text.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })),
                }],
            });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `AI_Report_${Date.now()}.docx`);
        } catch (error) {
            console.error("Word generation failed:", error);
            alert("Failed to generate Word document");
        }
    };

    const handleDownloadPdf = async () => {
        const sanitizePdfText = (str: string) => {
            return str
                .replace(/[•●·]/g, '-') // Replace bullets with hyphens
                .replace(/[→⇒\u2192\u21D2]/g, '->') // Replace arrows
                .replace(/[←⇐\u2190\u21D0]/g, '<-')
                .replace(/[^\x20-\x7E\n\r\t]/g, ' '); // Strip non-ASCII/printable characters to avoid WinAnsi errors
        };

        try {
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const fontSize = 11;
            const lineHeight = fontSize + 4;
            let y = height - 50;

            const sanitizedText = sanitizePdfText(text);
            const lines = sanitizedText.split('\n');
            for (const line of lines) {
                if (y < 50) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                }

                const isBold = line.match(/^\*\*(.+?)\*\*:?/);
                const displayText = isBold ? isBold[1] : line.replace(/^[•\-]\s*/, '');
                const useFont = isBold ? boldFont : font;
                const useFontSize = isBold ? fontSize + 2 : fontSize;

                if (displayText.trim()) {
                    page.drawText(displayText, {
                        x: line.startsWith('-') || line.startsWith('•') ? 70 : 50,
                        y,
                        size: useFontSize,
                        font: useFont,
                        color: rgb(0, 0, 0)
                    });
                }
                y -= lineHeight;
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            saveAs(blob, `AI_Report_${Date.now()}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF");
        }
    };

    const handleDownloadXlsx = () => {
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([[text]]);
            ws['!cols'] = [{ wch: 100 }];
            XLSX.utils.book_append_sheet(wb, ws, "AI Report");
            XLSX.writeFile(wb, `AI_Report_${Date.now()}.xlsx`);
        } catch (error) {
            console.error("Excel generation failed:", error);
            alert("Failed to generate Excel file");
        }
    };

    const handleDownloadPpt = async () => {
        try {
            const pres = new pptxgen();
            let slide = pres.addSlide();
            slide.addText("AI Report", { x: 0.5, y: 0.5, fontSize: 18, bold: true });
            slide.addText(text, { x: 0.5, y: 1.0, w: '90%', h: '80%', fontSize: 12, color: '363636' });
            await pres.writeFile({ fileName: `AI_Report_${Date.now()}.pptx` });
        } catch (error) {
            console.error("PowerPoint generation failed:", error);
            alert("Failed to generate PowerPoint");
        }
    };

    const handleDownloadImage = async () => {
        try {
            if (!messageRef?.current) {
                alert("Unable to capture message");
                return;
            }

            // Create a "Clean Clone" to bypass Tailwind 4's 'lab'/'oklch' colors which crash html2canvas
            const originalNode = messageRef.current;
            const clone = originalNode.cloneNode(true) as HTMLElement;

            // 1. Reset Container Styles (Force standard colors)
            clone.style.backgroundColor = "#ffffff";
            clone.style.color = "#111827";
            clone.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
            clone.style.padding = "20px";
            clone.style.borderRadius = "12px";
            clone.style.border = "1px solid #e5e7eb";
            clone.style.width = `${originalNode.offsetWidth}px`;
            clone.style.position = "fixed";
            clone.style.top = "-9999px";
            clone.style.left = "-9999px";
            clone.style.zIndex = "-1000";

            // 2. Strip ALL classes to remove Tailwind dependency
            clone.removeAttribute("class");
            const allElements = clone.querySelectorAll("*");
            allElements.forEach((el) => {
                el.removeAttribute("class");
                if (el instanceof HTMLElement) {
                    // Aggressively reset potential oklch/lab properties for ALL elements
                    el.style.boxShadow = "none";
                    el.style.backgroundImage = "none";
                    el.style.borderColor = "transparent"; // Default borders to transparent hex

                    // Apply basic readable styles based on tag
                    if (el.tagName === "STRONG" || el.tagName === "B") {
                        el.style.fontWeight = "bold";
                        el.style.color = "#4338ca"; // Indigo Heading/Highlight
                    }
                    if (el.tagName === "H1" || el.tagName === "H2" || el.tagName === "H3") {
                        el.style.fontWeight = "bold";
                        el.style.marginBottom = "8px";
                        el.style.marginTop = "16px";
                        el.style.color = "#111827";
                    }
                    if (el.tagName === "P") {
                        el.style.marginBottom = "10px";
                        el.style.lineHeight = "1.6";
                        el.style.color = "#1f2937";
                    }
                    if (el.tagName === "UL" || el.tagName === "OL") {
                        el.style.paddingLeft = "20px";
                        el.style.marginBottom = "10px";
                        el.style.color = "#1f2937";
                    }
                    if (el.tagName === "LI") {
                        el.style.marginBottom = "4px";
                    }
                    if (el.tagName === "HR") {
                        el.style.border = "none";
                        el.style.borderTop = "1px solid #e5e7eb";
                        el.style.margin = "16px 0";
                    }

                    // Ensure links don't inherit weird colors
                    if (el.tagName === "A") {
                        el.style.color = "#2563eb";
                        el.style.textDecoration = "underline";
                    }
                }
            });

            document.body.appendChild(clone);

            // 3. Capture the sanitized clone
            const canvas = await html2canvas(clone, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
                logging: false
            });

            // 4. Cleanup
            document.body.removeChild(clone);

            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `AI_Report_${Date.now()}.png`);
                }
            });
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Failed to generate image. Please try 'Text' or 'PDF' format instead.");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                    size="sm"
                    type="button"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Download Report</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-48 rounded-lg bg-popover p-1.5 shadow-xl z-[9999]"
            >
                <div className="flex flex-col gap-0.5">
                    <Button
                        aria-label="Copy"
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleCopy}
                    >
                        {isCopied ? (
                            <>
                                <Check aria-hidden="true" className="size-3.5 text-green-600" focusable="false" />
                                <span className="text-green-600">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy aria-hidden="true" className="size-3.5" focusable="false" />
                                <span>Copy Text</span>
                            </>
                        )}
                    </Button>

                    <div className="my-1 h-px bg-border" />

                    <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Download as
                    </div>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadTxt}
                    >
                        <FileText aria-hidden="true" className="size-3.5 text-gray-600" focusable="false" />
                        <span>Text File (.txt)</span>
                    </Button>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadDocx}
                    >
                        <FileText aria-hidden="true" className="size-3.5 text-blue-600" focusable="false" />
                        <span>Word (.docx)</span>
                    </Button>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadPdf}
                    >
                        <FileText aria-hidden="true" className="size-3.5 text-red-600" focusable="false" />
                        <span>PDF (.pdf)</span>
                    </Button>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadXlsx}
                    >
                        <FileText aria-hidden="true" className="size-3.5 text-green-600" focusable="false" />
                        <span>Excel (.xlsx)</span>
                    </Button>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadPpt}
                    >
                        <FileText aria-hidden="true" className="size-3.5 text-orange-600" focusable="false" />
                        <span>PowerPoint (.pptx)</span>
                    </Button>

                    <Button
                        className="w-full justify-start gap-2 rounded px-3 py-2 text-xs font-medium hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={handleDownloadImage}
                    >
                        <ImageIcon aria-hidden="true" className="size-3.5 text-purple-600" focusable="false" />
                        <span>Image (.png)</span>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


import ReactMarkdown from 'react-markdown'

function MessageItem({ msg, isLoadingStatus }: { msg: Message, isLoadingStatus?: boolean }) {
    const isMe = msg.role === 'user';
    const messageRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "group flex gap-2 w-full",
                isMe ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "flex max-w-[85%] items-start gap-2",
                    isMe ? "flex-row-reverse" : undefined
                )}
            >
                <Avatar className="size-8 mt-1 shadow-sm border border-gray-100">
                    {isMe ? (
                        <div className="flex w-full h-full items-center justify-center bg-gray-100 text-gray-500">
                            <User className="w-4 h-4" />
                        </div>
                    ) : (
                        <div className="flex w-full h-full items-center justify-center bg-white p-1">
                            <img src="/logo.png" alt="AI" className="w-full h-full object-contain" />
                        </div>
                    )}
                </Avatar>
                <div>
                    <div
                        ref={messageRef}
                        className={cn(
                            "rounded-2xl px-4 py-2 shadow-sm min-h-[38px] flex items-center",
                            isMe
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm font-medium"
                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                        )}
                    >
                        {isLoadingStatus ? (
                            <div className="flex gap-1 py-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        ) : !isMe ? (
                            <div className="text-sm leading-relaxed max-w-none prose prose-sm prose-p:my-0.5 prose-headings:my-1 prose-headings:text-base prose-headings:font-bold prose-headings:text-gray-900 prose-strong:text-indigo-700 prose-only:m-0 prose-li:my-0 prose-hr:my-2 !text-sm font-normal">
                                <ReactMarkdown>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium">{msg.content}</p>
                        )}
                    </div>
                    <div className={cn(
                        "mt-1 flex items-center gap-2",
                        isMe ? "justify-end" : "justify-start"
                    )}>
                        <time className="text-[10px] text-muted-foreground font-medium opacity-70">
                            {msg.timestamp || 'Just now'}
                        </time>
                        {!isMe && (
                            <div className="transition-all scale-90">
                                <MessageActions isMe={isMe} text={msg.content} messageRef={messageRef} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DocumentChat({ documentText, hideHeader = false }: DocumentChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        // Find the scroll viewport inside ScrollArea
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage: Message = { role: 'user', content: input, timestamp: now }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        // Add placeholder for streaming response
        const botMessage: Message = { role: 'assistant', content: '', timestamp: now };
        setMessages(prev => [...prev, botMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    documentText,
                    chatHistory: messages
                })
            })

            if (!response.ok) throw new Error('Chat failed')
            if (!response.body) throw new Error('No response body')

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                fullContent += parsed.content;
                                // Update the bot message in real-time
                                setMessages(prev => prev.map((msg, idx) =>
                                    idx === prev.length - 1 && msg.role === 'assistant'
                                        ? { ...msg, content: fullContent }
                                        : msg
                                ));
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            setLoading(false)
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => prev.slice(0, -1)) // Remove placeholder
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: now
            }])
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Card className="h-full flex flex-col shadow-none border-0 bg-transparent">
            {/* Header */}
            {!hideHeader && (
                <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 rounded-t-lg">
                    <div className="flex items-center gap-1">
                        <img src="/logo.png" alt="Infy Galaxy" className="h-7 w-7 object-contain" />
                        <div className="flex flex-col justify-center">
                            <div className="font-bold text-lg text-gray-900 leading-tight">Chat with our Reports Agent</div>
                        </div>
                    </div>
                </CardHeader>
            )}

            {/* Messages */}
            <CardContent className={cn("flex-1 p-0 overflow-hidden flex flex-col bg-background/50", messages.length === 0 && "justify-center")}> 
                {messages.length > 0 && (
                    <ScrollArea
                        ref={scrollAreaRef}
                        className="flex-1 px-4"
                    >
                        <div className="flex flex-col gap-6 py-4">
                            {messages.map((msg, idx) => (
                                <MessageItem
                                    key={idx}
                                    msg={msg}
                                    isLoadingStatus={loading && idx === messages.length - 1 && msg.role === 'assistant' && !msg.content}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {/* Input Area */}
                <div className={cn("p-4 bg-background border-t", messages.length === 0 && "border-t-0")}> 
                    <div className="relative flex items-start">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                            rows={4}
                            className={cn(
                                "w-full pr-16 pl-6 py-6 resize-none rounded-2xl bg-white border-[3px] border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-700 text-sm shadow-xl placeholder:text-gray-400 transition-all hover:border-blue-500",
                                messages.length === 0
                                    ? "h-[200px] min-h-[200px]"
                                    : "h-[96px] min-h-[96px]",
                                !input.trim() ? "overflow-hidden" : "overflow-y-auto"
                            )}
                        />

                        {/* Centered placeholder overlay when input is empty */}
                        {!input.trim() && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pr-16">
                                <p className="w-full max-w-md mx-auto text-center leading-relaxed text-sm text-gray-400 whitespace-pre-line">
                                    {`Your Exclusive Agent For More Insights From Your Extracted Data\nAsk Away, Chat Now`}
                                </p>
                            </div>
                        )}
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            size="icon"
                            className={cn(
                                "absolute right-3 bottom-3 h-11 w-11 rounded-xl transition-all shadow-md",
                                input.trim()
                                    ? "bg-blue-700 hover:bg-blue-800 text-white shadow-blue-400 scale-100"
                                    : "bg-blue-100 text-blue-600 scale-95"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                            ) : (
                                <Send className="w-5 h-5 ml-0.5" strokeWidth={3} />
                            )}
                        </Button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-muted-foreground">
                            AI can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
