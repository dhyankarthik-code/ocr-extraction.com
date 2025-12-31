import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// Rate Limiting Configuration
// ============================================
const RATE_LIMIT_REQUESTS = 10 // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window

// In-memory rate limit store (resets on deployment)
// For production, consider Upstash Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
    // Get IP from various headers
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous'

    // Include path for endpoint-specific limits
    const path = request.nextUrl.pathname
    return `${ip}:${path}`
}

function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetIn: number } {
    const key = getRateLimitKey(request)
    const now = Date.now()

    const record = rateLimitStore.get(key)

    // No record or expired window - allow and create new record
    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
        return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS }
    }

    // Within window - check count
    if (record.count >= RATE_LIMIT_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: record.resetTime - now
        }
    }

    // Increment and allow
    record.count++
    return {
        allowed: true,
        remaining: RATE_LIMIT_REQUESTS - record.count,
        resetIn: record.resetTime - now
    }
}

// Cleanup old entries periodically (prevent memory leak)
setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60 * 1000) // Cleanup every minute

// ============================================
// Middleware Function
// ============================================
export function middleware(request: NextRequest) {
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
    const isProtectedRoute = pathname.startsWith('/api/bill/') ||
        pathname.startsWith('/api/ocr')

    if (isApiRoute && isProtectedRoute) {
        const { allowed, remaining, resetIn } = checkRateLimit(request)

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
                        'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
                        'Retry-After': Math.ceil(resetIn / 1000).toString(),
                    }
                }
            )
        }

        // Add rate limit headers to response
        const response = NextResponse.next()
        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_REQUESTS.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString())
        return response
    }

    // ============================================
    // 3. Domain Redirect (Existing Logic)
    // ============================================
    const isVercelProd = hostname === 'free-ocr-app.vercel.app' || hostname === 'freeocnpp.vercelapp'
    const isRootDomain = hostname === 'ocr-extraction.com'

    if (
        process.env.NODE_ENV === 'production' &&
        (isVercelProd || isRootDomain)
    ) {
        const url = request.nextUrl.clone()
        url.hostname = 'www.ocr-extraction.com'
        url.protocol = 'https'
        url.port = ''

        return NextResponse.redirect(url, 301)
    }

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
