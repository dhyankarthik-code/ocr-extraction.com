"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, MoreVertical, Copy, Download, FileText, Image as ImageIcon, MoreHorizontal, Trash2 } from "lucide-react"
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
}

// Helper components from HextaUI design
type StatusType = "online" | "dnd" | "offline";
const STATUS_COLORS: Record<StatusType, string> = {
    online: "bg-green-500",
    dnd: "bg-red-500",
    offline: "bg-gray-400",
};

function StatusBadge({ status }: { status: StatusType }) {
    return (
        <span
            aria-label={status}
            className={cn(
                "inline-block size-3 rounded-full border-2 border-background",
                STATUS_COLORS[status]
            )}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
        />
    );
}

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
            <DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl">
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
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
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
        try {
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const fontSize = 11;
            const lineHeight = fontSize + 4;
            let y = height - 50;

            const lines = text.split('\n');
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
            const canvas = await html2canvas(messageRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            });
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `AI_Report_${Date.now()}.png`);
                }
            });
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Failed to generate image");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Message actions"
                    className="size-7 rounded bg-background hover:bg-accent"
                    size="icon"
                    type="button"
                    variant="ghost"
                >
                    <MoreHorizontal
                        aria-hidden="true"
                        className="size-3.5"
                        focusable="false"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-48 rounded-lg bg-popover p-1.5 shadow-xl"
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
                        <Copy aria-hidden="true" className="size-3.5" focusable="false" />
                        <span>Copy Text</span>
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

export default function DocumentChat({ documentText }: DocumentChatProps) {
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
            <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <div className="relative bg-white p-3 rounded-xl shadow-md flex-shrink-0">
                        <img src="/logo.png" alt="InfyGalaxy AI" className="w-10 h-10 rounded-lg object-contain" />
                        <span className="absolute -bottom-1 -right-1 block size-3.5 rounded-full bg-green-500 ring-2 ring-white" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="font-bold text-lg text-gray-900 leading-tight">Chat with our Reports Agent</div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                            <StatusBadge status="online" />
                            <span className="font-medium">Online</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-background/50">
                <ScrollArea
                    ref={scrollAreaRef}
                    className="flex-1 px-4"
                >
                    <div className="flex flex-col gap-6 py-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-4 p-3">
                                    <img src="/logo.png" alt="Infy Galaxy" className="w-full h-full rounded-lg" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">No messages yet</p>
                                <p className="text-xs text-gray-500 mt-1">Ask a question about your document to get started</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => {
                            const isMe = msg.role === 'user';
                            const messageRef = useRef<HTMLDivElement>(null);

                            const renderMarkdown = (text: string) => {
                                // 1. Escape HTML entities to prevent XSS
                                let safeText = text
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")
                                    .replace(/"/g, "&quot;")
                                    .replace(/'/g, "&#039;");

                                // 2. Apply Basic Markdown Formatting
                                let html = safeText
                                    // Bold
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    // Italic
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    // Lists
                                    .replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>')
                                    .replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul class="list-disc pl-4 my-2">$1</ul>')
                                    // Newlines
                                    .replace(/\n/g, '<br />');
                                return html;
                            };

                            return (
                                <div
                                    className={cn(
                                        "group flex gap-2 w-full",
                                        isMe ? "justify-end" : "justify-start"
                                    )}
                                    key={idx}
                                >
                                    <div
                                        className={cn(
                                            "flex max-w-[85%] items-start gap-2",
                                            isMe ? "flex-row-reverse" : undefined
                                        )}
                                    >
                                        <Avatar className="size-8 mt-1">
                                            {isMe ? (
                                                <>
                                                    <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=User" />
                                                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                                </>
                                            ) : (
                                                <>
                                                    <AvatarImage src="https://api.dicebear.com/9.x/bottts/svg?seed=AI" />
                                                    <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                                                </>
                                            )}
                                        </Avatar>
                                        <div>
                                            <div
                                                ref={messageRef}
                                                className={cn(
                                                    "rounded-2xl px-4 py-2.5 shadow-sm",
                                                    isMe
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm font-medium"
                                                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                                                )}
                                            >
                                                {!isMe ? (
                                                    <div
                                                        className="text-sm leading-relaxed space-y-2 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1"
                                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                                                    />
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
                                                <div className="opacity-0 transition-all group-hover:opacity-100 scale-90">
                                                    <MessageActions isMe={isMe} text={msg.content} messageRef={messageRef} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {loading && (
                            <div className="flex gap-2 justify-start w-full">
                                <div className="flex max-w-[85%] items-start gap-2">
                                    <Avatar className="size-8 mt-1">
                                        <AvatarImage src="https://api.dicebear.com/9.x/bottts/svg?seed=AI" />
                                        <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="bg-white border text-foreground rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background border-t">
                    <div className="relative flex items-center">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            disabled={loading}
                            className="pr-12 py-3 rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-blue-500/30 text-sm"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            size="icon"
                            className={cn(
                                "absolute right-1.5 h-9 w-9 rounded-full transition-all",
                                input.trim()
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                                    : "bg-muted text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 ml-0.5" />
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
