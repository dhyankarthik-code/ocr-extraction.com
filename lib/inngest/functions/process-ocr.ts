import { inngest } from '../client'
import { Mistral } from '@mistralai/mistralai'

/**
 * Async OCR Processing Function
 * 
 * Handles OCR processing in the background without blocking the API response
 * Supports retries, error handling, and progress tracking
 */
export const processOcrJob = inngest.createFunction(
    {
        id: 'process-ocr',
        name: 'Process OCR Document',
        retries: 3, // Retry up to 3 times on failure
    },
    { event: 'ocr/process.requested' },
    async ({ event, step }) => {
        const { fileBuffer, fileName, fileType, userId, jobId } = event.data

        // Step 1: Validate input
        const validation = await step.run('validate-input', async () => {
            if (!fileBuffer || !fileName) {
                throw new Error('Missing required file data')
            }
            return { valid: true }
        })

        // Step 2: Process OCR
        const ocrResult = await step.run('process-ocr', async () => {
            const mistralApiKey = process.env.MISTRAL_API_KEY
            if (!mistralApiKey) {
                throw new Error('Mistral API key not configured')
            }

            const client = new Mistral({ apiKey: mistralApiKey })

            // Convert base64 buffer back to Buffer
            const buffer = Buffer.from(fileBuffer, 'base64')

            // Check if PDF
            const isPDF = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')

            if (isPDF) {
                // Upload PDF to Mistral
                const uploadedFile = await client.files.upload({
                    file: {
                        fileName: fileName,
                        content: buffer,
                    },
                    purpose: 'ocr'
                })

                // Process OCR
                const response = await client.ocr.process({
                    model: "mistral-ocr-latest",
                    document: {
                        type: "file",
                        fileId: uploadedFile.id
                    }
                })

                return {
                    isPDF: true,
                    pages: response.pages?.map((page: any, index: number) => ({
                        pageNumber: index + 1,
                        text: page.markdown || '',
                        rawText: page.markdown || '',
                        characters: page.markdown?.length || 0,
                        method: 'primary_ocr'
                    })) || [],
                    totalPages: response.pages?.length || 0
                }
            } else {
                // Single image processing
                const base64 = buffer.toString('base64')
                const dataUrl = `data:${fileType};base64,${base64}`

                const response = await client.ocr.process({
                    model: "mistral-ocr-latest",
                    document: {
                        type: "image_url",
                        imageUrl: dataUrl
                    }
                })

                const rawText = response.pages?.map(p => p.markdown).join('\n\n') || ''

                return {
                    isPDF: false,
                    text: rawText,
                    rawText: rawText,
                    characters: rawText.length,
                    method: 'primary_ocr'
                }
            }
        })

        // Step 3: Store result in database
        const stored = await step.run('store-result', async () => {
            const { default: prisma } = await import('@/lib/db')

            // Store OCR result (you'll need to add an OcrJob model to your schema)
            // For now, we'll just return the result
            return {
                jobId,
                status: 'completed',
                result: ocrResult
            }
        })

        // Step 4: Send notification (optional)
        if (userId) {
            await step.run('send-notification', async () => {
                // Send email or push notification to user
                console.log(`OCR job ${jobId} completed for user ${userId}`)
                return { notified: true }
            })
        }

        return {
            success: true,
            jobId,
            result: ocrResult
        }
    }
)
