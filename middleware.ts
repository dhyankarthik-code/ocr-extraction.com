import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// Distributed Rate Limiting with Upstash Redis
// ============================================
import { apiRateLimiter, ocrRateLimiter, toolRateLimiter, authRateLimiter, statusRateLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * Check rate limit using Upstash distributed limiter
 * Shared across all Vercel serverless instances
 */
async function checkDistributedRateLimit(
    request: NextRequest,
    limiter: any
): Promise<{ allowed: boolean; remaining: number; resetIn: number; limit: number }> {
    const ip = getClientIp(request.headers)
    const path = request.nextUrl.pathname
    const identifier = `${ip}:${path}`

    try {
        const { success, limit, remaining, reset } = await limiter.limit(identifier)
        const resetIn = Math.max(0, reset - Date.now())

        return {
            allowed: success,
            remaining,
            resetIn,
            limit
        }
    } catch (error) {
        console.error('[Rate Limit] Upstash error, allowing request:', error)
        // Fail open on Redis errors to prevent blocking legitimate traffic
        return { allowed: true, remaining: 10, resetIn: 60000, limit: 10 }
    }
}


// ============================================
// Middleware Function
// ============================================
export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const pathname = request.nextUrl.pathname

    // ============================================
    // 1. Bill Splitter Subdomain Routing
    // ============================================
    const isBillsSubdomain = hostname === 'bills.ocr-extraction.com' ||
        hostname === 'bills.localhost:3000' ||
        hostname.startsWith('bills.')

    if (isBillsSubdomain) {
        // Rewrite to /bill-splitter routes
        const url = request.nextUrl.clone()

        // Don't rewrite if already on bill-splitter path
        if (!pathname.startsWith('/bill-splitter') && !pathname.startsWith('/api/bill')) {
            url.pathname = `/bill-splitter${pathname === '/' ? '' : pathname}`
            return NextResponse.rewrite(url)
        }
    }

    // ============================================
    // 2. Rate Limiting for API Routes
    // ============================================
    const isApiRoute = pathname.startsWith('/api/')
    const isOcrRoute = pathname.startsWith('/api/ocr')
    const isStatusCheck = pathname.startsWith('/api/ocr/status')
    const isAuthRoute = pathname.startsWith('/api/auth/')
    const isToolRoute = pathname.match(/\/api\/(upload|download|result)/)

    if (isApiRoute) {
        // Select appropriate rate limiter based on route
        let limiter = apiRateLimiter

        if (isStatusCheck) {
            limiter = statusRateLimiter
        } else if (isOcrRoute) {
            limiter = ocrRateLimiter
        } else if (isAuthRoute) {
            limiter = authRateLimiter
        } else if (isToolRoute) {
            limiter = toolRateLimiter
        }

        const { allowed, remaining, resetIn, limit } = await checkDistributedRateLimit(request, limiter)

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Too many requests',
                    message: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)} seconds.`,
                    retryAfter: Math.ceil(resetIn / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
                        'Retry-After': Math.ceil(resetIn / 1000).toString(),
                    }
                }
            )
        }

        // Add rate limit headers to response
        const response = NextResponse.next()
        response.headers.set('X-RateLimit-Limit', limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString())
        return response
    }

    // ============================================
    // 3. Pass Through
    // ============================================
    // Domain redirects now handled by vercel.json
    return NextResponse.next()
}

export const config = {
    // Match all request paths except for:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - googled9dde47a61914ba1.html (Google verification)
    // Note: API routes are now INCLUDED for rate limiting
    matcher: ['/((?!_next/static|_next/image|favicon.ico|googled9dde47a61914ba1.html).*)'],
}
