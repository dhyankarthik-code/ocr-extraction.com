"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"

interface CookieBannerProps {
    termsAccepted: boolean
}

export default function CookieBanner({ termsAccepted }: CookieBannerProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Check if Cookies are already accepted
        const cookiesAccepted = localStorage.getItem("cookies_accepted") === "true"

        if (termsAccepted && !cookiesAccepted) {
            setShow(true)
        }
    }, [termsAccepted])

    const handleAccept = () => {
        localStorage.setItem("cookies_accepted", "true")
        setShow(false)
        // Optionally reload to unblock tools immediately without refresh, 
        // but React state in tools might not update instantly unless we use a context.
        // For now, simple local storage set is enough, user might need to click tool again.
        window.dispatchEvent(new Event("storage")) // Trigger storage event for other components if they listen
    }

    if (!show) return null

    return (
        <div className="fixed bottom-0 left-0 z-[200] w-full animate-in slide-in-from-bottom duration-500">
            <div className="bg-red-50/95 backdrop-blur-md border-t border-red-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] py-2 px-6 sm:py-3 sm:px-8">
                <div className="w-full flex flex-col md:flex-row items-center gap-6">
                    <div className="p-3 bg-red-100 shrink-0 border border-red-200 hidden md:block rounded-md">
                        <Cookie className="w-10 h-10 text-red-600" />
                    </div>

                    <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-gray-900 text-lg tracking-tight">Cookies & Data Consent</h4>
                        <p className="text-sm sm:text-base text-gray-800 leading-relaxed max-w-5xl font-medium">
                            Welcome to <span className="font-bold text-red-700">OCR-Extraction.com</span>! In order to provide a more relevant experience for you, we use cookies to enable some website functionality.
                            Cookies help us see which tools most interest you; allow you to easily share content; permit us to deliver services tailored to your interests and locations;
                            and maintain fair usage limits. For more information, please review our Privacy Policy.
                        </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3 pl-0 md:pl-4">
                        <Button
                            onClick={() => {
                                localStorage.setItem("cookies_rejected", "true")
                                setShow(false)
                            }}
                            variant="outline"
                            size="lg"
                            className="w-full md:w-36 border-red-200 text-red-700 hover:bg-red-50 font-bold h-10 rounded-none text-sm"
                        >
                            Reject all Cookies
                        </Button>
                        <Button
                            onClick={handleAccept}
                            size="lg"
                            className="w-full md:w-48 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-none h-10 shadow-sm transition-all hover:translate-y-[-1px]"
                        >
                            Accept all Cookies
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
