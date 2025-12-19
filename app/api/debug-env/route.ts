import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        env_check: {
            NODE_ENV: process.env.NODE_ENV,
            MISTRAL_CONFIGURED: !!process.env.MISTRAL_API_KEY,
            GOOGLE_CONFIGURED: !!process.env.GOOGLE_CLOUD_API_KEY,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            // Don't return actual keys for security
        },
        timestamp: new Date().toISOString()
    });
}
