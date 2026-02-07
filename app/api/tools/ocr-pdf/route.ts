import { NextRequest, NextResponse } from 'next/server';
import { performMistralOCR } from '@/lib/mistral-service';
import { checkQuota, incrementUsage } from '@/lib/quota';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 1. Check Quota
        const quota = await checkQuota(request, file.size);
        if (!quota.allowed) {
            return NextResponse.json({
                error: quota.error,
                details: quota.details
            }, { status: 403 });
        }

        // 2. Process
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await performMistralOCR(file, buffer);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // 3. Track Usage
        await incrementUsage(quota.userType, quota.identifier, file.size);

        // Return the text content
        return new NextResponse(result.cleanedText, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="ocr_result.txt"`,
            },
        });

    } catch (error: any) {
        console.error('OCR PDF error:', error);
        return NextResponse.json({ error: 'OCR failed: ' + error.message }, { status: 500 });
    }
}
