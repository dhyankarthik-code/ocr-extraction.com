import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { Resend } from "resend"

const getResendClient = () => {
    const key = process.env.RESEND_API_KEY
    if (key && key.length > 10 && !key.includes("placeholder") && !key.includes("your_resend_api_key")) {
        return new Resend(key)
    }
    return null
}

const escapeHtml = (value: unknown) => {
    const str = value == null ? "" : String(value)
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, country, mobile, message } = body

        // Get user's IP address
        const forwarded = request.headers.get("x-forwarded-for")
        const realIp = request.headers.get("x-real-ip")
        const ipAddress = forwarded ? forwarded.split(",")[0] : realIp || "Unknown"

        // Save to Supabase FIRST
        try {
            await prisma.contactSubmission.create({
                data: {
                    name,
                    email,
                    country,
                    mobile,
                    message,
                    ipAddress
                }
            })
            console.log("✅ Contact submission saved to Supabase")
        } catch (dbError) {
            console.error("❌ Failed to save contact submission to Supabase:", dbError)
            return NextResponse.json(
                { error: "Failed to save contact submission" },
                { status: 500 }
            )
        }

        const resend = getResendClient()
        if (resend) {
            try {
                const replyToEmail = (email && typeof email === 'string' && email.includes('@')) ? email : undefined;
                await resend.emails.send({
                    from: "Contact Form <onboarding@resend.dev>",
                    to: "admin@ocr-extraction.com",
                    replyTo: replyToEmail,
                    subject: `📩 New Contact: ${name} - OCR-Extraction.com`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0;">
                            <div style="max-width: 720px; margin: 0 auto; padding: 24px;">
                                <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                                    <div style="background: #2563eb; color: #ffffff; padding: 20px 24px;">
                                        <div style="font-size: 20px; font-weight: 700;">📩 New Contact Message</div>
                                        <div style="font-size: 13px; opacity: 0.9; margin-top: 6px;">General Inquiry - OCR-Extraction.com</div>
                                    </div>
                                    <div style="background: #ffffff; padding: 24px;">
                                        <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                                            <tr><td style="padding: 8px 0; border-top: 1px solid #f3f4f6;"><strong>Name:</strong> ${escapeHtml(name)}</td></tr>
                                            <tr><td style="padding: 8px 0; border-top: 1px solid #f3f4f6;"><strong>Email:</strong> ${escapeHtml(email)}</td></tr>
                                            <tr><td style="padding: 8px 0; border-top: 1px solid #f3f4f6;"><strong>Country:</strong> ${escapeHtml(country)}</td></tr>
                                            <tr><td style="padding: 8px 0; border-top: 1px solid #f3f4f6;"><strong>Mobile:</strong> ${escapeHtml(mobile)}</td></tr>
                                            <tr><td style="padding: 8px 0; border-top: 1px solid #f3f4f6;"><strong>IP Address:</strong> ${escapeHtml(ipAddress)}</td></tr>
                                        </table>

                                        <div style="margin-top: 20px;">
                                            <div style="font-weight: 700; margin-bottom: 8px; color: #374151;">Message</div>
                                            <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">${escapeHtml(message)}</div>
                                        </div>

                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                                            <strong>Submitted:</strong> ${escapeHtml(new Date().toISOString())}<br>
                                            <strong>Source:</strong> Contact Page Form
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                })
                console.log("✅ Contact submission email sent")
            } catch (emailError) {
                console.error("❌ Failed to send contact submission email:", emailError)
            }
        } else {
            console.warn("⚠️ RESEND_API_KEY not configured. Skipping contact email sending.")
        }

        // Google Sheets Web App URL - OPTIONAL
        const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || ""

        if (!GOOGLE_SHEET_URL) {
            console.warn("⚠️ GOOGLE_SHEET_WEBHOOK_URL not configured. Skipping Google Sheets sync.")
            return NextResponse.json({ success: true, message: "Form submitted successfully" })
        }

        // Send data to Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify({
                type: "contact",
                name,
                email,
                country,
                mobile,
                message,
                ipAddress,
                timestamp: new Date().toISOString(),
            }),
        })

        // Return success regardless of response (no-cors workaround)
        return NextResponse.json({ success: true, message: "Form submitted successfully" })
    } catch (error) {
        console.error("Contact form API error:", error)
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        )
    }
}
