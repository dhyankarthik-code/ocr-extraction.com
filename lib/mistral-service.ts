import { Mistral } from '@mistralai/mistralai';

export interface OCRResult {
    rawText: string;
    cleanedText: string;
    pages?: any[];
    method: string;
    success: boolean;
    error?: string;
    warnings?: string[];
}

function cleanOCROutput(text: string): string {
    if (!text) return '';
    let cleaned = text;
    cleaned = cleaned.replaceAll(/\n{3,}/g, '\n\n');
    cleaned = cleaned.replaceAll(/[ \t]+/g, ' ');
    cleaned = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    return cleaned.trim();
}

/**
 * Performs OCR using Mistral API (primary) with Google Vision fallback (secondary).
 * Supports both Images (base64) and PDFs (file buffer).
 */
export async function performMistralOCR(file: File, buffer: Buffer): Promise<OCRResult> {
    const mistralKey = process.env.MISTRAL_API_KEY;
    // const googleKey = process.env.GOOGLE_CLOUD_API_KEY; // Google fallback can be added if needed, focusing on Mistral as requested.

    if (!mistralKey) {
        return {
            success: false,
            error: 'Mistral API key not configured',
            rawText: '',
            cleanedText: '',
            method: 'none'
        };
    }

    const client = new Mistral({ apiKey: mistralKey });
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    try {
        if (isPDF) {
            console.log('[Mistral Service] Uploading PDF...');
            // 1. Upload
            const uploadResponse = await client.files.upload({
                file: {
                    fileName: file.name,
                    content: buffer,
                },
                purpose: 'ocr'
            });

            // 2. Process
            console.log('[Mistral Service] Processing PDF OCR...');
            const ocrResponse = await client.ocr.process({
                model: "mistral-ocr-latest",
                document: {
                    type: "file",
                    fileId: uploadResponse.id
                }
            });

            if (!ocrResponse.pages || ocrResponse.pages.length === 0) {
                throw new Error('Mistral OCR returned no pages');
            }

            const rawText = ocrResponse.pages.map((p: any) => p.markdown).join('\n\n');

            return {
                success: true,
                rawText,
                cleanedText: cleanOCROutput(rawText),
                pages: ocrResponse.pages,
                method: 'mistral_pdf'
            };

        } else {
            // Image Check
            console.log('[Mistral Service] Processing Image OCR...');
            const base64 = buffer.toString('base64');
            const dataUrl = `data:${file.type};base64,${base64}`;

            const ocrResponse = await client.ocr.process({
                model: "mistral-ocr-latest",
                document: {
                    type: "image_url",
                    imageUrl: dataUrl
                }
            });

            if (!ocrResponse.pages || ocrResponse.pages.length === 0) {
                throw new Error('Mistral OCR returned no pages for image');
            }

            const rawText = ocrResponse.pages.map((p: any) => p.markdown).join('\n\n');

            return {
                success: true,
                rawText,
                cleanedText: cleanOCROutput(rawText),
                pages: ocrResponse.pages,
                method: 'mistral_image'
            };
        }

    } catch (error: any) {
        console.error('[Mistral Service] Error:', error);
        return {
            success: false,
            error: error.message || 'Mistral OCR failed',
            rawText: '',
            cleanedText: '',
            method: 'mistral_error'
        };
    }
}
