"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/hooks/use-session"
import ConsentPopup from "@/components/consent-popup"
import CookieBanner from "@/components/cookie-banner"

import { updateConsent } from "@/lib/gtag"

export default function ClientConsentWrapper() {
    const { session } = useSession()
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Initial check on mount
        const accepted = localStorage.getItem("terms_accepted") === "true"
        setTermsAccepted(accepted)

        // Sync consent state with GTM on load
        if (accepted) {
            updateConsent(true)
        }

        // Check separate cookie consent
        const cookiesAccepted = localStorage.getItem("cookies_accepted") === "true"
        if (cookiesAccepted) {
            updateConsent(true)
        }
    }, [])

    const handleTermsAccepted = () => {
        setTermsAccepted(true)
        localStorage.setItem("terms_accepted", "true")
        // Trigger GTM consent update
        updateConsent(true)
    }

    if (!mounted) return null

    // Always render popup, logic inside handles session vs guest
    return (
        <>
            {/* <ConsentPopup session={session} onAccept={handleTermsAccepted} /> */}
            <CookieBanner termsAccepted={termsAccepted} />
        </>
    )
}
