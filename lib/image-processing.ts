import sharp from 'sharp';

export interface ProcessedImageResult {
    buffer: Buffer;
    info: sharp.OutputInfo;
    originalSize: number;
    processedSize: number;
}

/**
 * Pre-processes an image for optimized OCR extraction.
 * Applies:
 * 1. Rotation (EXIF auto-orient)
 * 2. Smart Resizing (Preserve legibility for long receipts vs standard docs)
 * 3. Grayscale (Remove color noise)
 * 4. Normalization (Contrast enhancement)
 * 5. Sharpening (Edge enhancement)
 */
// Options interface
export interface ProcessOptions {
    skipHeavyProcessing?: boolean;
}

export async function processImageForOCR(inputBuffer: Buffer, options: ProcessOptions = {}): Promise<ProcessedImageResult> {
    // EXPONENTIAL SPEEDUP: If client already processed it, skip Sharp entirely!
    if (options.skipHeavyProcessing) {
        return {
            buffer: inputBuffer,
            info: { size: inputBuffer.length } as any,
            originalSize: inputBuffer.length,
            processedSize: inputBuffer.length
        };
    }

    try {
        const image = sharp(inputBuffer);
        const metadata = await image.metadata();

        // 1. Auto-orient based on EXIF (crucial for mobile photos taken in portrait)
        let pipeline = image.rotate();

        // 2. Resize Logic (Smart handling for long receipts)
        // Receipts are often long strips. Resizing by "max dimension" (fit: inside) to 2500px 
        // can crush the width to <400px, making text unreadable.

        const width = metadata.width || 0;
        const height = metadata.height || 0;

        if (width > 0 && height > 0) {
            const aspectRatio = height / width;

            // If it's a long receipt (Height > 2.5x Width)
            if (aspectRatio > 2.5) {
                // Ensure width is sufficient for OCR (target ~1200px minimal for clarity)
                // But don't upscale if it's already small-ish but sufficient (e.g. 800px)
                const TARGET_WIDTH = 1500;

                if (width > TARGET_WIDTH) {
                    pipeline = pipeline.resize({ width: TARGET_WIDTH });
                } else if (width < 800) {
                    // Upscale if too narrow (normalization)
                    pipeline = pipeline.resize({ width: 1000 });
                }
                // We do NOT limit height aggressively here to avoid crushing text density
            } else {
                // Standard document/photo
                const MAX_DIMENSION = 2500;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    pipeline = pipeline.resize({
                        width: width > height ? MAX_DIMENSION : undefined,
                        height: height > width ? MAX_DIMENSION : undefined,
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                } else if (width < 600 && width < height) {
                    // Upscale small thumbnails
                    pipeline = pipeline.resize({ width: width * 2, withoutEnlargement: false });
                }
            }
        }

        // 3. Grayscale - "removes background noise (like table surface)"
        pipeline = pipeline.grayscale();

        // 4. Normalize - "making the characters pop" (Contrast stretching)
        pipeline = pipeline.normalize();

        // 5. Sharpen - "sharpen the edges of the letters"
        pipeline = pipeline.sharpen({
            sigma: 1.0, // Mild sharpening
            m1: 0,
            m2: 0,
            x1: 0,
            y2: 0,
            y3: 0,
        });

        // 6. Contrast Boost (Soft Thresholding)
        // Instead of binary threshold which loses info, we boost contrast
        pipeline = pipeline.linear(1.2, -20);

        // Output as JPEG for reasonable size/quality balance
        const processedBuffer = await pipeline
            .toFormat('jpeg', { quality: 90 })
            .toBuffer({ resolveWithObject: true });

        return {
            buffer: processedBuffer.data,
            info: processedBuffer.info,
            originalSize: inputBuffer.length,
            processedSize: processedBuffer.data.length
        };

    } catch (error) {
        console.error("Image processing failed:", error);
        // Fallback: return original if processing fails
        return {
            buffer: inputBuffer,
            info: { size: inputBuffer.length } as any,
            originalSize: inputBuffer.length,
            processedSize: inputBuffer.length
        };
    }
}
