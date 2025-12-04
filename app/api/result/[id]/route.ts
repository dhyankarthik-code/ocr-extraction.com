import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // TODO: Fetch result from n8n or database
    // For now, return mock data
    const mockText = `Sample OCR Output

This is the extracted text from your PDF document.
It demonstrates how the OCR result will look.
You can search and download it in multiple formats.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`

    return NextResponse.json({
      success: true,
      text: mockText,
      executionId: params.id,
    })
  } catch (error) {
    console.error("Result fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
