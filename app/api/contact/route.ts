import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, country, mobile, message } = body

        // Get user's IP address
        const forwarded = request.headers.get("x-forwarded-for")
        const realIp = request.headers.get("x-real-ip")
        const ipAddress = forwarded ? forwarded.split(",")[0] : realIp || "Unknown"

        // Google Sheets Web App URL
        const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || ""

        if (!GOOGLE_SHEET_URL) {
            console.error("GOOGLE_SHEET_WEBHOOK_URL not configured")
            return NextResponse.json({ error: "Configuration error" }, { status: 500 })
        }

        // Send data to Google Sheets including IP address
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                country,
                mobile,
                message,
                ipAddress,
                timestamp: new Date().toISOString(),
            }),
        })

        if (!response.ok) {
            console.error("Google Sheets response error:", await response.text())
            throw new Error("Failed to submit to Google Sheets")
        }

        return NextResponse.json({ success: true, message: "Form submitted successfully" })
    } catch (error) {
        console.error("Contact form API error:", error)
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        )
    }
}
