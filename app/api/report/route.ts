import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

const CATEGORY_PROMPTS: Record<string, string> = {
    'key-insights': `You are a Data Extractor. Extract facts and summarize the document.
    
    RULES:
    1. NO fluff, NO generic intros/outros.
    2. NO JSON, NO code blocks.
    3. If a fact is not in the text, DO NOT invent it.
    4. Use clean Markdown.

    FORMAT:
    # Executive Summary
    [A concise 2-3 sentence overview of the document]
    
    # Key Metrics
    * **[Metric Name]**: [Value]
    * **[Metric Name]**: [Value]
    
    # Key Facts & Findings
    * [Fact 1]
    * [Fact 2]
    * [Fact 3]
    
    IF TEXT IS TOO SHORT/NONSENSE: Return ONLY 'INELIGIBLE'.`,

    'cost-analysis': `You are a Financial Auditor. Analyze financial data.
    
    RULES:
    1. NO generic advice.
    2. Extract exact amounts and currency.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Executive Summary
    [A concise financial overview of the document]
    
    # Key Metrics
    * **Total Amount**: [Value]
    * **Tax/GST**: [Value]
    * **Major Expense**: [Value]
    
    # Detailed Cost Data
    
    ## Line Items
    * [Item Name]: [Price]
    * [Item Name]: [Price]
    
    IF NO FINANCIAL NUMBERS FOUND: Return ONLY 'INELIGIBLE'.`,

    'performance': `You are a Data Analyst. Evaluate performance metrics.
    
    RULES:
    1. NO motivation speech.
    2. Only list numbers/KPIs explicitly found.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Executive Summary
    [A concise overview of performance achievements]
    
    # Key Metrics
    * **[KPI Name]**: [Value]
    * **[KPI Name]**: [Value]
    
    # Detailed Performance Analysis
    * **Achievement**: [Description]
    * **Area for Improvement**: [Description]
    
    IF NO METRICS FOUND: Return ONLY 'INELIGIBLE'.`,

    'trend-forecast': `You are a Data Analyst.  Identify trends and patterns.
    
    RULES:
    1. NO predicting the future unless text explicitly mentions forecasts.
    2. NO generic "market trends" advice.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Executive Summary
    [A concise overview of identified trends]
    
    # Key Metrics
    * **[Trend Metric]**: [Value/Direction]
    * **[Forecast Metric]**: [Value/Prediction]
    
    # Timeline & Analysis
    * **[Date/Period]**: [Event/Value]
    * **[Date/Period]**: [Event/Value]
    
    IF NO DATES/TREND DATA FOUND: Return ONLY 'INELIGIBLE'.`,

    'operational-efficiency': `You are a Process Auditor. Analyze workflows.
    
    RULES:
    1. NEVER make recommendations ("Train staff", "Buy software") unless explicitly supported by text.
    2. Only state what happened in the document.
    3. NO JSON, NO code blocks.

    FORMAT:
    # Executive Summary
    [A concise overview of operational processes]
    
    # Key Metrics
    * **[Process Metric]**: [Time/Efficiency/Rate]
    * **[Error Rate/Issue]**: [Count/Value]
    
    # Operational Audit
    
    ## Observed Process Steps
    * [Step 1 found in text]
    * [Step 2 found in text]
    
    ## Explicit Errors/Issues
    * [Error mentioned]
    
    IF NO PROCESS/WORKFLOW DATA: Return ONLY 'INELIGIBLE'.`
};

