function MessageItem({ msg }: { msg: Message }) {
    const isMe = msg.role === 'user';
    const messageRef = useRef<HTMLDivElement>(null);

    const renderMarkdown = (text: string) => {
        // 1. Escape HTML entities
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
}
