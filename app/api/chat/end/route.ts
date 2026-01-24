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


        // Format timestamps
        const startedAt = new Date(conversation.startedAt)
        const endedAt = new Date()

        // Format IST Time (Indian Standard Time)
        const istOptions: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' }
        const startedAtIST = new Intl.DateTimeFormat('en-IN', istOptions).format(startedAt)

        // Format Local Time (Server Time / UTC usually)
        const localOptions: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'medium' }
        const startedAtLocal = new Intl.DateTimeFormat('en-US', localOptions).format(startedAt)

        // Send email via Resend
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #d32f2f; margin-bottom: 20px;">New Chat Support Session</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold; width: 140px;">Session ID:</td>
                        <td style="padding: 10px;">${sessionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Customer Email:</td>
                        <td style="padding: 10px;">${userEmail || 'N/A (Guest)'}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Location:</td>
                        <td style="padding: 10px;">
                            ${conversation.city || 'Unknown City'}, ${conversation.region || 'Unknown Region'}, ${conversation.country || 'Unknown Country'}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">IP Address:</td>
                        <td style="padding: 10px;">${conversation.ipAddress || 'Unknown'}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Time (IST):</td>
                        <td style="padding: 10px;">${startedAtIST}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Time (Local):</td>
                        <td style="padding: 10px;">${startedAtLocal}</td>
                    </tr>
                </table>
                
                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #856404;">AI Summary</h3>
                    <p style="margin-bottom: 0;">${summary}</p>
                </div>
                
                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Full Conversation</h3>
                <pre style="background: #f1f2f3; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: Consolas, monospace; font-size: 13px; border: 1px solid #ddd;">${chatLog}</pre>
                
                <div style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
                    Sent from Infy Galaxy Chat Widget
                </div>
            </div>
        </body>
        </html>
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
