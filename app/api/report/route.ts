import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

const CATEGORY_PROMPTS: Record<string, string> = {
    'key-insights': `You are a Data Extractor. Extract ONLY facts explicitly stated in the text.
    
    RULES:
    1. NO fluff, NO generic intros/outros.
    2. NO JSON, NO code blocks.
    3. If a fact is not in the text, DO NOT invent it.
    4. Use clean Markdown.

    FORMAT:
    # Key Facts
    * [Fact 1]
    * [Fact 2]
    * [Fact 3]
    
    IF TEXT IS TOO SHORT/NONSENSE: Return ONLY 'INELIGIBLE'.`,

    'cost-analysis': `You are a Financial Auditor. Extract ONLY explicit financial data.
    
    RULES:
    1. NO generic advice like "optimize spending".
    2. Extract exact amounts and currency.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Cost Data
    
    ## Totals
    * **Total Amount**: [Value]
    * **Tax/GST**: [Value]
    
    ## Line Items
    * [Item Name]: [Price]
    * [Item Name]: [Price]
    
    IF NO FINANCIAL NUMBERS FOUND: Return ONLY 'INELIGIBLE'.`,

    'performance': `You are a Data Analyst. Extract ONLY performance metrics found in the text.
    
    RULES:
    1. NO motivation speech or generic praise.
    2. Only list numbers/KPIs explicitly found.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Performance Metrics
    * **[Metric Name]**: [Value]
    * **[Metric Name]**: [Value]
    
    IF NO METRICS FOUND: Return ONLY 'INELIGIBLE'.`,

    'trend-forecast': `You are a Data Analyst. Extract ONLY explicit dates and associated patterns.
    
    RULES:
    1. NO predicting the future unless text explicitly mentions forecasts.
    2. NO generic "market trends" advice.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Timeline & Trends
    * **[Date/Period]**: [Event/Value]
    * **[Date/Period]**: [Event/Value]
    
    IF NO DATES/TREND DATA FOUND: Return ONLY 'INELIGIBLE'.`,

    'operational-efficiency': `You are a Process Auditor. Extract ONLY observed workflow steps and explicit errors.
    
    RULES:
    1. NEVER make recommendations ("Train staff", "Buy software"). these are BANNED.
    2. Only state what happened in the document.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Operational Audit
    
    ## Observed Process Steps
    * [Step 1 found in text]
    * [Step 2 found in text]
    
    ## Explicit Errors/Issues (If any)
    * [Error explicitly mentioned or clear typo/duplicate]
    
    IF NO PROCESS/WORKFLOW DATA: Return ONLY 'INELIGIBLE'.`
};

export async function POST(req: NextRequest) {
    try {
        const { text, category } = await req.json();

        if (!text || !category) {
            return NextResponse.json({ error: 'Missing text or category' }, { status: 400 });
        }

        const systemPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['key-insights'];
        const mistralKey = process.env.MISTRAL_API_KEY;

        if (!mistralKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const client = new Mistral({ apiKey: mistralKey });

        // 1. First Pass: Fast Eligibility Check (Non-streaming)
        const checkPrompt = systemPrompt + "\n\nCRITICAL: First, determine if the document contains relevant data for this category. If NOT eligible, respond with ONLY the word 'INELIGIBLE'. If eligible, respond with 'ELIGIBLE'.";

        const checkCompletion = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: checkPrompt },
                { role: "user", content: `Check this text (first 2000 chars): ${text.slice(0, 2000)}` }
            ],
            temperature: 0.1,
            maxTokens: 50,
        });

        const checkContent = (typeof checkCompletion.choices?.[0]?.message?.content === 'string'
            ? checkCompletion.choices[0].message.content
            : JSON.stringify(checkCompletion.choices?.[0]?.message?.content || "")).trim();

        // Handle ineligibility
        if (checkContent.includes("INELIGIBLE") || checkContent.toLowerCase().includes("ineligible")) {
            const encoder = new TextEncoder();
            const readableStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: true, reason: "Document does not contain sufficient data for this report category." })}\n\n`));
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                }
            });
            return new Response(readableStream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // 2. Second Pass: Full Report Generation (Streaming)
        const stream = await client.chat.stream({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: systemPrompt + "\n\nNOTE: You determined this is ELIGIBLE. Now generate the FULL REPORT. Be precise and concise. No fluff." },
                { role: "user", content: text }
            ],
            temperature: 0.1, // High precision
        });

        // Create stream response
        const encoder = new TextEncoder();

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.data.choices[0]?.delta?.content;
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                } catch (error) {
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
        console.error('Report API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
    }
}
