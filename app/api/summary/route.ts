import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limit';
import redis from '@/lib/redis';
import crypto from 'node:crypto'; // Fixed: Use node: prefix

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    // 1. Fail-Safe Rate Limiting
    const rateLimitError = await checkRateLimitSafe(ip);
    if (rateLimitError) return rateLimitError;

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 2. Fail-Safe Cache Check
    const { key: cacheKey, content: cachedSummary } = await getCache(text);
    if (cachedSummary) {
      console.log(`⚡ Cache HIT for summary: ${cacheKey.split(':')[1].substring(0, 8)}...`);
      return NextResponse.json({ summary: cachedSummary });
    }

    // 3. AI Generation (or Mock)
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey) {
      return handleMockResponse();
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
          
          **Tone**: Professional, objective, and analytical. Do not use markdown code blocks, just standard accessible markdown.`
        },
        { role: "user", content: `Analyze and report on this text:\n\n${text}` }
      ],
      temperature: 0.2, // Low temperature for factual accuracy
    });

    const content = completion.choices?.[0]?.message?.content;
    const summary = typeof content === 'string' ? content : '';

    // 4. Fail-Safe Cache Write
    await setCache(cacheKey, summary);

    return NextResponse.json({ summary });

  } catch (error: any) {
    return handleError(error);
  }
}

// --- Helper Functions ---

async function checkRateLimitSafe(ip: string): Promise<NextResponse | null> {
  if (!apiRateLimiter) return null;
  try {
    const { success } = await apiRateLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }
  } catch (err) {
    console.warn('⚠️ Rate limiter error (Fail-Open active):', err);
  }
  return null;
}

async function getCache(text: string): Promise<{ key: string, content: string | null }> {
  if (!redis) return { key: '', content: null };
  try {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    const key = `summary:${hash}`;
    const content = await redis.get<string>(key);
    return { key, content };
  } catch (err) {
    console.warn('⚠️ Redis cache read failed (proceeding without cache):', err);
    return { key: '', content: null };
  }
}

async function setCache(key: string, content: string) {
  if (!redis || !key || !content) return;
  try {
    await redis.set(key, content, { ex: 86400 }); // 24 hours
    console.log(`💾 Cached new summary: ${key}`);
  } catch (err) {
    console.warn('⚠️ Redis cache write failed:', err);
  }
}

async function handleMockResponse() {
  console.warn('⚠️ MOCK MODE: MISTRAL_API_KEY not configured. Returning mock summary.');
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

function handleError(error: any) {
  console.error('Summary generation failed:', {
    name: error.name,
    message: error.message,
    status: error.status || error.statusCode,
  });

  if (error.status === 401 || error.statusCode === 401 || error.message?.includes('Unauthorized')) {
    console.warn('⚠️ Mistral API key rejected. Falling back to mock summary for demo.');
    return NextResponse.json({
      summary: `**Executive Summary**:
This is a **FALLBACK SUMMARY** because the Mistral API returned an authentication error (401). Your API key may be expired or invalid.

**Key Insights**:
- The document was received and processed successfully.
- AI summarization requires a valid Mistral API key.
- Please regenerate your key at console.mistral.ai

**Actionable Takeaways**:
- Visit https://console.mistral.ai/api-keys to create a new key.
- Update your .env file with the new key.
- Restart your development server.`
    });
  }

  return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
}
