import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/user/profile - Get current user's profile
export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get("session")
        if (!sessionCookie?.value) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const session = JSON.parse(sessionCookie.value)
        const googleId = session.id?.replace("google_", "")

        if (!googleId) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { googleId },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                phone: true,
                organization: true,
                createdAt: true,
                lastLoginAt: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("[Profile] Error fetching profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// PATCH /api/user/profile - Update user's profile (phone, organization)
export async function PATCH(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get("session")
        if (!sessionCookie?.value) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const session = JSON.parse(sessionCookie.value)
        const googleId = session.id?.replace("google_", "")

        if (!googleId) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
        }

        const body = await request.json()
        const { phone, organization } = body

        // Validate phone number format (optional)
        if (phone && !/^[+]?[\d\s-()]{7,20}$/.test(phone)) {
            return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { googleId },
            data: {
                ...(phone !== undefined && { phone }),
                ...(organization !== undefined && { organization }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                phone: true,
                organization: true,
            }
        })

        // Update session cookie with new data
        const updatedSession = {
            ...session,
            phone: updatedUser.phone,
            organization: updatedUser.organization,
            isNewUser: false,
        }

        const response = NextResponse.json(updatedUser)
        response.cookies.set("session", JSON.stringify(updatedSession), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        console.error("[Profile] Error updating profile:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
