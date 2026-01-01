/**
 * Image preprocessing utilities for OCR accuracy improvement
 * Features: grayscale, contrast, noise reduction, sharpening, auto-rotation
 */

export interface PreprocessingOptions {
    grayscale?: boolean;
    enhanceContrast?: boolean;
    reduceNoise?: boolean;
    sharpen?: boolean;
    autoRotate?: boolean;
    quality?: number; // 0.1 to 1.0
}

/**
 * Read EXIF orientation from image file
 */
async function getExifOrientation(file: File): Promise<number> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const view = new DataView(e.target?.result as ArrayBuffer);

            // Check for JPEG magic number
            if (view.getUint16(0, false) !== 0xFFD8) {
                resolve(1);
                return;
            }

            let offset = 2;
            while (offset < view.byteLength) {
                if (view.getUint16(offset, false) === 0xFFE1) { // APP1 marker
                    const exifOffset = offset + 4;

                    // Check for EXIF header
                    if (view.getUint32(exifOffset, false) !== 0x45786966) {
                        resolve(1);
                        return;
                    }

                    const tiffOffset = exifOffset + 6;
                    const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;

                    const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
                    const numEntries = view.getUint16(tiffOffset + ifdOffset, littleEndian);

                    for (let i = 0; i < numEntries; i++) {
                        const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
                        if (view.getUint16(entryOffset, littleEndian) === 0x0112) { // Orientation tag
                            resolve(view.getUint16(entryOffset + 8, littleEndian));
                            return;
                        }
                    }
                    resolve(1);
                    return;
                }
                offset += 2 + view.getUint16(offset + 2, false);
            }
            resolve(1);
        };
        reader.onerror = () => resolve(1);
        reader.readAsArrayBuffer(file.slice(0, 65536)); // Read first 64KB for EXIF
    });
}

/**
 * Apply EXIF orientation correction to canvas
 */
function applyExifOrientation(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    orientation: number
): void {
    const { width, height } = img;

    switch (orientation) {
        case 2: // Horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
        case 3: // 180° rotation
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
        case 4: // Vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
        case 5: // 90° CW + horizontal flip
            canvas.width = height;
            canvas.height = width;
            ctx.translate(height, 0);
            ctx.rotate(Math.PI / 2);
            ctx.scale(-1, 1);
            break;
        case 6: // 90° CCW (most common for phone photos)
            canvas.width = height;
            canvas.height = width;
            ctx.translate(height, 0);
            ctx.rotate(Math.PI / 2);
            break;
        case 7: // 90° CCW + horizontal flip
            canvas.width = height;
            canvas.height = width;
            ctx.translate(0, width);
            ctx.rotate(-Math.PI / 2);
            ctx.scale(-1, 1);
            break;
        case 8: // 90° CW
            canvas.width = height;
            canvas.height = width;
            ctx.translate(0, width);
            ctx.rotate(-Math.PI / 2);
            break;
        default:
            // Normal orientation (1) or unknown
            break;
    }
}

/**
 * Preprocess image for better OCR results
 */
export async function preprocessImageForOCR(
    file: File,
    options: PreprocessingOptions = {}
): Promise<Blob> {
    const {
        grayscale = true,
        enhanceContrast = true,
        reduceNoise = true,
        sharpen = true,
        autoRotate = true,
        quality = 0.95,
    } = options;

    // Get EXIF orientation first
    const orientation = autoRotate ? await getExifOrientation(file) : 1;
    console.log('Image EXIF orientation:', orientation);

    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            try {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Optimized Dimensions for Mobile (1900px: High detail for OCR, but significantly lighter for Mobile GPUs)
                const MAX_DIMENSION = 1900;
                let targetWidth = img.width;
                let targetHeight = img.height;

                if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
                    const ratio = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height);
                    targetWidth = Math.round(img.width * ratio);
                    targetHeight = Math.round(img.height * ratio);
                }

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                // Apply EXIF orientation correction
                if (autoRotate && orientation !== 1) {
                    applyExifOrientation(ctx, canvas, img, orientation);
                }

                const isSVG = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

                // --- HARDWARE ACCELERATED FILTERS ---
                let filterString = '';

                // SVGs are usually clean, we can skip heavy filtering unless explicitly requested or if we want grayscale
                if (grayscale) filterString += 'grayscale(100%) ';

                // Only apply contrast boost to raster images, SVGs usually don't need it
                if (enhanceContrast && !isSVG) {
                    filterString += 'contrast(1.15) brightness(1.02) ';
                }

                if (filterString) {
                    ctx.filter = filterString.trim();
                }

                // Draw image with filters applied (Fast!)
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                // Reset filter
                ctx.filter = 'none';

                const startTime = performance.now();
                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        const endTime = performance.now();
                        console.log(`[Preprocessing] Optimization took ${(endTime - startTime).toFixed(2)}ms. Result size: ${(blob?.size || 0) / 1024}KB`);
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert canvas to blob'));
                        }
                    },
                    'image/jpeg', // Always use JPEG for better compression
                    quality
                );
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

// Helper removed as we no longer use the slow JS sharpening loop
// function applyDocumentSharpen(...) {} 

/**
 * Quick preprocessing with default settings optimized for documents
 */
export async function quickPreprocess(file: File): Promise<Blob> {
    return preprocessImageForOCR(file, {
        grayscale: true,
        enhanceContrast: true,
        reduceNoise: false, // Disabled for speed
        sharpen: false,    // Disabled for speed
        autoRotate: true,
        quality: 0.7,      // Slightly higher compression for faster upload
    });
}
