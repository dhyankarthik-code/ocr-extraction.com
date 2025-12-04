import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // TODO: Send to n8n webhook
    // const webhook = process.env.N8N_WEBHOOK_URL
    // const response = await fetch(webhook, { method: 'POST', body: formData })
    // const data = await response.json()

    // Mock execution ID for now
    const executionId = `exec_${Date.now()}`

    return NextResponse.json({
      success: true,
      executionId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
