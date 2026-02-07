import { NextRequest, NextResponse } from 'next/server';
import { convertToPdf } from '@/lib/stirling-client';

// Force Node.js runtime (handles larger files)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 413 });
        }

        // Determine target format
        const format = formData.get('format') as string || 'pdf';

        let result;
        let contentType = 'application/pdf';
        let filename = 'converted.pdf';

        if (format === 'ppt' || format === 'pptx') {
            const { convertPdfToPresentation } = await import('@/lib/stirling-client');
            result = await convertPdfToPresentation(file);
            contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            filename = 'converted.pptx';
        } else {
            // Default to PDF
            result = await convertToPdf(file);
        }

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // Return the file
        return new NextResponse(result.data, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
