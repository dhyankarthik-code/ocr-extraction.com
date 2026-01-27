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

        // FIXED: More specific bot detection - only block known bad bots, not legitimate browsers
        // Removed overly broad patterns like "bot", "crawl", "spider", "headless" that catch real users
        const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|pa11y|lighthouse|pingdom|uptimerobot|ahrefsbot|semrushbot|dotbot|mj12bot|screaming frog/i.test(userAgentString);

        if (isLocalhost || isBot) {
            console.log(`[Analytics] ⏭️ Skipped: ${isLocalhost ? 'localhost' : 'bot'} - ${ipAddress} - ${userAgentString.slice(0, 50)}`);
            return NextResponse.json({ success: true, skipped: true, reason: isLocalhost ? 'localhost' : 'bot' });
        }

        // Enhanced logging for debugging
        console.log(`[Analytics] 📊 Processing visit: ${path}`);
        console.log(`[Analytics] 🌍 IP: ${ipAddress} | Location: ${city}, ${region}, ${country}`);
        console.log(`[Analytics] 🖥️ User Agent: ${userAgentString.slice(0, 100)}`);

        const { default: prisma } = await import("@/lib/db");

        // DEBUG: Log the database host to identify which Supabase project we are connected to
        // We only log the host, not the password
        try {
            // @ts-ignore
            const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || '';
            const dbHost = dbUrl.split('@')[1]?.split('/')[0] || 'unknown-host';
            console.log(`[Analytics] 🔌 Connected to DB Host: ${dbHost}`);
        } catch (e) {
            console.log('[Analytics] ⚠️ Could not parse DB Host');
        }

        // Validate database connection before proceeding
        try {
            await prisma.$queryRaw`SELECT 1`;
            console.log(`[Analytics] ✅ Database connection verified`);
        } catch (dbError) {
            console.error('[Analytics] ❌ Database connection failed:', dbError);
            return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
        }

        // 4. Find existing Visitor to link (Optional)
        const visitor = await prisma.visitor.findFirst({
            where: { ipAddress: ipAddress },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`[Analytics] 🔗 Visitor lookup: ${visitor ? `Found ID ${visitor.id}` : 'New visitor'}`);

        // 5. Create Log
        const visitLog = await prisma.visitLog.create({
            data: {
                ipAddress,
                country: country || 'Unknown',
                city: city || 'Unknown',
                region: region || 'Unknown',
                userAgent: userAgentString,
                path: path || '/',
                referrer: referrer || null,
                visitorId: visitor?.id
            }
        });

        console.log(`[Analytics] ✅ Tracked visit: ${path} from ${ipAddress} (${city}, ${country}) - Log ID: ${visitLog.id}`);

        // HYPERLOGLOG (HLL) TRACKING
        // Track unique daily visitor using Redis HLL (Efficient & Private)
        try {
            const { trackUniqueEvent } = await import("@/lib/analytics");
            // Fire and forget - do not await
            trackUniqueEvent('visitors', ipAddress);
        } catch (hllError) {
            console.error("[Analytics] HLL Tracking failed", hllError);
        }

        return NextResponse.json({ success: true, logId: visitLog.id });

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
