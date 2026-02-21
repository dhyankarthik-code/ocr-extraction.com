"use client"

import { useEffect } from "react"

/**
 * Tawk.to Live Chat Widget
 *
 * Property ID: 6999e1f447cf7f1c3ae16c25
 * Widget ID:   1ji0hl9od
 *
 * - Real-time live chat with visitors
 * - Auto-opens on first visit to prompt engagement
 * - Geo-detects visitor country/city
 * - Push notifications on mobile + desktop apps
 */
export default function TawkToChat() {
    useEffect(() => {
        // Skip if already loaded
        if (document.getElementById("tawkto-script")) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        w.Tawk_API = w.Tawk_API || {}
        w.Tawk_LoadStart = new Date()

        // Auto-open chat on first visit (once per session)
        w.Tawk_API.onLoad = function () {
            if (!sessionStorage.getItem("tawk_prompted")) {
                setTimeout(() => {
                    try { w.Tawk_API.maximize() } catch { /* ignore */ }
                    sessionStorage.setItem("tawk_prompted", "1")
                }, 3000)
            }
        }

        // Inject the Tawk.to script
        const s1 = document.createElement("script")
        s1.id = "tawkto-script"
        s1.async = true
        s1.src = "https://embed.tawk.to/6999e1f447cf7f1c3ae16c25/1ji0hl9od"
        s1.charset = "UTF-8"
        s1.setAttribute("crossorigin", "*")
        document.body.appendChild(s1)
    }, [])

    return null
}
