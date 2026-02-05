import { NextRequest, NextResponse } from 'next/server';
import { convertPdfToWord } from '@/lib/stirling-client';
import { Mistral } from '@mistralai/mistralai';
import { markdownToDocx } from '@/lib/markdown-to-docx';

export const runtime = "nodejs";
export const maxDuration = 60; // Increase timeout for AI processing

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const mode = formData.get('mode') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // --- SMART MODE (Mistral OCR -> Markdown -> DOCX) ---
        if (mode === 'smart' && process.env.MISTRAL_API_KEY) {
            console.log('[PDF-to-Word] Smart Mode active. Using Mistral OCR.');
            try {
                const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                console.log('[PDF-to-Word] Smart Mode: Uploading file...');
                // 1. Upload PDF
                const uploadedFile = await client.files.upload({
                    file: {
                        fileName: file.name,
                        content: buffer,
                    },
                    purpose: 'ocr'
                });
                console.log('[PDF-to-Word] Smart Mode: File uploaded, ID:', uploadedFile.id);

                // 2. Process OCR
                console.log('[PDF-to-Word] Smart Mode: Starting OCR processing...');
                const response = await client.ocr.process({
                    model: "mistral-ocr-latest",
                    document: {
                        type: "file",
                        fileId: uploadedFile.id
                    }
                });
                console.log('[PDF-to-Word] Smart Mode: OCR completed. Pages:', response.pages?.length);

                if (!response.pages || response.pages.length === 0) {
                    throw new Error('AI processing returned no content');
                }

                // 3. Combine output
                const fullMarkdown = response.pages.map((p: any) => p.markdown).join('\n\n');
                console.log('[PDF-to-Word] Smart Mode: Markdown generated, length:', fullMarkdown.length);

                // 4. Convert Markdown to DOCX
                console.log('[PDF-to-Word] Smart Mode: Converting Markdown to DOCX...');
                const docxBuffer = await markdownToDocx(fullMarkdown);
                console.log('[PDF-to-Word] Smart Mode: DOCX buffer created, size:', docxBuffer.byteLength);

                return new NextResponse(docxBuffer as any, {
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Disposition': `attachment; filename="converted_smart.docx"`,
                    },
                });

            } catch (aiError: any) {
                console.error('[PDF-to-Word] Smart Mode CRITICAL FAILURE:', JSON.stringify(aiError, null, 2));
                console.warn('[PDF-to-Word] Falling back to Standard Mode (Stirling/LibreOffice)...');
                // Do NOT return error here. Allow execution to fall through to Standard Mode below.
            }
        }


        // --- STANDARD MODE (Stirling PDF / LibreOffice) ---
        const result = await convertPdfToWord(file);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // Return the DOCX file
        return new NextResponse(result.data, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="converted.docx"`,
            },
        });
    } catch (error) {
        console.error('PDF to Word error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
