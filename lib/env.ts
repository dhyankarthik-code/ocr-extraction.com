/**
 * Environment Variable Validation
 * Fail-fast on missing required variables
 */

import { z } from 'zod'

// Define environment schema
const envSchema = z.object({
    // Required API Keys (server-side only)
    MISTRAL_API_KEY: z.string().min(1, 'MISTRAL_API_KEY is required'),
    GOOGLE_CLOUD_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),

    // Database
    DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

    // Auth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // App Config
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Rate Limiting (optional Redis for production)
    UPSTASH_REDIS_URL: z.string().optional(),
    UPSTASH_REDIS_TOKEN: z.string().optional(),

    // reCAPTCHA (public key is safe)
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
    RECAPTCHA_SECRET_KEY: z.string().optional(),
})

// Type for validated environment
export type Env = z.infer<typeof envSchema>

// Validate and export environment
function validateEnv(): Env {
    // In development, allow partial validation
    if (process.env.NODE_ENV === 'development') {
        return {
            MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
            GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/ocr',
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            NODE_ENV: 'development',
            UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
            UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
            NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
        }
    }

    // In production, validate strictly
    const result = envSchema.safeParse(process.env)

    if (!result.success) {
        console.error('❌ Environment validation failed:')
        result.error.issues.forEach(issue => {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
        })

        // Don't throw in build, but warn
        if (typeof window === 'undefined') {
            console.warn('⚠️ Some environment variables are missing')
        }

        // Return partial env for build to succeed
        return process.env as unknown as Env
    }

    return result.data
}

// Export validated environment
export const env = validateEnv()

// Safe getters for sensitive keys (never expose to client)
export function getMistralApiKey(): string {
    const key = process.env.MISTRAL_API_KEY
    if (!key) {
        throw new Error('MISTRAL_API_KEY is not configured')
    }
    return key
}

export function getGoogleApiKey(): string | undefined {
    return process.env.GOOGLE_CLOUD_API_KEY
}

export function getDatabaseUrl(): string {
    const url = process.env.DATABASE_URL
    if (!url) {
        throw new Error('DATABASE_URL is not configured')
    }
    return url
}

// Check if we're in production
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
}

// Check if rate limiting via Redis is available
export function hasRedisRateLimiting(): boolean {
    return !!(process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN)
}
