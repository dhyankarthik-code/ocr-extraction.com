import { NextRequest, NextResponse } from 'next/server'

/**
 * Job Status Endpoint
 * 
 * GET /api/ocr/status/[jobId]
 * Returns the current status of an async OCR job
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ jobId: string }> }
) {
    try {
        const params = await props.params;
        const { jobId } = params

        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            )
        }

        // Apply lenient rate limiting for status checks
        const { statusRateLimiter, getClientIp } = await import('@/lib/rate-limit')

        if (statusRateLimiter) {
            const ip = getClientIp(request.headers)
            const { success, limit, remaining } = await statusRateLimiter.limit(ip)

            if (!success) {
                return NextResponse.json(
                    {
                        error: 'Too many status checks',
                        limit,
                        remaining,
                        retryAfter: 60 // seconds
                    },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': '60',
                            'X-RateLimit-Limit': limit.toString(),
                            'X-RateLimit-Remaining': remaining.toString()
                        }
                    }
                )
            }
        }

        const { default: redis } = await import('@/lib/redis')

        if (!redis) {
            return NextResponse.json(
                { error: 'Redis not configured for status checks' },
                { status: 503 }
            )
        }

        // Fetch job status from Redis
        const jobData = await redis.get(`job:${jobId}`) as any;

        if (!jobData) {
            // If job ID is valid format (nanoid) but not in Redis, it might be:
            // 1. Not started yet (queue lag)
            // 2. Expired
            // 3. Invalid
            return NextResponse.json({
                jobId,
                status: 'pending', // Assume pending if recently queued
                message: 'Job waiting to start or not found',
            })
        }

        // If stored as string, parse it (Redis usually returns object if using Upstash SDK with JSON, but safer to check)
        const job = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;

        return NextResponse.json({
            jobId,
            status: job.status || 'unknown',
            result: job.result || null,
            updatedAt: job.updatedAt
        })

    } catch (error: any) {
        console.error('[Job Status] Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch job status', details: error.message },
            { status: 500 }
        )
    }
}
