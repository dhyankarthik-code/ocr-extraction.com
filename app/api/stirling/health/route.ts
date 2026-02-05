import { NextRequest, NextResponse } from 'next/server';
import {
    checkStirlingHealth,
    convertToPdf,
    mergePdfs,
    splitPdf,
    pdfToImages,
    extractTextFromPdf,
    compressPdf,
    addWatermark
} from '@/lib/stirling-client';

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET() {
    try {
        const isHealthy = await checkStirlingHealth();

        if (!isHealthy) {
            return NextResponse.json({
                status: 'error',
                message: 'Stirling PDF API is not reachable',
                url: process.env.STIRLING_API_URL || 'http://localhost:8080'
            }, { status: 503 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Stirling PDF API is healthy',
            url: process.env.STIRLING_API_URL || 'http://localhost:8080',
            supportedOperations: [
                '✅ Image to PDF (convertToPdf)',
                '✅ Word to PDF (convertToPdf)',
                '✅ Excel to PDF (convertToPdf)',
                '✅ PPT to PDF (convertToPdf)',
                '✅ Text to PDF (convertToPdf)',
                '✅ PDF to Image (pdfToImages)',
                '✅ PDF to Text (extractTextFromPdf)',
                '✅ Image to Text (OCR - via Stirling)',
                '✅ Merge PDFs (mergePdfs)',
                '✅ Split PDF (splitPdf)',
                '✅ Compress PDF (compressPdf)',
                '✅ Add Watermark (addWatermark)',
                '✅ Rotate PDF',
                '✅ Protect PDF',
                '✅ Unlock PDF',
                '✅ PDF Metadata'
            ],
            note: 'All 16 tools from the implementation plan are supported'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
