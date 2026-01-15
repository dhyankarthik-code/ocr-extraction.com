import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// IP extraction with security checks
function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (cfConnectingIp) return cfConnectingIp.split(",")[0].trim();
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp.trim();

  return null;
}

// Geolocation data extraction
function getGeoData(request: NextRequest) {
  return {
    country: request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") || null,
    city: request.headers.get("x-vercel-ip-city") || null,
    region: request.headers.get("x-vercel-ip-country-region") || null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isCheck = searchParams.get("check") === "true";

  if (!isCheck) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const ipAddress = getClientIp(request);

    if (!ipAddress) {
      return NextResponse.json({ hasVoted: false }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check if IP has already submitted feedback (within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        ipAddress,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({ hasVoted: !!existingFeedback }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Feedback check error:", error);
    return NextResponse.json({ hasVoted: false }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    // Input validation
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating. Must be between 1 and 5." },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);

    if (!ipAddress) {
      return NextResponse.json(
        { error: "Unable to verify request" },
        { status: 400 }
      );
    }

    // Check if IP has already voted (within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        ipAddress,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: "You have already submitted feedback recently" },
        { status: 429 }
      );
    }

    // Sanitize comment (prevent XSS)
    const sanitizedComment = comment
      ? comment.trim().slice(0, 1000)
      : null;

    const geoData = getGeoData(request);
    const userAgent = request.headers.get("user-agent") || null;

    // Create feedback entry
    await prisma.feedback.create({
      data: {
        ipAddress,
        rating,
        comment: sanitizedComment,
        country: geoData.country,
        city: geoData.city,
        region: geoData.region,
        userAgent,
      },
    });

    // Send email notification via Resend
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const location = [geoData.city, geoData.region, geoData.country]
        .filter(Boolean)
        .join(", ") || "Unknown";

      const stars = "⭐".repeat(rating);

      await resend.emails.send({
        from: "OCR Extraction <onboarding@resend.dev>",
        to: "dhyan.vrit@gmail.com",
        replyTo: "admin@ocr-extraction.com",
        subject: `🎯 Feedback ${stars} | ${geoData.country || 'Unknown'} ${geoData.region ? `(${geoData.region})` : ''} | IP: ${ipAddress?.substring(0, 15) || 'N/A'}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #1f2937; 
                  background-color: #f3f4f6;
                  margin: 0;
                  padding: 20px;
                }
                .container { 
                  max-width: 650px; 
                  margin: 0 auto; 
                  background: white;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header { 
                  background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
                  color: white; 
                  padding: 40px 30px; 
                  text-align: center; 
                }
                .header h1 { 
                  margin: 0 0 10px 0; 
                  font-size: 28px; 
                  font-weight: 700;
                }
                .header p {
                  margin: 0;
                  opacity: 0.9;
                  font-size: 14px;
                }
                .content { 
                  padding: 40px 30px; 
                }
                .rating-section {
                  text-align: center;
                  padding: 30px 0;
                  background: linear-gradient(to bottom, #fef3c7, #fef9e7);
                  border-radius: 8px;
                  margin-bottom: 30px;
                }
                .rating { 
                  font-size: 48px; 
                  margin: 0 0 15px 0; 
                  letter-spacing: 4px;
                }
                .rating-text {
                  font-size: 24px;
                  font-weight: 700;
                  color: #92400e;
                  margin: 0;
                }
                .section {
                  margin-bottom: 30px;
                }
                .section-title {
                  font-size: 16px;
                  font-weight: 700;
                  color: #374151;
                  margin: 0 0 12px 0;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e5e7eb;
                  padding-bottom: 8px;
                }
                .comment-box { 
                  background: #f9fafb; 
                  padding: 20px; 
                  border-left: 4px solid #1f2937; 
                  border-radius: 6px;
                  font-size: 15px;
                  line-height: 1.7;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
                .no-comment {
                  color: #9ca3af;
                  font-style: italic;
                  text-align: center;
                  padding: 20px;
                }
                .info-grid {
                  display: table;
                  width: 100%;
                  border-collapse: collapse;
                }
                .info-row {
                  display: table-row;
                }
                .info-label {
                  display: table-cell;
                  padding: 12px 16px;
                  font-weight: 600;
                  color: #6b7280;
                  background: #f9fafb;
                  border-bottom: 1px solid #e5e7eb;
                  width: 35%;
                  font-size: 14px;
                }
                .info-value {
                  display: table-cell;
                  padding: 12px 16px;
                  color: #1f2937;
                  border-bottom: 1px solid #e5e7eb;
                  font-size: 14px;
                }
                .footer { 
                  background: #f9fafb;
                  text-align: center; 
                  padding: 25px 30px; 
                  color: #6b7280; 
                  font-size: 13px;
                  border-top: 1px solid #e5e7eb;
                }
                .footer a {
                  color: #1f2937;
                  text-decoration: none;
                  font-weight: 600;
                }
                .footer a:hover {
                  text-decoration: underline;
                }
                .badge {
                  display: inline-block;
                  padding: 4px 12px;
                  background: #dbeafe;
                  color: #1e40af;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                  margin-left: 8px;
                }
                @media only screen and (max-width: 600px) {
                  .container { margin: 10px; }
                  .content { padding: 25px 20px; }
                  .header { padding: 30px 20px; }
                  .info-label, .info-value { 
                    display: block; 
                    width: 100%; 
                  }
                  .info-label {
                    padding-bottom: 4px;
                    border-bottom: none;
                  }
                  .info-value {
                    padding-top: 4px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎯 New Feedback Received</h1>
                  <p>OCR Extraction Feedback System</p>
                </div>
                
                <div class="content">
                  <!-- Rating Section -->
                  <div class="rating-section">
                    <div class="rating">${stars}</div>
                    <p class="rating-text">${rating} out of 5 Stars</p>
                  </div>

                  <!-- User Comment Section -->
                  <div class="section">
                    <h2 class="section-title">💬 User Feedback</h2>
                    ${sanitizedComment ? `
                      <div class="comment-box">${sanitizedComment}</div>
                    ` : '<div class="no-comment">No comment provided by user</div>'}
                  </div>

                  <!-- User Information Section -->
                  <div class="section">
                    <h2 class="section-title">👤 User Information</h2>
                    <div class="info-grid">
                      <div class="info-row">
                        <div class="info-label">📍 Location</div>
                        <div class="info-value">${location}${geoData.country ? ` <span class="badge">${geoData.country}</span>` : ''}</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">🌐 IP Address</div>
                        <div class="info-value">${ipAddress}</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">🕐 Submitted At</div>
                        <div class="info-value">${new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'long'
        })}</div>
                      </div>
                      ${userAgent ? `
                        <div class="info-row">
                          <div class="info-label">💻 Device Info</div>
                          <div class="info-value" style="word-break: break-all;">${userAgent}</div>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Quick Stats -->
                  <div class="section">
                    <h2 class="section-title">📊 Feedback Summary</h2>
                    <div class="info-grid">
                      <div class="info-row">
                        <div class="info-label">⭐ Rating Score</div>
                        <div class="info-value"><strong>${rating}/5</strong> (${(rating / 5 * 100).toFixed(0)}% satisfaction)</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">📝 Comment Length</div>
                        <div class="info-value">${sanitizedComment ? sanitizedComment.length : 0} characters</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">🌍 Region</div>
                        <div class="info-value">${geoData.region || 'Not available'}</div>
                      </div>
                      <div class="info-row">
                        <div class="info-label">🏙️ City</div>
                        <div class="info-value">${geoData.city || 'Not available'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    <strong>OCR Extraction</strong> • Feedback Management System
                  </p>
                  <p style="margin: 0;">
                    <a href="https://www.ocr-extraction.com">Visit Website</a> • 
                    <a href="mailto:admin@ocr-extraction.com">Contact Admin</a>
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 11px; color: #9ca3af;">
                    This email was automatically generated. Forward to admin@ocr-extraction.com for archival.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { success: true, message: "Thank you for your feedback!" },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
