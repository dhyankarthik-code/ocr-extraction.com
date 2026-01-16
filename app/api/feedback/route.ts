import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { Resend } from "resend"

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
        const { rating, feedback, timestamp } = body

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
        const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown"

        // Prepare feedback data
        const feedbackData = {
            rating,
            feedback: feedback || "",
            timestamp: timestamp || new Date().toISOString(),
            userAgent,
            ip,
        }

        // Log feedback to console (you can replace this with database storage)
        console.log("=== NEW FEEDBACK RECEIVED ===")
        console.log("Rating:", rating, "⭐".repeat(rating))
        console.log("Feedback:", feedback || "(No text feedback)")
        console.log("Timestamp:", feedbackData.timestamp)
        console.log("IP:", ip)
        console.log("User Agent:", userAgent)
        console.log("============================")

        // TODO: Store in database
        // Example:
        // await db.feedback.create({
        //     data: feedbackData
        // })

        // Send email notification to admins
        const resend = getResendClient();

        if (resend) {
            try {
                const starDisplay = "⭐".repeat(rating) + "☆".repeat(5 - rating)

                await resend.emails.send({
                    from: "OCR Feedback <noreply@ocr-extraction.com>",
                    to: ["admin@ocr-extraction.com", "prakashmalay@gmail.com"],
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
                                        <p><span class="label">Submitted:</span> ${new Date(feedbackData.timestamp).toLocaleString()}</p>
                                        <p><span class="label">IP Address:</span> ${ip}</p>
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
                // Don't fail the request if email fails - still save the feedback
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

// Optional: GET endpoint to retrieve feedback (for admin dashboard)
export async function GET(request: NextRequest) {
    // Add authentication check here
    // const isAdmin = await checkAdminAuth(request)
    // if (!isAdmin) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // TODO: Retrieve feedback from database
    // const feedbackList = await db.feedback.findMany({
    //     orderBy: { timestamp: 'desc' },
    //     take: 100
    // })

    return NextResponse.json(
        {
            message: "Feedback retrieval endpoint",
            // feedbackList
        },
        { status: 200 }
    )
}