const MOCK_REPORTS: Record<string, string> = {
    'key-insights': `# Executive Summary
This is a **MOCK** Key Insights Report generated because the AI service is currently unavailable or the API key is invalid. It simulates the structure of a real report.

# Key Metrics
* **Document Pages**: 1
* **Detected Topic**: Business Document
* **Processing Status**: Simulated

# Key Facts & Findings
* The OCR system successfully extracted text from your document.
* The AI generation step encountered a temporary issue (e.g., limit reached or key missing).
* This fallback ensures you can still view the UI layout and test export features.
* In a production environment with valid keys, this section would contain specific facts derived from your uploaded file.`,

    'cost-analysis': `# Executive Summary
This is a **MOCK** Cost Analysis Report. The system could not reach the AI provider to analyze specific financial figures in your document.

# Key Metrics
* **Total Amount**: $0.00 (Mock)
* **Tax/GST**: $0.00 (Mock)
* **Major Expense**: N/A

# Detailed Cost Data

## Line Items
* Mock Item 1: $100.00
* Mock Item 2: $50.00

*Note: Please check your API configuration or try again later for real analysis.*`,

    'performance': `# Executive Summary
This is a **MOCK** Performance Report. Real performance metrics could not be generated due to a service connection issue.

# Key Metrics
* **Efficiency Score**: 100% (Simulated)
* **Error Rate**: 0% (Simulated)

# Detailed Performance Analysis
* **Achievement**: The system handled the error gracefully by serving this fallback content.
* **Area for Improvement**: Ensure the MISTRAL_API_KEY is correctly set in your environment variables.`,

    'trend-forecast': `# Executive Summary
This is a **MOCK** Trend & Forecast Report. The AI was unable to predict trends from this document at this time.

# Key Metrics
* **Growth Trend**: Positive (Simulated)
* **Forecast Confidence**: Low (Mock Data)

# Timeline & Analysis
* **Current Period**: Data extraction successful.
* **Future Outlook**: Please configure valid API credentials to unlock real forecasting capabilities.`,

    'operational-efficiency': `# Executive Summary
This is a **MOCK** Operational Efficiency Report. Workflow analysis is currently simulated.

# Key Metrics
* **Process Time**: < 100ms
* **Bottlenecks Detected**: 0

# Operational Audit

## Observed Process Steps
* Step 1: Document uploaded.
* Step 2: OCR text extracted.
* Step 3: AI analysis failed (Fallback triggered).

## Explicit Errors/Issues
* Connection to Mistral AI failed or unauthorized. Check server logs.`
};

export async function POST(req: NextRequest) {
    const { text, category } = await req.json();

    if (!text || !category) {
        return NextResponse.json({ error: 'Missing text or category' }, { status: 400 });
    }

    const systemPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['key-insights'];
    const mistralKey = process.env.MISTRAL_API_KEY;

    // Fail-safe: If no key, immediately stream mock
    if (!mistralKey) {
        console.warn('⚠️ MOCK MODE: MISTRAL_API_KEY not configured. Streaming mock report.');
        return streamMockResponse(category);
    }

    // Try Real AI
    try {
        const client = new Mistral({ apiKey: mistralKey });

        // 1. First Pass: Fast Eligibility Check (Non-streaming)
        // We wrap this in a try/catch specifically to catch API errors (401, 429) early
        let checkContent = "";
        try {
            const checkCompletion = await client.chat.complete({
                model: "mistral-large-latest",
                messages: [
                    { role: "system", content: systemPrompt + "\n\nCRITICAL: First, determine if the document contains relevant data for this category. If NOT eligible, respond with ONLY the word 'INELIGIBLE'. If eligible, respond with 'ELIGIBLE'. checkContent" },
                    { role: "user", content: `Check this text (first 2000 chars): ${text.slice(0, 2000)}` }
                ],
                temperature: 0.1,
                maxTokens: 50,
            });

            checkContent = (typeof checkCompletion.choices?.[0]?.message?.content === 'string'
                ? checkCompletion.choices[0].message.content
                : JSON.stringify(checkCompletion.choices?.[0]?.message?.content || "")).trim();

        } catch (apiError: any) {
            console.error('Mistral Eligibility Check Failed:', apiError.message);
            // If this check fails (e.g. 401), we throw to the outer catch to trigger fallback
            throw apiError;
        }

        // Handle ineligibility
        if (checkContent.includes("INELIGIBLE") || checkContent.toLowerCase().includes("ineligible")) {
            // Return ineligible stream (as before)
            const encoder = new TextEncoder();
            const readableStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: true, reason: "Document does not contain sufficient data for this report category." })}\n\n`));
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                }
            });
            return new Response(readableStream, {
                headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
            });
        }

        // 2. Second Pass: Full Report Generation (Streaming)
        const stream = await client.chat.stream({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: systemPrompt + "\n\nNOTE: You determined this is ELIGIBLE. Now generate the FULL REPORT. Be precise and concise. No fluff." },
                { role: "user", content: text }
            ],
            temperature: 0.1,
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
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
        });

    } catch (error: any) {
        console.error('⚠️ Real AI Failed. Falling back to Mock Data. Error:', error.message);
        // Fallback to mock stream on ANY error during the process
        return streamMockResponse(category);
    }
}

function streamMockResponse(category: string) {
    const mockContent = MOCK_REPORTS[category] || MOCK_REPORTS['key-insights'];
    const encoder = new TextEncoder();

    // Simulate streaming by splitting chunks (optional, often just sending it all at once is fine for mock, 
    // but splitting simulates the feel better)
    const readableStream = new ReadableStream({
        async start(controller) {
            // Artificial delay to mimic network
            await new Promise(r => setTimeout(r, 500));

            const chunks = mockContent.match(/.{1,50}/g) || [mockContent];
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
                await new Promise(r => setTimeout(r, 30)); // fast typing effect
            }
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
