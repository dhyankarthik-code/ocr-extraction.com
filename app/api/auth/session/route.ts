import { type NextRequest, NextResponse } from "next/server"
import { authRateLimiter, getClientIp } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  // Apply rate limiting (100 requests per minute)
  // Fail-open: If rate limiting fails (e.g. Redis down), allow the request
  let limit = 100
  let remaining = 99
  let reset = Date.now() + 60000

  // 1. Skip if Redis is not configured (Dev mode)
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const ip = getClientIp(request.headers)
      // Only run rate limit if we have the limiter and IP
      if (authRateLimiter && ip) {
        const result = await authRateLimiter.limit(ip)

        if (!result.success) {
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': result.limit.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': result.reset.toString(),
                'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
              },
            }
          )
        }

        limit = result.limit
        remaining = result.remaining
        reset = result.reset
      }
    } catch (error) {
      console.warn("Rate limit check failed (fail-open):", error)
    }
  }

  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie?.value) {
    return NextResponse.json(null, {
      headers: {
        'Cache-Control': 'private, max-age=10',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json(session, {
      headers: {
        'Cache-Control': 'private, max-age=10',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  } catch (error) {
    return NextResponse.json(null, {
      headers: {
        'Cache-Control': 'private, max-age=10',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  }
}
