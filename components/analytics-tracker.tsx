'use client'

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export function AnalyticsTracker() {
    const pathname = usePathname()
    const lastPathRef = useRef<string | null>(null)

    useEffect(() => {
        // Debounce or check distinct
        if (lastPathRef.current === pathname) return
        lastPathRef.current = pathname

        // Fire and forget
        const track = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer
                    })
                })
            } catch (e) {
                // Ignore analytics errors
            }
        }

        // Delay slightly to ensure page load
        const timer = setTimeout(track, 1000)
        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
