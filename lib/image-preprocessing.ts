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

                // Optimized Dimensions for Mobile (1600px is usually plenty for OCR)
                const MAX_DIMENSION = 1600;
                if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
                    const ratio = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height);
                    canvas.width = Math.round(img.width * ratio);
                    canvas.height = Math.round(img.height * ratio);
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                // Apply EXIF orientation correction
                if (autoRotate && orientation !== 1) {
                    applyExifOrientation(ctx, canvas, img, orientation);
                }

                // --- HARDWARE ACCELERATED FILTERS (Fast Path) ---
                let filterString = '';
                if (grayscale) filterString += 'grayscale(100%) ';
                if (enhanceContrast) filterString += 'contrast(1.4) brightness(1.1) ';
                if (reduceNoise) filterString += 'blur(0.2px) ';

                if (filterString) {
                    ctx.filter = filterString.trim();
                }

                // Draw image with filters applied (Fast!)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Reset filter for subsequent operations
                ctx.filter = 'none';

                // --- SHARPEN (Optional & Optimized) ---
                if (sharpen) {
                    // Only apply sharpening if image is not too large or on faster devices
                    // For mobile, we might want to skip or use a very fast pass
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const sharpened = applyDocumentSharpen(imageData);
                    ctx.putImageData(sharpened, 0, 0);
                }

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
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

/**
 * Apply document-optimized sharpening filter
 */
function applyDocumentSharpen(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);

    // Stronger sharpening kernel for document text
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                    r += data[idx] * weight;
                }
            }

            const outIdx = (y * width + x) * 4;
            const val = Math.max(0, Math.min(255, r));
            output.data[outIdx] = val;
            output.data[outIdx + 1] = val;
            output.data[outIdx + 2] = val;
            output.data[outIdx + 3] = 255; // Full alpha
        }
    }

    // Copy edge pixels
    for (let x = 0; x < width; x++) {
        // Top row
        const topIdx = x * 4;
        output.data[topIdx] = data[topIdx];
        output.data[topIdx + 1] = data[topIdx + 1];
        output.data[topIdx + 2] = data[topIdx + 2];
        output.data[topIdx + 3] = 255;

        // Bottom row
        const bottomIdx = ((height - 1) * width + x) * 4;
        output.data[bottomIdx] = data[bottomIdx];
        output.data[bottomIdx + 1] = data[bottomIdx + 1];
        output.data[bottomIdx + 2] = data[bottomIdx + 2];
        output.data[bottomIdx + 3] = 255;
    }

    for (let y = 0; y < height; y++) {
        // Left column
        const leftIdx = y * width * 4;
        output.data[leftIdx] = data[leftIdx];
        output.data[leftIdx + 1] = data[leftIdx + 1];
        output.data[leftIdx + 2] = data[leftIdx + 2];
        output.data[leftIdx + 3] = 255;

        // Right column
        const rightIdx = (y * width + width - 1) * 4;
        output.data[rightIdx] = data[rightIdx];
        output.data[rightIdx + 1] = data[rightIdx + 1];
        output.data[rightIdx + 2] = data[rightIdx + 2];
        output.data[rightIdx + 3] = 255;
    }

    return output;
}

/**
 * Quick preprocessing with default settings optimized for documents
 */
export async function quickPreprocess(file: File): Promise<Blob> {
    return preprocessImageForOCR(file, {
        grayscale: true,
        enhanceContrast: true,
        reduceNoise: true,
        sharpen: true,
        autoRotate: true,
        quality: 0.8,
    });
}
