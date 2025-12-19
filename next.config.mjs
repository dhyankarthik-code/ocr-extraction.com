/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build-time env injection - bypasses Hostinger's runtime env limitation
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'ocr-extraction.com',
          },
        ],
        destination: 'https://www.ocr-extraction.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
