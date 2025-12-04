import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const { message, documentText, chatHistory } = await request.json()

        if (!message || !documentText) {
            return NextResponse.json(
                { error: 'Message and document text are required' },
                { status: 400 }
            )
        }

        // Build conversation history
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            {
                role: 'system',
                content: `You are a helpful AI assistant analyzing an OCR-extracted document. Here is the document content:

${documentText}

Answer questions about this document accurately and concisely. If the answer isn't in the document, say so.`
            },
            ...(chatHistory || []),
            {
                role: 'user',
                content: message
            }
        ]

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.7,
            max_tokens: 500,
        })

        const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        )
    }
}
