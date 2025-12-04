import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // TODO: Clear session cookies
  return NextResponse.json({ success: true })
}
