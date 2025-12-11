import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

export async function POST(req: NextRequest) {
    try {
        const { message, sessionId } = await req.json();

        // 1. Get or Create Session
        const currentSessionId = sessionId || `anon_${Date.now()}`;

        let conversationId = null;

        // Try to store in DB if possible (Lazy Import)
        try {
            const { default: prisma } = await import("@/lib/db");

            // Upsert conversation
            const conversation = await prisma.chatConversation.upsert({
                where: { sessionId: currentSessionId },
                create: {
                    sessionId: currentSessionId,
                    messages: {
                        create: {
                            role: 'user',
                            content: message
                        }
                    }
                },
                update: {
                    messages: {
                        create: {
                            role: 'user',
                            content: message
                        }
                    }
                }
            });
            conversationId = conversation.id;
        } catch (e) {
            console.error("DB Error (Chat):", e);
        }

        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            return NextResponse.json({ error: 'Mistral API key not found' }, { status: 500 });
        }

        const client = new Mistral({ apiKey: mistralKey });

        // Generate response
        const completion = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                {
                    role: "system",
                    content: "You are 'Infy', the intelligent support agent for Infy Galaxy (OCR & Document Analysis). You are professional, helpful, and concise. You help users with OCR issues, PDF analysis, and general inquiries about the tool. Keep answers comparatively short."
                },
                { role: "user", content: message }
            ],
            temperature: 0.7,
        });

        const reply = completion.choices?.[0]?.message?.content || "I'm having trouble thinking right now. Please try again.";

        // Store Assistant Reply in DB
        if (conversationId) {
            try {
                const { default: prisma } = await import("@/lib/db");
                await prisma.chatMessage.create({
                    data: {
                        conversationId: conversationId,
                        role: 'assistant',
                        content: reply
                    }
                })
            } catch (e) {
                console.error("DB Error (Save Reply):", e);
            }
        }

        return NextResponse.json({
            reply,
            sessionId: currentSessionId
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
