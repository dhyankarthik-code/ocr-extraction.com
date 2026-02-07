import { NextRequest, NextResponse } from 'next/server';
import { pdfToImages } from '@/lib/stirling-client';

// Force Node.js runtime for large file handling
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const format = (formData.get('format') as 'png' | 'jpeg' | 'gif') || 'png';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const result = await pdfToImages(file, format);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // Return the ZIP file containing images
        return new NextResponse(result.data, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="converted_images.zip"`,
            },
        });
    } catch (error) {
        console.error('PDF to Image error:', error);
        return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }
}
