import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai';
import { Resend } from 'resend'



export async function POST(request: NextRequest) {
    try {
        const { sessionId, userEmail } = await request.json()

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        const { default: prisma } = await import("@/lib/db")

        // Get conversation with messages
        const conversation = await prisma.chatConversation.findUnique({
            where: { sessionId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        })

        if (!conversation || conversation.messages.length === 0) {
            return NextResponse.json({ error: 'No conversation found' }, { status: 404 })
        }

        // Don't process if already sent
        if (conversation.emailSent) {
            return NextResponse.json({ message: 'Email already sent' })
        }

        // Generate AI summary
        const chatLog = conversation.messages
            .map((m: any) => `${m.role === 'user' ? 'Customer' : 'Bot'}: ${m.content}`)
            .join('\n')

        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            throw new Error("Mistral API Key missing");
        }
        const client = new Mistral({ apiKey: mistralKey });

        const summaryResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [
                {
                    role: 'system',
                    content: 'You are a support ticket summarizer. Create a brief 2-3 sentence summary of this customer support conversation. Focus on: what the customer asked, whether it was resolved, and any follow-up needed.'
                },
                {
                    role: 'user',
                    content: `Summarize this conversation:\n\n${chatLog}`
                }
            ],
            temperature: 0.3,
        })

        let summary = summaryResponse.choices?.[0]?.message?.content || 'No summary available.'
        if (typeof summary !== 'string') {
            summary = JSON.stringify(summary)
        }

        // Update conversation with summary and end time
        await prisma.chatConversation.update({
            where: { id: conversation.id },
            data: {
                endedAt: new Date(),
                summary,
                userEmail: userEmail || null
            }
        })

        // Send email via Resend
        const emailHtml = `
        <h2>New Customer Support Conversation</h2>
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p><strong>Customer Email:</strong> ${userEmail || 'N/A (Guest)'}</p>
        <p><strong>Started:</strong> ${conversation.startedAt.toISOString()}</p>
        <p><strong>Ended:</strong> ${new Date().toISOString()}</p>
        
        <h3>Summary</h3>
        <p>${summary}</p>
        
        <h3>Full Conversation</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${chatLog}</pre>
        `

        // Send email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
                from: 'OCR Support <onboarding@resend.dev>',
                to: 'admin@ocr-extraction.com',
                subject: `[Support Chat] New Conversation - ${sessionId.slice(0, 8)}`,
                html: emailHtml
            })
        } else {
            console.warn('RESEND_API_KEY missing, skipping email.');
        }


        // Mark as sent
        await prisma.chatConversation.update({
            where: { id: conversation.id },
            data: { emailSent: true }
        })

        return NextResponse.json({ success: true, summary })
    } catch (error: any) {
        console.error('Chat end error:', error.message)
        return NextResponse.json(
            { error: 'Failed to end conversation', details: error.message },
            { status: 500 }
        )
    }
}
