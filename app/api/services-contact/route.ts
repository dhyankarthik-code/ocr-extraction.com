import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, company, phoneWithCode, message } = body

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            )
        }

        // Prepare email content
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Services Inquiry</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 32px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                                            🎯 New Services Inquiry
                                        </h1>
                                        <p style="margin: 8px 0 0 0; color: #fef2f2; font-size: 14px; font-weight: 500;">
                                            OCR-Extraction.com Services Page
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 32px;">
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding-bottom: 24px;">
                                                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                                                        <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                                            ⚡ Priority: High - Respond within 24 hours
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            <!-- Contact Details -->
                                            <tr>
                                                <td style="padding-bottom: 16px;">
                                                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                                                        <tr>
                                                            <td style="padding: 8px 0;">
                                                                <strong style="color: #374151; font-size: 14px;">👤 Name:</strong>
                                                                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${name}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 8px 0;">
                                                                <strong style="color: #374151; font-size: 14px;">📧 Email:</strong>
                                                                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px;">
                                                                    <a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 8px 0;">
                                                                <strong style="color: #374151; font-size: 14px;">📞 Phone:</strong>
                                                                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                                                                    <a href="tel:${phoneWithCode?.replace(/\s/g, '')}" style="color: #dc2626; text-decoration: none;">${phoneWithCode || 'Not provided'}</a>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        ${company ? `
                                                        <tr>
                                                            <td style="padding: 8px 0;">
                                                                <strong style="color: #374151; font-size: 14px;">🏢 Company:</strong>
                                                                <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${company}</p>
                                                            </td>
                                                        </tr>
                                                        ` : ''}
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                            <!-- Message -->
                                            <tr>
                                                <td style="padding-top: 16px;">
                                                    <strong style="color: #374151; font-size: 14px; display: block; margin-bottom: 8px;">💬 Message:</strong>
                                                    <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px;">
                                                        <p style="margin: 0; color: #111827; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0; color: #6b7280; font-size: 13px;">
                                            This inquiry was submitted via the <strong>Services Page</strong> contact form
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                                            Received: ${new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'UTC'
        })} UTC
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `

        // Send emails to both addresses
        const recipients = ["prakashmalay@gmail.com", "admin@ocr-extraction.com"]

        await resend.emails.send({
            from: "OCR Services <noreply@ocr-extraction.com>",
            to: recipients,
            subject: `🎯 New Services Inquiry from ${name}${company ? ` (${company})` : ''}`,
            html: emailHtml,
            replyTo: email,
        })

        return NextResponse.json(
            { success: true, message: "Email sent successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Services contact form error:", error)
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        )
    }
}
