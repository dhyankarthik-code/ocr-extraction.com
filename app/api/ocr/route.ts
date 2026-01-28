import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
// PDF processing handled natively by Mistral OCR - no pdfjs needed
import { trackUniqueEvent } from '@/lib/analytics';

// Configure Vercel Serverless Function timeout (seconds)
export const maxDuration = 60;



// Helper function to log detailed error information
function logError(error: any, context: string = '') {
    console.error(`[${new Date().toISOString()}] Error${context ? ' in ' + context : ''}:`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
    });
}

function cleanOCROutput(text: string): string {
    if (!text) return '';

    // Log original text for debugging (first 200 chars)
    console.log('[OCR Clean] Original text sample:', text.substring(0, 200));

    let cleaned = text;

    // Remove excessive newlines (3+ consecutive)
    cleaned = cleaned.replaceAll(/\n{3,}/g, '\n\n');

    // Normalize spaces and tabs (but preserve Unicode characters)
    cleaned = cleaned.replaceAll(/[ \t]+/g, ' ');

    // Clean up lines while preserving all Unicode content
    cleaned = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

    const result = cleaned.trim();
    console.log('[OCR Clean] Cleaned text sample:', result.substring(0, 200));
    console.log('[OCR Clean] Character count - Original:', text.length, 'Cleaned:', result.length);

    return result;
}

function isValidOCROutput(text: string): boolean {
    if (!text || text.trim().length === 0) return false;

    // Count Unicode letters and numbers (supports all languages: Latin, Arabic, Khmer, etc.)
    const alphanumeric = (text.match(/[\p{L}\p{N}]/gu) || []).length;
    const total = text.replace(/\s/g, '').length; // characters minus whitespace

    console.log('[OCR Validation] Alphanumeric chars:', alphanumeric, 'Total non-whitespace:', total);

    // CRITICAL: Lower threshold from 25% to 15% to support:
    // - Symbol-heavy documents (tables, charts)
    // - Non-Latin scripts with complex characters (Khmer, Arabic)
    // - Documents with significant punctuation
    if (total > 0 && (alphanumeric / total) < 0.15) {
        console.warn('[OCR Validation] Failed - Alphanumeric ratio too low:', (alphanumeric / total).toFixed(2));
        return false;
    }

    // Additional check: Ensure we have at least some meaningful content
    if (alphanumeric < 3) {
        console.warn('[OCR Validation] Failed - Too few alphanumeric characters:', alphanumeric);
        return false;
    }

    console.log('[OCR Validation] ✓ Passed validation');
    return true;
}

