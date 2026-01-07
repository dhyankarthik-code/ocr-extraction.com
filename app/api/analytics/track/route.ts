import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { path, referrer } = body;

        // 1. Get IP and Location
        const forwardedFor = req.headers.get('x-forwarded-for');
        const realIp = req.headers.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

        // Helper for safe decoding
        const safeDecode = (val: string | null) => {
            if (!val || val === 'Unknown') return 'Unknown';
            try {
                return decodeURIComponent(val);
            } catch (e) {
                return val;
            }
        };

        // Decode URL-encoded Vercel geo headers
        // Vercel example: 'Council%20Bluffs' -> 'Council Bluffs'
        const country = safeDecode(req.headers.get('x-vercel-ip-country'));
        const city = safeDecode(req.headers.get('x-vercel-ip-city'));
        const region = safeDecode(req.headers.get('x-vercel-ip-country-region'));

        // 2. Parse User Agent
        const userAgentString = req.headers.get('user-agent') || '';

        // 3. Filter localhost/internal IPs and bots
        // This prevents polluting the database with test data and bot traffic
        const isLocalhost = ipAddress === '::1' ||
            ipAddress === '127.0.0.1' ||
            ipAddress.startsWith('192.168.') ||
            ipAddress.startsWith('10.') ||
            ipAddress === 'unknown';

        const isBot = /bot|crawl|spider|pa11y|lighthouse|pingdom|uptimerobot|headless/i.test(userAgentString);

        if (isLocalhost || isBot) {
            console.log(`[Analytics] ⏭️ Skipped: ${isLocalhost ? 'localhost' : 'bot'} - ${ipAddress} - ${userAgentString.slice(0, 50)}`);
            return NextResponse.json({ success: true, skipped: true, reason: isLocalhost ? 'localhost' : 'bot' });
        }

        const { default: prisma } = await import("@/lib/db");

        // 4. Find existing Visitor to link (Optional)
        const visitor = await prisma.visitor.findFirst({
            where: { ipAddress: ipAddress },
            orderBy: { createdAt: 'desc' }
        });

        // 5. Create Log
        const visitLog = await prisma.visitLog.create({
            data: {
                ipAddress,
                country,
                city,
                region,
                userAgent: userAgentString,
                path: path || '/',
                referrer: referrer || null,
                visitorId: visitor?.id
            }
        });

        console.log(`[Analytics] ✅ Tracked visit: ${path} from ${ipAddress} (${city}, ${country}) - Log ID: ${visitLog.id}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[Analytics] ❌ Error tracking visit:", error);
        console.error("[Analytics] Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : undefined
        });
        // Return 500 so we see failures in Vercel logs (instead of swallowing)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
    }
}
