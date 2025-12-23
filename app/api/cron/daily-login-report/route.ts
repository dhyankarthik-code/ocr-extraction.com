import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate 24-hour window
    const now = new Date();
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() - 1);

    // Count new logins
    const totalLogins = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: startTime,
          lt: now,
        },
      },
    });

    // Get detailed login information
    const loginDetails = await prisma.user.findMany({
      where: {
        lastLoginAt: {
          gte: startTime,
          lt: now,
        },
      },
      select: {
        email: true,
        name: true,
        lastLoginAt: true,
        country: true,
        city: true,
      },
      orderBy: {
        lastLoginAt: 'desc',
      },
    });

    // Format for Zapier
    const formattedLogins = loginDetails.map(user => ({
      name: user.name || 'Unknown',
      email: user.email,
      location: [user.city, user.country].filter(Boolean).join(', ') || 'Unknown',
      loginTime: user.lastLoginAt?.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) || 'N/A',
    }));

    const reportData = {
      totalLogins,
      period: {
        startIST: startTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        endIST: now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
      },
      logins: formattedLogins,
      recipients: [
        'admin@ocr-extraction.com',
        'karthi@ocr-extraction.com',
        'dhyan@ocr-extraction.com',
        'gajashree@ocr-extraction.com',
      ],
    };

    // Send to Zapier webhook
    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierWebhookUrl) {
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Report sent to Zapier',
      ...reportData,
    });

  } catch (error) {
    console.error('Error in daily login report:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate report',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