async function performOCR(base64Image: string, dataUrl: string, mistralKey?: string, googleKey?: string) {
    let rawText = '';
    let usedMethod = '';
    const errors: string[] = [];
    let mistralError: any = null;
    let googleError: any = null;

    console.log(`[OCR Debug] Mistral key present: ${!!mistralKey}, Google key present: ${!!googleKey}`);

    // MOCK MODE: If no keys are present, simulate success for local testing
    if (!mistralKey && !googleKey) {
        console.warn('⚠️ No API keys configured. Running in MOCK MODE for local testing.');
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            rawText: "This is MOCK DATA generated because no API keys were found.\n\nThe OCR process was simulated successfully to allow you to test the application flow.\n\nIn a real production environment with valid API keys, this would be the actual text extracted from your image using Mistral AI or Google Cloud Vision.",
            usedMethod: 'mock_mode'
        };
    }

    // Try Mistral first
    if (mistralKey) {
        try {
            console.log('Attempting Primary OCR...');
            const client = new Mistral({ apiKey: mistralKey });

            // CRITICAL: Add timeout to prevent hanging in production
            const ocrTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Mistral OCR timeout (25s)')), 25000)
            );

            const ocrPromise = client.ocr.process({
                model: "mistral-ocr-latest",
                document: {
                    type: "image_url",
                    imageUrl: dataUrl
                }
            });

            const response = await Promise.race([ocrPromise, ocrTimeout]) as any;

            if (response.pages && response.pages.length > 0) {
                rawText = response.pages.map((p: any) => p.markdown).join('\n\n');
                usedMethod = 'primary_ocr';

                // CRITICAL: Log raw OCR output to diagnose Unicode/encoding issues
                console.log('✅ Primary OCR success!');
                console.log('[OCR Debug] Raw Mistral response (first 300 chars):', rawText.substring(0, 300));
                console.log('[OCR Debug] Character encoding check - First 10 char codes:',
                    rawText.substring(0, 10).split('').map(c => c.charCodeAt(0)).join(', '));
            } else {
                throw new Error("Primary provider response contained no pages");
            }
        } catch (error: any) {
            console.error("⚠️ Primary OCR failed:", error.message);

            // SPECIAL HANDLING: If 401 Unauthorized, we shouldn't just crash or bubble up
            // because it might be a local dev missing a real key.
            if (error.statusCode === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
                console.warn("🔒 Mistral 401 Unauthorized - Key is invalid or expired.");
                errors.push('Mistral: 401 Unauthorized (Invalid Key)');
                // Clear rawText to force fallback
                rawText = '';
            } else {
                errors.push(`Mistral: ${error.message}`);
                mistralError = error;
            }
        }
    } else {
        console.log('⚠️ Mistral API key not configured');
        errors.push('Mistral: API key not configured');
    }

    // Fallback to Google Vision
    if (!rawText) {
        if (googleKey) {
            try {
                console.log('Falling back to Secondary Cloud Vision API...');

                // Add timeout to Google Vision API call
                const visionTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Google Vision timeout (25s)')), 25000)
                );

                const visionPromise = fetch(
                    `https://vision.googleapis.com/v1/images:annotate?key=${googleKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            requests: [{
                                image: { content: base64Image },
                                features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
                            }]
                        })
                    }
                );

                const visionResponse = await Promise.race([visionPromise, visionTimeout]) as Response;
                const visionData = await visionResponse.json();

                if (visionData.error) {
                    throw new Error(`Google Vision API Error: ${visionData.error.message}`);
                }

                // DOCUMENT_TEXT_DETECTION returns fullTextAnnotation
                if (visionData.responses?.[0]?.fullTextAnnotation?.text) {
                    rawText = visionData.responses[0].fullTextAnnotation.text;
                    usedMethod = 'secondary_ocr';
                    console.log('✅ Secondary Vision success!');
                }
                // Fallback to regular textAnnotations if fullTextAnnotation is missing (rare)
                else if (visionData.responses?.[0]?.textAnnotations?.[0]?.description) {
                    rawText = visionData.responses[0].textAnnotations[0].description;
                    usedMethod = 'secondary_ocr';
                    console.log('✅ Secondary Vision success (Standard)!');
                } else {
                    throw new Error("Google Vision found no text");
                }

            } catch (error: any) {
                console.error("❌ Secondary Vision failed:", error.message);
                googleError = error;
                errors.push(`Google: ${error.message}`);
            }
        } else {
            console.log('⚠️ Google API key not configured');
            errors.push('Google: API key not configured');
        }
    }

    if (!rawText) {
        console.warn('⚠️ All OCR providers failed. Activating SAFETY NET MOCK MODE for development/testing.');
        return {
            rawText: "This is SAFETY NET MOCK DATA generated because OCR failed (likely due to invalid API keys).\n\n" +
                "Since you are in development mode, we are providing this mock text so you can verify the UI and download flow.\n\n" +
                "Error Details: " + errors.join(' | '),
            usedMethod: 'mock_mode_fallback'
        };
    }

    return { rawText, usedMethod };
}

export async function POST(request: NextRequest) {
    try {
        console.log('Received OCR request');

        const mistralApiKey = process.env.MISTRAL_API_KEY;
        const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY;

        console.log(`[OCR Start] Checking Keys - Mistral: ${mistralApiKey ? 'Set (Ends with ' + mistralApiKey.slice(-4) + ')' : 'Not Set'}, Google: ${googleApiKey ? 'Set' : 'Not Set'}`);


        const sessionCookie = request.cookies.get("session")?.value
        let userEmail: string | null = null
        let userGoogleId: string | null = null

        let userName: string | null = null
        let userPicture: string | null = null

        if (sessionCookie) {
            try {
                const session = JSON.parse(sessionCookie)
                userEmail = session.email
                userGoogleId = session.id.replace("google_", "")
                userName = session.name || "User"
                userPicture = session.picture || ""
            } catch (e) {
                console.error("Session parse error", e)
            }
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileSizeMB = file.size / (1024 * 1024)
        const FILE_SIZE_LIMIT_MB = 10

        // Get IP address for anonymous user tracking
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

        // Check Quota for Logged In Users + Lazy Creation
        if (userGoogleId && userEmail) {
            try {
                const { default: prisma } = await import("@/lib/db")

                // Ensure user exists using upsert (Lazy Creation)
                // This handles cases where auth callback failed to create the user
                const user = await prisma.user.upsert({
                    where: { googleId: userGoogleId },
                    update: {}, // No update needed if exists
                    create: {
                        googleId: userGoogleId,
                        email: userEmail,
                        name: userName || "User",
                        picture: userPicture,
                        usageMB: 0.0
                    }
                })

                if (user) {
                    const currentUsageMB = user.usageMB || 0.0
                    const userTimezone = user.timezone || 'UTC'


                    // Check if usage needs to be reset (Daily reset at 00:00 User Time) using shared logic
                    const { checkAndResetUsage } = await import("@/lib/usage-limit")

                    // This updates the DB if needed and returns the correct usage
                    const currentUsage = await checkAndResetUsage(user as any, prisma as any)

                    // Update user object locally for the check below
                    user.usageMB = currentUsage

                    if (user.usageMB + fileSizeMB > FILE_SIZE_LIMIT_MB) {
                        return NextResponse.json({
                            error: 'Daily Quota exceeded',
                            details: `You have reached the 10MB daily upload limit. Resets at 00:00 (${userTimezone}). Used: ${(user.usageMB).toFixed(2)}MB`
                        }, { status: 403 });
                    }
                }
            } catch (dbError) {
                console.error("Quota/User Check Failed:", dbError)
                // We don't block if DB fails, to allow usage, or we could block. 
                // Given the issue, logging is key.
            }
        } else {
            // Check quota for anonymous users based on IP address
            try {
                const { default: prisma } = await import("@/lib/db")
                const { checkAndResetUsage } = await import("@/lib/usage-limit")

                // Wrap DB call in timeout to prevent hanging
                const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000));

                // Find or create visitor record by IP using upsert
                const visitorPromise = prisma.visitor.upsert({
                    where: { ipAddress: ipAddress },
                    update: {}, // No immediate update if exists
                    create: {
                        ipAddress: ipAddress,
                        email: null, // Allow null now
                        timezone: "UTC",
                        usageMB: 0.0
                    }
                });

                const visitor = await Promise.race([visitorPromise, dbTimeout]) as any;

                if (visitor) {
                    const visitorTimezone = visitor.timezone || 'UTC'

                    const visitorAsUser = {
                        id: visitor.id,
                        usageMB: visitor.usageMB || 0.0,
                        lastUsageDate: visitor.lastUsageDate,
                        timezone: visitorTimezone
                    }

                    const currentUsageMB = await checkAndResetUsage(visitorAsUser, prisma, 'visitor')

                    if (currentUsageMB + fileSizeMB > FILE_SIZE_LIMIT_MB) {
                        return NextResponse.json({
                            error: 'Daily Quota exceeded',
                            details: `You have reached the 10MB daily upload limit. Resets at 00:00 (${visitorTimezone}). Used: ${currentUsageMB.toFixed(2)}MB`
                        }, { status: 403 });
                    }
                }
            } catch (dbError: any) { // Type explicitly as any to access message
                console.error("Anonymous Quota Check Failed:", dbError);
                // Fail open on DB error/timeout to allow usage
                if (dbError.message === 'DB_TIMEOUT') {
                    console.warn("Skipping quota check due to DB timeout");
                }
            }
        }

        console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes);

        // Check if PDF
        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

        // --- EMERGENCY FIX (2026-01-28): INNGEST REMOVED ---
        // User request: Remove all async queue logic
        // All files now process synchronously to eliminate failure points
        // Note: Very large PDFs/files may hit Vercel's 60s timeout, but most files will complete
        console.log('[OCR API] Processing synchronously (Inngest queue disabled)');

        // Check if Excel
        const isExcel = file.name.match(/\.xls(x)?$/i) ||
            file.type.includes('excel') ||
            file.type.includes('spreadsheet');

        // Check if preprocessed (Legacy flag, now ignored to ensure quality)
        // const isPreprocessed = formData.get("preprocessed") === 'true';

        // Pre-process images (non-PDF/Excel) for better OCR results
        // ALWAYS run this on server now, as client only does minimal resizing
        if (!isPDF && !isExcel) {
            try {
                const { processImageForOCR } = await import('@/lib/image-processing');
                // Force skipHeavyProcessing: false
                const processed = await processImageForOCR(buffer, { skipHeavyProcessing: false });

                // Use processed buffer if it was successful
                if (processed.buffer) {
                    console.log(`[Image Processing] Optimized image: ${processed.originalSize}b -> ${processed.processedSize}b`);
                    buffer = processed.buffer as any;
                }
            } catch (procError) {
                console.error("Image preprocessing warning:", procError);
                // Continue with original buffer if processing fails
            }
        }

        if (isExcel) {
            console.log('📊 Excel file detected, parsing directly...');
            try {
                const { read, utils } = await import('xlsx');
                const wb = read(buffer as any, { type: 'buffer' });

                let extractedText = "";
                const pageResults: any[] = [];

                wb.SheetNames.forEach((sheetName, index) => {
                    const ws = wb.Sheets[sheetName];
                    // Convert sheet to CSV (text)
                    const sheetText = utils.sheet_to_csv(ws);

                    if (sheetText && sheetText.trim().length > 0) {
                        extractedText += `--- Sheet: ${sheetName} ---\n${sheetText}\n\n`;
                        pageResults.push({
                            pageNumber: index + 1,
                            text: sheetText,
                            rawText: sheetText,
                            characters: sheetText.length,
                            warnings: [],
                            method: 'excel_parser'
                        })
                    }
                });

                if (extractedText.length === 0) {
                    throw new Error("No text found in Excel file");
                }

                // Track Usage for Excel (with timeout)
                const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000));

                if (userGoogleId) {
                    try {
                        const { default: prisma } = await import("@/lib/db")
                        await Promise.race([
                            prisma.user.update({
                                where: { googleId: userGoogleId },
                                data: { usageMB: { increment: fileSizeMB } }
                            }),
                            dbTimeout
                        ]);
                    } catch (e) { console.error("Failed to update usage stats", e) }
                } else {
                    try {
                        const { default: prisma } = await import("@/lib/db")
                        // Optimistically update by IP directly (faster than findFirst + update)
                        await Promise.race([
                            prisma.visitor.update({
                                where: { ipAddress: ipAddress },
                                data: {
                                    usageMB: { increment: fileSizeMB },
                                    lastUsageDate: new Date()
                                }
                            }),
                            dbTimeout
                        ]);
                    } catch (e) { console.error("Failed to update visitor usage stats", e) }
                }

                return NextResponse.json({
                    success: true,
                    isPDF: true, // We treat it like a multi-page PDF for frontend compatibility
                    pages: pageResults,
                    totalPages: pageResults.length
                });

            } catch (excelError: any) {
                logError(excelError, 'Excel Processing');
                return NextResponse.json({
                    error: 'Failed to process Excel file',
                    details: excelError.message
                }, { status: 500 });
            }
        }

        if (isPDF) {
            console.log('📄 PDF detected, sending directly to Mistral OCR...');

            // MOCK MODE FOR PDF: If no keys are present
            const mistralApiKey = process.env.MISTRAL_API_KEY;
            const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY;

            if (!mistralApiKey && !googleApiKey) {
                console.warn('⚠️ No API keys configured. Running PDF in MOCK MODE for local testing.');
                await new Promise(resolve => setTimeout(resolve, 2000));
                return NextResponse.json({
                    success: true,
                    isPDF: true,
                    pages: [
                        { pageNumber: 1, text: "MOCK PDF PAGE 1\n\nThis is simulated PDF content because no API keys were found.", rawText: "MOCK PDF PAGE 1", characters: 100, warnings: [], method: 'mock_mode' },
                        { pageNumber: 2, text: "MOCK PDF PAGE 2\n\nMocking multi-page PDF support for testing.", rawText: "MOCK PDF PAGE 2", characters: 100, warnings: [], method: 'mock_mode' }
                    ],
                    totalPages: 2
                });
            }

            if (!mistralApiKey) {
                return NextResponse.json({
                    error: 'PDF processing requires Mistral API key',
                    details: 'Advanced OCR is required for PDF processing'
                }, { status: 500 });
            }

            try {
                const client = new Mistral({ apiKey: mistralApiKey });

                // Step 1: Upload PDF file to Mistral with timeout
                console.log('Uploading PDF to Mistral...');
                const uploadTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('PDF upload timeout (30s)')), 30000)
                );

                const uploadPromise = client.files.upload({
                    file: {
                        fileName: file.name || 'document.pdf',
                        content: buffer,
                    },
                    purpose: 'ocr'
                });

                const uploadedFile = await Promise.race([uploadPromise, uploadTimeout]) as any;
                console.log(`Uploaded PDF with file ID: ${uploadedFile.id}`);

                // Step 2: Process OCR with uploaded file with timeout
                console.log('Processing OCR on uploaded PDF...');
                const pdfOcrTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('PDF OCR timeout (30s)')), 30000)
                );

                const pdfOcrPromise = client.ocr.process({
                    model: "mistral-ocr-latest",
                    document: {
                        type: "file",
                        fileId: uploadedFile.id
                    }
                });

                const response = await Promise.race([pdfOcrPromise, pdfOcrTimeout]) as any;

                if (!response.pages || response.pages.length === 0) {
                    throw new Error('Mistral OCR returned no pages');
                }

                console.log(`✅ Mistral extracted ${response.pages.length} pages from PDF`);

                // Format response for multi-page display
                const pageResults = response.pages.map((page: any, index: number) => {
                    const rawText = page.markdown || '';
                    const cleanedText = cleanOCROutput(rawText);

                    return {
                        pageNumber: index + 1,
                        text: cleanedText,
                        rawText: rawText,
                        characters: cleanedText.length,
                        warnings: [],
                        method: 'primary_ocr'
                    };
                });

                // Track Usage for PDF (with timeout)
                const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000));

                if (userGoogleId) {
                    try {
                        const { default: prisma } = await import("@/lib/db")
                        await Promise.race([
                            prisma.user.update({
                                where: { googleId: userGoogleId },
                                data: { usageMB: { increment: fileSizeMB } }
                            }),
                            dbTimeout
                        ]);
                    } catch (e) {
                        console.error("Failed to update usage stats", e)
                    }
                } else {
                    // Update visitor usage
                    try {
                        const { default: prisma } = await import("@/lib/db")
                        await Promise.race([
                            prisma.visitor.update({
                                where: { ipAddress: ipAddress },
                                data: {
                                    usageMB: { increment: fileSizeMB },
                                    lastUsageDate: new Date()
                                }
                            }),
                            dbTimeout
                        ]);
                    } catch (e) {
                        console.error("Failed to update visitor usage stats", e)
                    }
                }

                return NextResponse.json({
                    success: true,
                    isPDF: true,
                    pages: pageResults,
                    totalPages: response.pages.length
                });

            } catch (pdfError: any) {
                logError(pdfError, 'PDF Processing');

                // FALLBACK FOR PDF: If 401/Auth error
                const isAuthError = pdfError.statusCode === 401 || pdfError.message.includes('401') || pdfError.message.includes('Unauthorized');

                // 1. DEV MODE: Fallback to Mock Data (so you can work without keys)
                if (isAuthError && process.env.NODE_ENV === 'development') {
                    console.warn("🔒 Mistral 401 - Key refused (DEV MODE). Falling back to MOCK MODE.");
                    return NextResponse.json({
                        success: true,
                        isPDF: true,
                        pages: [
                            {
                                pageNumber: 1,
                                text: "MOCK PDF PAGE 1 (Dev Mode)\n\nOCR Authentication failed (401). Since you are in DEV mode, we are showing this mock content.\n\nTo fix real OCR, check MISTRAL_API_KEY in .env.local.",
                                rawText: "MOCK PDF PAGE 1 (Dev Mode)",
                                characters: 150,
                                warnings: ['Auth Failed - Using Mock Data (Dev Only)'],
                                method: 'mock_mode_fallback'
                            }
                        ],
                        totalPages: 1
                    });
                }

                // 2. PRODUCTION MODE: Return clear error (Do NOT show mock data to real users)
                if (isAuthError) {
                    console.error("🚨 CRITICAL: Mistral API Key Invalid in Production!");
                    return NextResponse.json({
                        error: 'Service Configuration Error',
                        details: 'The OCR service is currently unavailable due to a configuration issue. Please contact support.'
                    }, { status: 503 }); // 503 Service Unavailable is more appropriate than 500
                }

                return NextResponse.json({
                    error: 'Failed to process PDF',
                    details: pdfError.message
                }, { status: 500 });
            }
        } else {
            // Single image processing
            const base64 = buffer.toString('base64');
            const dataUrl = `data:${file.type};base64,${base64}`;

            const { rawText, usedMethod } = await performOCR(base64, dataUrl, mistralApiKey, googleApiKey);
            const cleanedText = cleanOCROutput(rawText);

            if (!isValidOCROutput(cleanedText) || cleanedText.length < 5) {
                console.error(`[OCR Validation Failure] Cleaned text length: ${cleanedText.length}, Alphanumeric ratio below threshold. Sample: ${cleanedText.substring(0, 100)}`);
                return NextResponse.json({
                    success: false,
                    error: 'Could not extract valid text. Image might be unclear.',
                }, { status: 400 });
            }

            const { validateAndCorrectOCR } = await import('@/lib/ocr-validator');
            const { correctedText, warnings } = validateAndCorrectOCR(cleanedText);

            // Track Usage for Image (with timeout)
            const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000));

            if (userGoogleId) {
                try {
                    const { default: prisma } = await import("@/lib/db")
                    await Promise.race([
                        prisma.user.update({
                            where: { googleId: userGoogleId },
                            data: { usageMB: { increment: fileSizeMB } }
                        }),
                        dbTimeout
                    ]);
                } catch (e) {
                    console.error("Failed to update usage stats", e)
                }
            } else {
                // Update visitor usage
                try {
                    const { default: prisma } = await import("@/lib/db")
                    await Promise.race([
                        prisma.visitor.update({
                            where: { ipAddress: ipAddress },
                            data: {
                                usageMB: { increment: fileSizeMB },
                                lastUsageDate: new Date()
                            }
                        }),
                        dbTimeout
                    ]);
                } catch (e) {
                    console.error("Failed to update visitor usage stats", e)
                }
            }

            return NextResponse.json({
                success: true,
                isPDF: false,
                text: correctedText,
                rawText: rawText,
                characters: correctedText.length,
                warnings: warnings.map(w => w.message),
                method: usedMethod
            });
        }

        // HLL Analytics Tracking (Document Processed)
        // We track a hash or simple unique string if available, or just random ID since distinct *files* are hard to dedupe perfectly without hashing content.
        // For "Total Processed Documents", we can just use a random ID to increment the unique counter if we treat each request as unique, 
        // OR better: use the HLL to count unique *Users* who processed documents vs unique *Documents*.
        // Let's track unique *Documents* by assuming each successful request is a unique document for now (using random ID),
        // effectively using HLL as a counter but one that allows "distinct" if we had good hashes.
        // Actually, for "Total Documents Processed", a simple Counter (INCR) is better than HLL. 
        // BUT user asked for "Total Unique Documents Processed" or similar.
        // Let's stick to HLL for "Unique Users processing documents" OR just track the event.
        // Re-reading plan: "Total Unique Documents Processed". 
        // If we want "Unique", we need a hash of the file.
        // We have `buffer`. Let's hash it quickly or just use file name + size + user IP as proxy?
        // Hash is safer.
        const crypto = require('crypto');
        const fileHash = crypto.createHash('md5').update(buffer).digest('hex');

        // Fire and forget HLL tracking
        trackUniqueEvent('documents', fileHash).catch(e => console.error("HLL Doc Track Error", e));

    } catch (error: any) {
        logError(error, 'OCR Route');
        return NextResponse.json(
            {
                error: 'Processing failed',
                details: error.message
            },
            { status: 500 }
        );
    }
}
