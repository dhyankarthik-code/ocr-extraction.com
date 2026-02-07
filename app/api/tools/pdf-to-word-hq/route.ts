import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes for large PDFs

const PDF2DOCX_URL = process.env.PDF2DOCX_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
        }

        // Forward to pdf2docx service
        const serviceFormData = new FormData();
        serviceFormData.append('file', file);

        console.log('[PDF-to-Word-HQ] Calling pdf2docx service...');

        const response = await fetch(`${PDF2DOCX_URL}/convert`, {
            method: 'POST',
            body: serviceFormData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Conversion failed' }));
            console.error('[PDF-to-Word-HQ] Service error:', errorData);
            return NextResponse.json(errorData, { status: response.status });
        }

        const docxBuffer = await response.arrayBuffer();
        console.log('[PDF-to-Word-HQ] Conversion successful, size:', docxBuffer.byteLength);

        return new NextResponse(docxBuffer as any, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.docx')}"`,
            },
        });

    } catch (error: any) {
        console.error('[PDF-to-Word-HQ] Error:', error);
        return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
    }
}
