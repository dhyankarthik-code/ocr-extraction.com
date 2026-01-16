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
      console.warn('⚠️ MOCK MODE: MISTRAL_API_KEY not configured. Returning mock summary.');
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({
        summary: `**Executive Summary**:
This is a **MOCK SUMMARY** generated because the Mistral API key is not configured in your environment variables. In a production environment, this text would be a comprehensive analysis of your uploaded document.

**Key Insights**:
- The document appears to contain important information, but I cannot analyze it without the AI provider.
- This mock mode allows you to test the frontend UI/UX without incurring API costs.
- Please configure MISTRAL_API_KEY in your .env file to enable real AI summarization.

**Detailed Analysis**:
The system has successfully received your request and processed the text input. Since the AI backend is currently in simulated mode, we are providing this placeholder content. This ensures that the application flow remains functional for development and testing purposes.

**Actionable Takeaways**:
- Verify your .env configuration.
- Restart your development server if you recently added the key.
- Enjoy the seamless experience of the OCR Extraction tool!`
      });
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
