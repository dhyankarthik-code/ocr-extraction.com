import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { markdownToDocx } from '@/lib/markdown-to-docx';

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes for large PDFs

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

const PDF2DOCX_URL = process.env.PDF2DOCX_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const mode = formData.get('mode') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // --- SMART MODE (Mistral OCR -> Markdown -> DOCX) ---
        // Use when OCR is needed for scanned/image-based PDFs
        if (mode === 'smart' && process.env.MISTRAL_API_KEY) {
            console.log('[PDF-to-Word] Smart Mode active. Using Mistral OCR.');
            try {
                const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                console.log('[PDF-to-Word] Smart Mode: Uploading file...');
                const uploadedFile = await client.files.upload({
                    file: {
                        fileName: file.name,
                        content: buffer,
                    },
                    purpose: 'ocr'
                });
                console.log('[PDF-to-Word] Smart Mode: File uploaded, ID:', uploadedFile.id);

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

                const fullMarkdown = response.pages.map((p: any) => p.markdown).join('\n\n');
                console.log('[PDF-to-Word] Smart Mode: Markdown generated, length:', fullMarkdown.length);

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
                console.warn('[PDF-to-Word] Falling back to Standard Mode (pdf2docx)...');
                // Fall through to Standard Mode below
            }
        }


        // --- STANDARD MODE (pdf2docx - High Fidelity Layout Preservation) ---
        console.log('[PDF-to-Word] Standard Mode: Using pdf2docx service for high-fidelity conversion...');

        try {
            const serviceFormData = new FormData();
            serviceFormData.append('file', file);

            const response = await fetch(`${PDF2DOCX_URL}/convert`, {
                method: 'POST',
                body: serviceFormData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Conversion failed' }));
                console.error('[PDF-to-Word] pdf2docx service error:', errorData);
                return NextResponse.json({ error: errorData.error || 'Conversion failed' }, { status: response.status });
            }

            const docxBuffer = await response.arrayBuffer();
            console.log('[PDF-to-Word] Standard Mode: Conversion successful, size:', docxBuffer.byteLength);

            return new NextResponse(docxBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.docx')}"`,
                },
            });

        } catch (serviceError: any) {
            console.error('[PDF-to-Word] Standard Mode FAILURE:', serviceError.message);
            return NextResponse.json({ error: 'PDF conversion service unavailable' }, { status: 503 });
        }

    } catch (error: any) {
        console.error('[PDF-to-Word] Error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
