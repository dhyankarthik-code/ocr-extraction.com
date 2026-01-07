import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, tool } = body;

        if (email && typeof email !== 'string') {
            return NextResponse.json({ error: 'Email must be a string' }, { status: 400 });
        }

        // Get IP address from headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

        // Get user agent
        const userAgent = request.headers.get('user-agent') || 'unknown';

        if (!ipAddress || ipAddress === 'unknown' || ipAddress === '127.0.0.1') {
            // Skip invalid/local IPs or handle gracefully
            return NextResponse.json({ success: false, reason: "Invalid IP" });
        }

        // Fetch geolocation from IP (using free ip-api.com)
        let country = null;
        let city = null;
        let region = null;
        let timezone = null;

        try {
            const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city,timezone`);
            if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                if (geoData.status === 'success') {
                    country = geoData.country;
                    city = geoData.city;
                    region = geoData.regionName;
                    timezone = geoData.timezone;
                }
            }
        } catch (geoError) {
            console.error('Geolocation fetch failed:', geoError);
        }

        // Map tool name to schema field
        const toolMap: Record<string, string> = {
            'OCR': 'usageOCR',
            'Image to PDF': 'usageImageToPdf',
            'PDF to Image': 'usagePdfToImage',
            'PDF to Text': 'usagePdfToText',
            'Text to PDF': 'usageTextToPdf',
            'PDF to Excel': 'usagePdfToExcel',
            'Excel to PDF': 'usageExcelToPdf',
            'PDF to PPT': 'usagePdfToPpt',
            'PPT to PDF': 'usagePptToPdf',
        };

        const toolField = tool && toolMap[tool] ? toolMap[tool] : null;
        const toolIncrement = toolField ? { [toolField]: { increment: 1 } } : {};
        const toolInitial = toolField ? { [toolField]: 1 } : {};

        // Upsert visitor data
        const visitor = await prisma.visitor.upsert({
            where: { ipAddress },
            update: {
                email, // Update to latest email used by this IP
                country,
                city,
                region,
                timezone,
                userAgent,
                lastUsageDate: new Date(),
                ...toolIncrement
            },
            create: {
                email,
                ipAddress,
                country,
                city,
                region,
                timezone,
                userAgent,
                lastUsageDate: new Date(),
                ...toolInitial
            }
        });

        return NextResponse.json({ success: true, visitorId: visitor.id });
    } catch (error) {
        console.error('Visitor API error:', error);
        return NextResponse.json({ error: 'Failed to save visitor data' }, { status: 500 });
    }
}
