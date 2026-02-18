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
    const cspHeader = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdn-in.pagesense.io https://googleads.g.doubleclick.net https://*.doubleclick.net",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' blob: data: https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google.com https://*.google.co.in https://*.doubleclick.net https://*.googleadservices.com https://lh3.googleusercontent.com https://ui-avatars.com https://api.dicebear.com https://flagcdn.com https://pagead2.googlesyndication.com",
        "font-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.doubleclick.net https://*.google.com https://*.google.co.in https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.upstash.io https://api.inngest.com https://*.inngest.com https://pagead2.googlesyndication.com",
        "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://www.googletagmanager.com",
        "upgrade-insecure-requests",
    ].join('; ')

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
    // 3. Security Headers
    // ============================================
    const response = NextResponse.next()

    response.headers.set('content-security-policy', cspHeader)
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.headers.set('Permissions-Policy', 'camera=self, microphone=(), geolocation=(self)')

    return response
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
