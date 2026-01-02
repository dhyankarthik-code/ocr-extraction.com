import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { path, referrer } = body;

        // 1. Get IP and Location
        const forwardedFor = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

        const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
        const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
        const region = req.headers.get('x-vercel-ip-country-region') || 'Unknown';

        // 2. Parse User Agent
        const userAgentString = req.headers.get('user-agent') || '';
        // Optional: Parse detailed device info if needed, or just store string
        // const parser = new UAParser(userAgentString);
        // const device = parser.getDevice();

        const { default: prisma } = await import("@/lib/db");

        // 3. Find existing Visitor to link (Optional)
        // We link by IP. If no visitor exists yet (e.g. first hit), we log anyway.
        // We do NOT create a Visitor record here to keep this lightweight.
        // Visitor records are created by the main logic when needed (quota/OCR).
        const visitor = await prisma.visitor.findFirst({
            where: { ipAddress: ipAddress },
            orderBy: { createdAt: 'desc' }
        });

        // 4. Create Log
        await prisma.visitLog.create({
            data: {
                ipAddress,
                country,
                city,
                region,
                userAgent: userAgentString,
                path: path || '/',
                referrer: referrer || null,
                visitorId: visitor?.id // Link if found
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Analytics Error:", error);
        // Fail silently to not impact client performance
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
