"use client"

import { useState } from "react"
import FeedbackModal from "@/components/feedback-modal"
import { Button } from "@/components/ui/button"

export default function FeedbackTestPage() {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🧪 Feedback Form Test Page
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Click the button below to test the feedback modal
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="font-bold text-blue-900 mb-2">✅ What to Test:</h2>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• Click stars to rate (1-5)</li>
                            <li>• Type feedback in the text area</li>
                            <li>• Click "Submit Feedback" button</li>
                            <li>• See the "Thank You!" message</li>
                            <li>• Modal auto-closes after submission</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h2 className="font-bold text-yellow-900 mb-2">📧 Email Notifications:</h2>
                        <p className="text-sm text-yellow-800">
                            Emails will be sent to <strong>admin@ocr-extraction.com</strong> and{" "}
                            <strong>prakashmalay@gmail.com</strong> when you submit feedback
                            (requires Resend API key in .env file)
                        </p>
                    </div>

                    <Button
                        onClick={() => setShowFeedbackModal(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
                    >
                        🎯 Open Feedback Modal
                    </Button>

                    <div className="text-center text-sm text-gray-500 mt-8">
                        <p>This is a test page for the feedback form.</p>
                        <p>In production, the modal appears automatically 3 seconds after OCR conversion.</p>
                    </div>
                </div>

                {/* Feedback Modal */}
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                />
            </div>
        </div>
    )
}
