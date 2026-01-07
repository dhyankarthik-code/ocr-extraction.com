
import { useCallback } from "react"
import { useSession } from "@/hooks/use-session"

export function useVisitorTracker() {
    const { session } = useSession()

    const trackUsage = useCallback(async (toolName: string) => {
        try {
            const email = session?.email || 'anonymous'

            // STRICT CONSENT CHECK OMITTED FOR NOW
            // const termsAccepted = typeof window !== 'undefined' && localStorage.getItem("terms_accepted") === "true"
            // const cookiesAccepted = typeof window !== 'undefined' && localStorage.getItem("cookies_accepted") === "true"

            // if (!termsAccepted || !cookiesAccepted) {
            //     console.warn("Tracking blocked: User has not accepted terms or cookies.")
            //     return
            // }

            await fetch('/api/visitor/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    tool: toolName
                }),
            })
        } catch (error) {
            console.error('Visitor tracking failed:', error)
        }
    }, [session])

    return { trackUsage }
}
