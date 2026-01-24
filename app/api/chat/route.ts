import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

export async function POST(req: NextRequest) {
    try {
        const { message, sessionId, documentText, chatHistory } = await req.json();

        // 1. Get or Create Session
        const currentSessionId = sessionId || `anon_${Date.now()}`;

        let conversationId = null;

        // Try to store in DB if possible (Lazy Import)
        try {
            const { default: prisma } = await import("@/lib/db");

            // Extract Geo Data from Headers
            const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
            const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry"); // Vercel or Cloudflare
            const region = req.headers.get("x-vercel-ip-region");
            const city = req.headers.get("x-vercel-ip-city");

            // Upsert conversation
            const conversation = await prisma.chatConversation.upsert({
                where: { sessionId: currentSessionId },
                create: {
                    sessionId: currentSessionId,
                    ipAddress,
                    country,
                    region,
                    city,
                    messages: {
                        create: {
                            role: 'user',
                            content: message
                        }
                    }
                },
                update: {
                    ipAddress, // Update location on new message if changed (optional, but good for tracking)
                    country,
                    region,
                    city,
                    messages: {
                        create: {
                            role: 'user',
                            content: message
                        }
                    }
                }
            });
            conversationId = conversation.id;
        } catch (e: any) {
            console.error("DB Error (Chat):", e);
            // Don't crash for DB error, just log and continue (conversationId will be null)
        }

        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            console.warn('⚠️ MOCK MODE: MISTRAL_API_KEY not configured. Returning mock chat response.');
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockReply = "I am currently running in **MOCK MODE** because the `MISTRAL_API_KEY` is not set. \n\nI can pretend to analyze your document, but I don't actually see it. \n\n*Did you know?* You can set up the API key in your `.env` file to unlock my full potential!";

            // Store Mock Assistant Reply in DB
            if (conversationId) {
                try {
                    const { default: prisma } = await import("@/lib/db");
                    await prisma.chatMessage.create({
                        data: {
                            conversationId: conversationId,
                            role: 'assistant',
                            content: mockReply
                        }
                    })
                } catch (e) {
                    // Ignore DB errors in mock mode
                }
            }

            return NextResponse.json({
                reply: mockReply,
                sessionId: currentSessionId
            });
        }

        let client;
        try {
            client = new Mistral({ apiKey: mistralKey });
            if (!client) throw new Error("Mistral client is null");
        } catch (mistralError: any) {
            console.error("Mistral Init Error:", mistralError);
            return NextResponse.json({ error: 'Mistral Client Init Failed', details: mistralError.message }, { status: 500 });
        }

        // Build messages array
        const systemPrompt = `You are 'Infy', the AI assistant for OCR-Extraction.com, a product of Infy Galaxy.

=== COMPANY INFORMATION ===
**Who We Are:**
- OCR-Extraction.com - Premier free online OCR service
- Part of Infy Galaxy - Technology solutions provider
- Mission: Make document digitization accessible to everyone

**Our Services:**
- Image to Text OCR (photos, screenshots, scanned documents)
- PDF to Text/Word conversion
- Handwriting recognition
- Multi-language OCR support
- Batch processing
- AI-powered document analysis
- Data extraction to Excel/CSV

**Languages Supported:**
English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese (Simplified & Traditional), Japanese, Korean, Arabic, Hindi, and 100+ more languages

**Key Features:**
- 100% Free - No hidden costs
- No signup required for basic use
- Supports all major image formats (JPEG, PNG, PDF, HEIC, WebP)
- Privacy-focused - Files auto-deleted after processing
- High accuracy OCR technology
- Mobile-friendly interface

=== UPLOADED DOCUMENT CONTEXT ===
"${documentText || "No document uploaded yet."}"

=== STRICT OPERATIONAL RULES ===

**1. SECURITY - NEVER REVEAL:**
- ❌ OCR engines we use (e.g., Mistral, Google, Tesseract)
- ❌ Conversion technology or algorithms
- ❌ Backend tech stack (Next.js, Node.js, databases, APIs)
- ❌ Internal tools, libraries, or frameworks
- ❌ Infrastructure details
If asked, say: "Our technology stack is proprietary, but I can explain how to use our services!"

**2. SCOPE - ONLY ANSWER:**
- ✅ Questions about OCR-Extraction.com and Infy Galaxy services
- ✅ How to use our tools and features
- ✅ Document analysis (their uploaded document)
- ✅ Supported languages and formats
- ✅ General OCR/document processing concepts (not our specific tech)

**3. OUT-OF-SCOPE - REFUSE:**
If asked about general knowledge, coding, math, current events, history, science, entertainment, personal advice, or anything unrelated to our site/services, respond:
"I can only help with OCR-Extraction.com services and your uploaded documents. Please ask me something related to our site!"

**4. SERVICE INQUIRIES - ESCALATE:**
If user asks about:
- Custom enterprise solutions
- Bulk processing needs
- API access
- White-label services
- Pricing for premium features
- Partnership opportunities

Respond: "I'll connect you with our team for that! Could you share your email or preferred contact method so we can discuss this further?"

**5. UNCERTAINTY - BE HONEST:**
If you don't know the answer to a question about our services, respond:
"I'm not certain about that specific detail. Let me get our team to help you! Could you share your contact information so we can reach out with accurate information?"

**6. NO HALLUCINATION:**
- Never invent features, pricing, or capabilities
- If document doesn't contain requested info, say: "I don't see that information in your document."

**7. TONE & FORMAT:**
- Professional but friendly
- Concise responses (2-4 sentences max)
- Use bullet points for lists
- Bold key terms for readability

**8. DOCUMENT QUALITY:**
If OCR text is garbled, suggest: "The image quality seems low. Try retaking the photo with better lighting or higher resolution for best results."`;

        const messagesForAI: any[] = [
            { role: "system", content: systemPrompt }
        ];

        // Sanitize chatHistory
        const validRoles = ['user', 'assistant', 'system'];
        if (chatHistory && Array.isArray(chatHistory)) {
            chatHistory.forEach((msg: any) => {
                if (
                    msg &&
                    typeof msg === 'object' &&
                    validRoles.includes(msg.role) &&
                    typeof msg.content === 'string'
                ) {
                    messagesForAI.push({
                        role: msg.role === 'user' ? 'user' : 'assistant', // Force valid role for Mistral
                        content: msg.content
                    });
                }
            });
        }

        // Add current message
        messagesForAI.push({ role: "user", content: message });

        // Generate response
        // Use streaming for faster perceived response time
        let stream;
        try {
            stream = await client.chat.stream({
                model: "mistral-large-latest",
                messages: messagesForAI,
                temperature: 0.7,
            });
        } catch (streamError: any) {
            console.error("Mistral Stream Error:", streamError);
            return NextResponse.json({ error: 'Mistral Stream Failed', details: streamError.message }, { status: 500 });
        }

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        let fullReply = "";

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.data.choices[0]?.delta?.content;
                        if (content) {
                            fullReply += content;
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }

                    // Store Assistant Reply in DB after streaming completes
                    if (conversationId && fullReply) {
                        try {
                            const { default: prisma } = await import("@/lib/db");
                            await prisma.chatMessage.create({
                                data: {
                                    conversationId: conversationId,
                                    role: 'assistant',
                                    content: fullReply
                                }
                            });
                        } catch (e) {
                            console.error("DB Error (Save Reply):", e);
                        }
                    }

                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
