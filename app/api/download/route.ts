import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")
  const id = searchParams.get("id")

  try {
    // TODO: Generate file based on format
    // For now, return mock data

    const mockText = "Sample OCR Output"

    if (format === "txt") {
      return new NextResponse(mockText, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": 'attachment; filename="ocr-result.txt"',
        },
      })
    }

    if (format === "pdf") {
      return new NextResponse("PDF content", {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="ocr-result.pdf"',
        },
      })
    }

    if (format === "docx") {
      return new NextResponse("DOCX content", {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": 'attachment; filename="ocr-result.docx"',
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to generate download" }, { status: 500 })
  }
}
