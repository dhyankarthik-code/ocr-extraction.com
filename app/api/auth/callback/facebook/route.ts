import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(`/?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect("/?error=no_code")
  }

  // TODO: Exchange code for tokens via Facebook API
  // For now, create mock session
  const mockUser = {
    id: "facebook_" + Math.random().toString(36).substr(2, 9),
    email: "user@example.com",
    name: "Facebook User",
    provider: "facebook",
  }

  // Set session cookie
  const response = NextResponse.redirect("/")
  response.cookies.set("session", JSON.stringify(mockUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
