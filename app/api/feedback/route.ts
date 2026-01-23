import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"
import prisma from "@/lib/db"

// Initialize Resend with API key from environment variables
// Move initialization inside the function or check for key existence safely
const getResendClient = () => {
    const key = process.env.RESEND_API_KEY;
    if (key && key.length > 10 && !key.includes("placeholder") && !key.includes("your_resend_api_key")) {
        return new Resend(key);
    }
    return null;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { rating, feedback } = body

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Invalid rating. Must be between 1 and 5." },
                { status: 400 }
            )
        }

        // Get visitor information
        const headersList = await headers()
        const userAgent = headersList.get("user-agent") || "Unknown"
        // standard headers for geography if available (e.g. Vercel)
        const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown"
        const country = headersList.get("x-vercel-ip-country") || null
        const city = headersList.get("x-vercel-ip-city") || null
        const region = headersList.get("x-vercel-ip-country-region") || null

        // Store in database
        try {
            await prisma.feedback.create({
                data: {
                    rating,
                    comment: feedback || "",
                    ipAddress: ip,
                    userAgent,
                    country,
                    city,
                    region,
                }
            })
            console.log("✅ Feedback saved to database")
        } catch (dbError) {
            console.error("❌ Failed to save feedback to database:", dbError)
            // Continue to send email even if DB save fails
        }

        // Send email notification to admins
        const resend = getResendClient();

        if (resend) {
            try {
                const starDisplay = "⭐".repeat(rating) + "☆".repeat(5 - rating)

                await resend.emails.send({
                    from: "OCR Feedback <onboarding@resend.dev>",
                    to: "admin@ocr-extraction.com",
                    subject: `New Feedback: ${rating} Star${rating !== 1 ? 's' : ''} - OCR Extraction`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                                .rating { font-size: 32px; margin: 20px 0; text-align: center; }
                                .feedback-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
                                .meta { color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
                                .label { font-weight: bold; color: #667eea; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0;">🎉 New User Feedback</h1>
                                    <p style="margin: 10px 0 0 0; opacity: 0.9;">OCR-Extraction.com</p>
                                </div>
                                <div class="content">
                                    <div class="rating">
                                        ${starDisplay}
                                        <div style="font-size: 18px; color: #667eea; margin-top: 10px;">
                                            ${rating} out of 5 stars
                                        </div>
                                    </div>
                                    
                                    ${feedback ? `
                                        <div class="feedback-box">
                                            <p class="label">User Comments:</p>
                                            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${feedback}</p>
                                        </div>
                                    ` : '<p style="text-align: center; color: #999; font-style: italic;">No additional comments provided</p>'}
                                    
                                    <div class="meta">
                                        <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
                                        <p><span class="label">IP Address:</span> ${ip}</p>
                                        ${country ? `<p><span class="label">Location:</span> ${city ? city + ', ' : ''}${country}</p>` : ''}
                                        <p><span class="label">Browser:</span> ${userAgent.substring(0, 100)}${userAgent.length > 100 ? '...' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                })

                console.log("✅ Email notification sent successfully")
            } catch (emailError) {
                console.error("❌ Failed to send email notification:", emailError)
                // Don't fail the request if email fails
            }
        } else {
            console.warn("⚠️ Mock Mode: RESEND_API_KEY not configured. Skipping email sending. Feedback logged to console.");
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for your feedback!"
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error processing feedback:", error)
        return NextResponse.json(
            { error: "Failed to process feedback" },
            { status: 500 }
        )
    }
}

// GET endpoint to retrieve feedback
export async function GET(request: NextRequest) {
    try {
        const feedbackList = await prisma.feedback.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        })

        return NextResponse.json(
            {
                message: "Feedback retrieval endpoint",
                feedbackList
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error retrieving feedback:", error)
        return NextResponse.json(
            { error: "Failed to retrieve feedback" },
            { status: 500 }
        )
    }
}
