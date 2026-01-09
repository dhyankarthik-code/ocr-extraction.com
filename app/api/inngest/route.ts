import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { processOcrJob } from '@/lib/inngest/functions/process-ocr'

/**
 * Inngest API Route Handler
 * 
 * This endpoint serves as the webhook for Inngest to trigger functions
 * Handles GET, POST, and PUT requests from Inngest platform
 */
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        processOcrJob,
        // Add more functions here as needed
    ],
    signingKey: process.env.INNGEST_SIGNING_KEY,
})
