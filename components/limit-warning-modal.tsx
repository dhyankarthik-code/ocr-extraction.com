"use client"

import { X } from "lucide-react"

interface LimitWarningModalProps {
    onClose: () => void
}

export default function LimitWarningModal({ onClose }: LimitWarningModalProps) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">Usage Limit Exceeded</h3>

                    <p className="text-gray-600">
                        It seems you are trying upload more than 10 mb. The usage limit is 10 mb per day. If you need more than 10 mb please fill the contact form.
                    </p>

                    <div className="pt-2">
                        <button
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
