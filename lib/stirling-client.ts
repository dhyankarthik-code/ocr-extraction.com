/**
 * Stirling PDF API Client
 * 
 * Edge-safe: Uses native fetch and avoids Node.js-only APIs.
 * For API routes that need larger file handling, add: export const runtime = "nodejs";
 */

const STIRLING_URL = process.env.STIRLING_API_URL || 'http://localhost:8080';
const STIRLING_API_KEY = process.env.STIRLING_API_KEY;

export interface StirlingResponse {
    success: boolean;
    data?: ArrayBuffer;
    error?: string;
}

/**
 * Core function to call Stirling PDF API
 * Uses X-API-KEY header (Edge-safe, no Buffer.from)
 */
export async function callStirlingApi(
    endpoint: string,
    formData: FormData
): Promise<StirlingResponse> {
    try {
        const headers: HeadersInit = {};

        // API Key auth - Edge-safe (no Buffer)
        if (STIRLING_API_KEY) {
            headers['X-API-KEY'] = STIRLING_API_KEY;
        }

        const response = await fetch(`${STIRLING_URL}/api/v1/${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                error: `Stirling API Error: ${response.status} - ${errorText}`
            };
        }

        const buffer = await response.arrayBuffer();
        return { success: true, data: buffer };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Network Error: ${message}` };
    }
}

// ============================================
// Conversion Functions
// ============================================

/**
 * Convert any supported file to PDF
 * Supported: Word, Excel, PowerPoint, Images, HTML
 */
export async function convertToPdf(file: File): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    return callStirlingApi('convert/file/pdf', formData);
}

/**
 * Convert PDF to Word (DOCX)
 */
export async function convertPdfToWord(file: File): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('outputFormat', 'docx');
    return callStirlingApi('convert/pdf/word', formData);
}

/**
 * Convert PDF to PowerPoint (PPTX)
 */
export async function convertPdfToPresentation(file: File): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('outputFormat', 'pptx');
    return callStirlingApi('convert/pdf/presentation', formData);
}

/**
 * Convert PDF to HTML
 */
export async function convertPdfToHtml(file: File): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('outputFormat', 'html');
    return callStirlingApi('convert/pdf/html', formData);
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(files: File[]): Promise<StirlingResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('fileInput', file));
    return callStirlingApi('general/merge-pdfs', formData);
}

/**
 * Split a PDF into multiple files
 */
export async function splitPdf(
    file: File,
    pages: string // e.g., "1,3,5-7"
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('pageNumbers', pages);
    return callStirlingApi('general/split-pages', formData);
}

/**
 * Convert PDF to Images (returns a ZIP of images)
 */
export async function pdfToImages(
    file: File,
    imageFormat: 'png' | 'jpeg' | 'gif' = 'png',
    dpi: number = 150
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('imageFormat', imageFormat);
    formData.append('singleOrMultiple', 'multiple');
    formData.append('dpi', dpi.toString());
    return callStirlingApi('convert/pdf/img', formData);
}

/**
 * Extract text from PDF
 */
export async function extractTextFromPdf(file: File): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    return callStirlingApi('convert/pdf/text', formData);
}

/**
 * Compress a PDF to reduce file size
 */
export async function compressPdf(
    file: File,
    compressionLevel: number = 5 // 1-9, higher = more compression
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('optimizeLevel', compressionLevel.toString());
    return callStirlingApi('misc/compress-pdf', formData);
}

/**
 * Add watermark to PDF
 */
export async function addWatermark(
    file: File,
    watermarkText: string,
    fontSize: number = 30,
    rotation: number = 45,
    opacity: number = 0.5
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('text', watermarkText);
    formData.append('fontSize', fontSize.toString());
    formData.append('rotation', rotation.toString());
    formData.append('opacity', opacity.toString());
    return callStirlingApi('security/add-watermark', formData);
}


/**
 * Rotate PDF
 */
export async function rotatePdf(
    file: File,
    angle: number = 90
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('angle', angle.toString());
    return callStirlingApi('general/rotate-pdf', formData);
}

/**
 * Protect PDF with Password
 */
export async function protectPdf(
    file: File,
    ownerPassword: string,
    userPassword: string = ''
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('ownerPassword', ownerPassword);
    formData.append('userPassword', userPassword);
    return callStirlingApi('security/add-password', formData);
}

/**
 * Unlock PDF (Remove Password)
 */
export async function unlockPdf(
    file: File,
    password: string
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('password', password);
    return callStirlingApi('security/remove-password', formData);
}

/**
 * Update PDF Metadata
 */
export async function updateMetadata(
    file: File,
    author: string,
    title: string,
    subject: string,
    keywords: string
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('author', author);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('keywords', keywords);
    return callStirlingApi('misc/update-metadata', formData);
}

/**
 * OCR PDF (Image to Text / PDF to Text with OCR)
 * Note: Stirling has multiple OCR endpoints, using the most generic one
 */
export async function ocrPdf(
    file: File,
    languages: string[] = ['eng']
): Promise<StirlingResponse> {
    const formData = new FormData();
    formData.append('fileInput', file);
    formData.append('languages', languages.join(','));
    formData.append('sidecar', 'true'); // Return text file
    return callStirlingApi('misc/ocr-pdf', formData);
}

// ============================================
// Health Check
// ============================================

/**
 * Check if Stirling API is reachable
 */
export async function checkStirlingHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${STIRLING_URL}/api/v1/info/status`);
        return response.ok;
    } catch {
        return false;
    }
}
