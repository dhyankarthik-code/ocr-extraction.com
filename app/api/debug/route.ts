import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const secret = process.env.NEXTAUTH_SECRET;

    return NextResponse.json({
        googleClientId: clientId ? `${clientId.substring(0, 5)}...${clientId.substring(clientId.length - 5)}` : 'MISSING/UNDEFINED',
        googleClientIdLength: clientId ? clientId.length : 0,
        nextAuthUrl: nextAuthUrl || 'MISSING/UNDEFINED',
        nextAuthSecretSet: !!secret,
        timestamp: new Date().toISOString(),
    });
}
