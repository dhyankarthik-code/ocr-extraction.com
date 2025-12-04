import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie?.value) {
    return NextResponse.json(null)
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(null)
  }
}
