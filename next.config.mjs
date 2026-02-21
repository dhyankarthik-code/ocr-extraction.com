/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build-time env injection - bypasses Hostinger's runtime env limitation
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // Image optimization enabled for performance (Vercel handles this)
  },
  trailingSlash: false,
  async headers() {
    return [
      // ── Allow AI crawlers to access llms.txt, robots.txt, sitemap.xml freely ──
      {
        source: '/llms.txt',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
          { key: 'X-Robots-Tag', value: 'all' },
        ]
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ]
      },
      // ── Security headers for all other routes ──
      {
        source: '/((?!llms\\.txt|robots\\.txt|sitemap\\.xml).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // CSP - Relaxed for Google Analytics/GTM/Vercel/DoubleClick/Tawk.to
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: GTM, GA, reCAPTCHA, Vercel, Tawk.to
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdn-in.pagesense.io https://googleads.g.doubleclick.net https://*.doubleclick.net https://embed.tawk.to https://*.tawk.to",
              // Styles
              "style-src 'self' 'unsafe-inline' https://embed.tawk.to https://*.tawk.to",
              // Images: All Google domains including DoubleClick for GA4, Tawk.to agents
              "img-src 'self' blob: data: https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google.com https://*.google.co.in https://*.doubleclick.net https://*.googleadservices.com https://lh3.googleusercontent.com https://ui-avatars.com https://api.dicebear.com https://flagcdn.com https://pagead2.googlesyndication.com https://*.tawk.to",
              // Fonts
              "font-src 'self' data:",
              // Connect: Critical - includes stats.g.doubleclick.net, analytics endpoints, Upstash Redis, Inngest, Tawk.to (including WebSockets)
              "connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.doubleclick.net https://*.google.com https://*.google.co.in https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.upstash.io https://api.inngest.com https://*.inngest.com https://pagead2.googlesyndication.com https://*.tawk.to wss://*.tawk.to",
              // Frames: reCAPTCHA, Tawk.to
              "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://www.googletagmanager.com https://*.tawk.to https://tawk.to"
            ].join('; ')
          },
          // Anti-Indexing for Vercel Preview/Dev environments
          ...(process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? [{
            key: 'X-Robots-Tag',
            value: 'noindex'
          }] : [])
        ]
      }
    ]
  },

}

export default nextConfig
