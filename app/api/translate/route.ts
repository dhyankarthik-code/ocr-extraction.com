import { NextRequest, NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "" });

export async function POST(req: NextRequest) {
    try {
        const { text, targetLanguage } = await req.json();

        if (!text || !targetLanguage) {
            return NextResponse.json(
                { error: "Text and target language are required" },
                { status: 400 }
            );
        }

        if (!process.env.MISTRAL_API_KEY) {
            return NextResponse.json(
                { error: "Mistral API Key is not configured" },
                { status: 500 }
            );
        }

        const prompt = `You are a professional document translator. Translate the following OCR-extracted text into ${targetLanguage}.

CRITICAL RULES (MUST FOLLOW):
1. PRESERVE THE EXACT FORMAT: Translate line-by-line. If the original has 20 lines, your translation MUST have 20 lines.
2. DO NOT SKIP ANY LINE. Translate every single line including headers, addresses, numbers, codes, dates.
3. DO NOT REPEAT WORDS. If you find yourself repeating the same word, STOP and move to the next line.
4. Keep numbers, codes (GSTIN, CIN, Bill No, etc.), and dates AS-IS. Only translate the labels.
5. OUTPUT ONLY the translated text. No explanations, no "Here is the translation", no extra commentary.
6. If a word has no direct translation, transliterate it or keep it in English.

ORIGINAL TEXT:
---
${text}
---

TRANSLATED TEXT (${targetLanguage}):`;

        // Create a ReadableStream for the response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const chatStream = await mistral.chat.stream({
                        model: "mistral-large-latest", // Reverted to Large for best quality, keeping streaming for speed
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.1,
                    });

                    for await (const chunk of chatStream) {
                        const content = chunk.data.choices[0].delta.content;
                        if (typeof content === 'string') {
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });

    } catch (error: any) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { error: "Failed to translate text", details: error.message },
            { status: 500 }
        );
    }
}
