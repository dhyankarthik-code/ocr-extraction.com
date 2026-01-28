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

        // Rate limiting is now handled globally by middleware.ts (using IP + Path)
        // This avoids double-counting and prevents "Shared WiFi" IP blocking
        // by allowing granular limits per job status URL.

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

        // BULLETPROOF FIX: Stale job detection
        // If a job has been in 'processing' for more than 90 seconds, assume it's stuck
        const STALE_THRESHOLD_MS = 90000; // 90 seconds
        if (job.status === 'processing' && job.updatedAt) {
            const jobAge = Date.now() - job.updatedAt;
            if (jobAge > STALE_THRESHOLD_MS) {
                console.warn(`[Job Status] Stale job detected: ${jobId} (age: ${jobAge}ms)`);
                return NextResponse.json({
                    jobId,
                    status: 'failed',
                    error: 'Processing timed out. The job may have encountered an issue. Please try again.',
                    stale: true
                });
            }
        }

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
