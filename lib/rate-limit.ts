import { Ratelimit } from '@upstash/ratelimit'
import redis from './redis'

/**
 * Distributed rate limiter using Upstash Redis
 * 
 * Replaces in-memory Map with globally distributed sliding window algorithm
 * Shared across all Vercel serverless instances
 * 
 * Algorithms:
 * - slidingWindow: Most accurate, prevents burst attacks
 * - fixedWindow: Simpler, allows bursts at window boundaries
 * - tokenBucket: Allows controlled bursts
 */

// Rate limiter for API routes (OCR, tools, etc.)
// Rate limiter for API routes (OCR, tools, etc.)
export const apiRateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
}) : null

// Rate limiter for heavy operations (OCR processing)
export const ocrRateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 OCR requests per minute
    analytics: true,
    prefix: 'ratelimit:ocr',
}) : null

// Rate limiter for tool conversions (image-to-pdf, etc.)
export const toolRateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 tool requests per minute
    analytics: true,
    prefix: 'ratelimit:tools',
}) : null

// Rate limiter for authentication endpoints
export const authRateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // Relaxed for session polling
    analytics: true,
    prefix: 'ratelimit:auth',
}) : null

// Rate limiter for status polling endpoints (OCR job status checks)
// CRITICAL: Must be very lenient to support aggressive client-side polling during OCR processing
export const statusRateLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute for status checks
    analytics: true,
    prefix: 'ratelimit:status',
}) : null

/**
 * Helper to get IP address from request
 */
export function getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for')
    const realIp = headers.get('x-real-ip')
    return forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous'
}

/**
 * Helper to check rate limit and return standardized response
 */
export async function checkRateLimit(
    limiter: Ratelimit,
    identifier: string
): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
}> {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
        success,
        limit,
        remaining,
        reset,
    }
}
