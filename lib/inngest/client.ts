import { Inngest } from 'inngest'

/**
 * Inngest client for async job processing
 * 
 * Free tier: 100K runs/month, 25 concurrent steps
 * Perfect for OCR processing, email sending, and background tasks
 * 
 * Setup:
 * 1. Create account at https://inngest.com
 * 2. Create a new app
 * 3. Copy Event Key and Signing Key to .env
 */

export const inngest = new Inngest({
    id: 'ocr-extraction',
    name: 'OCR Extraction Platform',
    eventKey: process.env.INNGEST_EVENT_KEY,
})
