import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { lookingFor, name, email, country, mobile, message } = body

        // Get user's IP address
        const forwarded = request.headers.get("x-forwarded-for")
        const realIp = request.headers.get("x-real-ip")
        const ipAddress = forwarded ? forwarded.split(",")[0] : realIp || "Unknown"

        // Save to Supabase FIRST (always, regardless of webhook config)
        try {
            await prisma.contactSubmission.create({
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
            console.log("✅ Contact submission saved to Supabase")
        } catch (dbError) {
            console.error("❌ Failed to save contact submission to Supabase:", dbError)
            // Return error if database save fails
            return NextResponse.json(
                { error: "Failed to save contact submission" },
                { status: 500 }
            )
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
