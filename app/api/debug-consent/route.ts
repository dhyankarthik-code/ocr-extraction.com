import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = cookies()
        const sessionCookie = cookieStore.get("session")
        const sessionStatus = sessionCookie ? "Set" : "Missing"

        const { default: prisma } = await import("@/lib/db")

        // 1. Check Connection
        const userCount = await prisma.user.count()

        let updateStatus = "Skipped (No Session)"
        let updateError = null

        if (sessionCookie) {
            try {
                const user = JSON.parse(sessionCookie.value)
                const email = user.email
                if (email) {
                    await prisma.user.update({
                        where: { email },
                        data: {
                            acceptedTerms: true,
                            acceptedAt: new Date()
                        }
                    })
                    updateStatus = "Success"
                } else {
                    updateStatus = "Failed (No Email in Session)"
                }
            } catch (e: any) {
                updateStatus = "Failed"
                updateError = e.message
            }
        }

        return NextResponse.json({
            status: "Debug Report",
            dbConnection: "OK",
            userCount,
            sessionCookie: sessionStatus,
            updateTest: updateStatus,
            updateError
        })

    } catch (error: any) {
        return NextResponse.json({
            status: "Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
