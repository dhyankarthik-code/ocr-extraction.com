/**
 * Image preprocessing utilities for OCR accuracy improvement
 * Based on research: grayscale, contrast, noise reduction, sharpening
 */

export interface PreprocessingOptions {
    grayscale?: boolean;
    enhanceContrast?: boolean;
    reduceNoise?: boolean;
    sharpen?: boolean;
    quality?: number; // 0.1 to 1.0
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
        quality = 0.95,
    } = options;

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

                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Get image data
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // 1. Convert to Grayscale
                if (grayscale) {
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = avg;     // R
                        data[i + 1] = avg; // G
                        data[i + 2] = avg; // B
                    }
                }

                // 2. Enhance Contrast (histogram stretching)
                if (enhanceContrast) {
                    let min = 255, max = 0;

                    // Find min and max values
                    for (let i = 0; i < data.length; i += 4) {
                        const val = data[i];
                        if (val < min) min = val;
                        if (val > max) max = val;
                    }

                    // Stretch contrast
                    const range = max - min;
                    if (range > 0) {
                        for (let i = 0; i < data.length; i += 4) {
                            const stretched = ((data[i] - min) / range) * 255;
                            data[i] = stretched;
                            data[i + 1] = stretched;
                            data[i + 2] = stretched;
                        }
                    }
                }

                // Put processed data back
                ctx.putImageData(imageData, 0, 0);

                // 3. Noise Reduction (simple median-like blur)
                if (reduceNoise) {
                    ctx.filter = 'blur(0.5px)';
                    ctx.drawImage(canvas, 0, 0);
                    ctx.filter = 'none';
                }

                // 4. Sharpen
                if (sharpen) {
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const sharpened = applySharpen(imageData);
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
                    file.type || 'image/png',
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
 * Apply sharpening filter using convolution matrix
 */
function applySharpen(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);

    // Sharpening kernel
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];

                    r += data[idx] * weight;
                    g += data[idx + 1] * weight;
                    b += data[idx + 2] * weight;
                }
            }

            const outIdx = (y * width + x) * 4;
            output.data[outIdx] = Math.max(0, Math.min(255, r));
            output.data[outIdx + 1] = Math.max(0, Math.min(255, g));
            output.data[outIdx + 2] = Math.max(0, Math.min(255, b));
            output.data[outIdx + 3] = data[outIdx + 3]; // Alpha
        }
    }

    return output;
}

/**
 * Quick preprocessing with default settings
 */
export async function quickPreprocess(file: File): Promise<Blob> {
    return preprocessImageForOCR(file, {
        grayscale: true,
        enhanceContrast: true,
        reduceNoise: true,
        sharpen: true,
        quality: 0.95,
    });
}
