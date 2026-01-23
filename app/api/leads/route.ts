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
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { lookingFor, name, email, country, mobile, message } = body

        // Get user's IP address
        const forwarded = request.headers.get("x-forwarded-for")
        const realIp = request.headers.get("x-real-ip")
        const ipAddress = forwarded ? forwarded.split(",")[0] : realIp || "Unknown"

        // Save to database FIRST
        try {
            await prisma.leadSubmission.create({
                data: {
                    lookingFor,
                    name,
                    email,
                    country,
                    mobile,
                    message,
                    ipAddress
                }
            })
            console.log("✅ Lead submission saved to database")
        } catch (dbError) {
            console.error("❌ Failed to save lead submission:", dbError)
            return NextResponse.json(
                { error: "Failed to save lead submission" },
                { status: 500 }
            )
        }

        // Send email notification
        const resend = getResendClient()
        console.log("📨 Leads Route: Resend client initialized?", !!resend);

        if (resend) {
            try {
                console.log("📨 Leads Route: Attempting to send email to admin@ocr-extraction.com");
                const replyToEmail = (email && typeof email === 'string' && email.includes('@')) ? email : undefined;
                const { data, error } = await resend.emails.send({
                    from: "Leads - OCR Extraction <onboarding@resend.dev>",
                    to: "admin@ocr-extraction.com",
                    replyTo: replyToEmail,
                    subject: `🎯 New Lead: ${lookingFor} - OCR-Extraction.com`,
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
                                    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 20px 24px;">
                                        <div style="font-size: 20px; font-weight: 700;">🎯 New Lead Submission</div>
                                        <div style="font-size: 13px; opacity: 0.9; margin-top: 6px;">Lead Generation Form - OCR-Extraction.com</div>
                                    </div>
                                    <div style="background: #ffffff; padding: 24px;">
                                        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
                                            <div style="font-weight: 700; color: #991b1b; margin-bottom: 4px;">Looking For:</div>
                                            <div style="font-size: 18px; font-weight: 600; color: #dc2626;">${escapeHtml(lookingFor)}</div>
                                        </div>
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
                                            <strong>Source:</strong> Lead Generation Form (Tools/Services Page)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                })

                if (error) {
                    console.error("❌ Resend returned error:", error)
                    throw error
                }

                console.log("✅ Lead notification email sent. Response:", data)
            } catch (emailError) {
                console.error("❌ Failed to send lead email. Error details:", emailError)
            }
        } else {
            console.warn("⚠️ RESEND_API_KEY not configured. Skipping lead email.")
        }

        // Google Sheets Web App URL - OPTIONAL
        const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || ""

        if (GOOGLE_SHEET_URL) {
            try {
                await fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    body: JSON.stringify({
                        type: "lead",
                        lookingFor,
                        name,
                        email,
                        country,
                        mobile,
                        message,
                        ipAddress,
                        timestamp: new Date().toISOString(),
                    }),
                })
            } catch {
                // Ignore Google Sheets errors
            }
        }

        return NextResponse.json({ success: true, message: "Lead submitted successfully" })
    } catch (error) {
        console.error("Lead form API error:", error)
        return NextResponse.json(
            { error: "Failed to submit lead" },
            { status: 500 }
        )
    }
}
