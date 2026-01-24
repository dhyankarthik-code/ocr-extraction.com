"use client"


import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Search, Download, Plus, Sparkles } from "lucide-react"
import SummaryModal from "@/components/summary-modal"

export default function ResultPage() {
  const params = useParams()
  const [text, setText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState<string[] | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/result/${params.id}`)
        const data = await response.json()
        setText(data.text || "")
        setLoading(false)
      } catch (error) {
        console.error("Error fetching result:", error)
        setLoading(false)
      }
    }

    fetchResult()
  }, [params.id])

  const filteredText = text
    .split("\n")
    .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
    .join("\n")

  const handleGenerateSummary = async () => {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      setSummary(data.summary)
      setShowSummary(true)
    } catch (error) {
      console.error("Error generating summary:", error)
    }
  }

  const handleDownload = (format: "pdf" | "docx" | "txt") => {
    const element = document.createElement("a")
    element.setAttribute("href", `/api/download?format=${format}&id=${params.id}`)
    element.setAttribute("download", `ocr-result.${format}`)
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

  return (
    <div className="bg-white flex-1 py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin mb-4">⏳</div>
              <p className="text-gray-600">Processing your document...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Searchable Text */}
            <div className="md:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search in text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Text Display */}
                <div className="p-6 bg-white max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {filteredText || text}
                  </pre>
                </div>
              </div>
            </div>

            {/* Right: Downloads & Summary */}
            <div className="space-y-4">
              {/* Download Buttons */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Download</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleDownload("pdf")
                      // For PDF, we now use the client-side generator if available, or fall back to the handler logic
                      // But wait, the handleDownload in this component does an API call.
                      // We need to override it for PDF specifically or update handleDownload.
                      // Let's update handleDownload instead.
                    }}
                    className="w-full py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleDownload("docx")}
                    className="w-full py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Word
                  </button>
                  <button
                    onClick={() => handleDownload("txt")}
                    className="w-full py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Text
                  </button>
                </div>
              </div>

              {/* New Button */}
              <button className="w-full py-2 px-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                New
              </button>

              {/* AI Summary Button */}
              <button
                onClick={handleGenerateSummary}
                className="w-full py-2 px-3 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2 fixed bottom-6 left-6 md:static md:fixed-none md:relative"
              >
                <Sparkles className="w-4 h-4" />
                AI Summary
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Modal */}
      {showSummary && <SummaryModal summary={summary} onClose={() => setShowSummary(false)} />}
    </div>
  )
}
