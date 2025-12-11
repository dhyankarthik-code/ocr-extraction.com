import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey) {
      return NextResponse.json({ error: 'Mistral API key not configured' }, { status: 500 });
    }

    const client = new Mistral({ apiKey: mistralKey });

    const completion = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are an expert professional document analyst. Create a comprehensive "AI Report" from the provided text.
          
          Structure your response exactly as follows:
          
          **Executive Summary**:
          (A professional, high-level overview of the document's purpose and content, approx 2-3 sentences)
          
          **Key Insights**:
          - (Insight 1)
          - (Insight 2)
          - (Insight 3)
          
          **Detailed Analysis**:
          (A deeper breakdown of the main topics found in the text)
          
          **Actionable Takeaways**:
          (If applicable, what acts or decisions can be made based on this text)
          
          Tone: Professional, objective, and analytical. Do not use markdown code blocks, just standard accessible markdown.`
        },
        { role: "user", content: `Analyze and report on this text:\n\n${text}` }
      ],
      temperature: 0.2, // Low temperature for factual accuracy
    });

    const summary = completion.choices?.[0]?.message?.content || '';
    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Summary generation failed:', {
      name: error.name,
      message: error.message,
    });
    return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
  }
}
