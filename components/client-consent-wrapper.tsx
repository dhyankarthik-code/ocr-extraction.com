"use client"

"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/hooks/use-session"
import ConsentPopup from "@/components/consent-popup"
import CookieBanner from "@/components/cookie-banner"

export default function ClientConsentWrapper() {
    const { session } = useSession()
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Initial check on mount
        const accepted = localStorage.getItem("terms_accepted") === "true"
        setTermsAccepted(accepted)
    }, [])

    const handleTermsAccepted = () => {
        setTermsAccepted(true)
        // Storage update is handled inside component but state update triggers re-render
    }

    if (!mounted) return null

    // Always render popup, logic inside handles session vs guest
    return (
        <>
            {/* <ConsentPopup session={session} onAccept={handleTermsAccepted} /> */}
            {/* <CookieBanner termsAccepted={termsAccepted} /> */}
        </>
    )
}
