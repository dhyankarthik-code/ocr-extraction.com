"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { Session } from "@/types/auth"

interface SessionContextType {
    session: Session | null
    loading: boolean
    logout: () => Promise<void>
    refreshSession: () => Promise<void>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const isFetching = useRef(false)
    const retryDelay = useRef(1000) // Start with 1s, exponential backoff

    const fetchSession = useCallback(async () => {
        // Prevent concurrent requests
        if (isFetching.current) {
            return
        }

        isFetching.current = true
        try {
            const response = await fetch("/api/auth/session")

            if (response.status === 429) {
                // Rate limited - exponential backoff
                const retryAfter = response.headers.get('Retry-After')
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay.current

                console.warn(`Session rate limited. Retrying after ${delay}ms`)
                retryDelay.current = Math.min(retryDelay.current * 2, 30000) // Max 30s

                setTimeout(() => {
                    isFetching.current = false
                    fetchSession()
                }, delay)
                return
            }

            // Reset retry delay on success
            retryDelay.current = 1000

            if (response.ok) {
                const data = await response.json()
                setSession(data)
            } else {
                setSession(null)
            }
        } catch (error) {
            // Only log non-network errors (TypeError = "Failed to fetch" is benign during dev/HMR)
            if (!(error instanceof TypeError)) {
                console.error("Error checking session:", error)
            }
            setSession(null)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }, [])

    const lastRefresh = useRef(0)

    useEffect(() => {
        // Initial fetch
        fetchSession()
        lastRefresh.current = Date.now()

        // Refresh session when window regains focus (user returns to tab)
        const handleFocus = () => {
            const now = Date.now()
            // Throttle: Only refresh if more than 30 seconds have passed since last refresh
            if (now - lastRefresh.current > 30000) {
                fetchSession()
                lastRefresh.current = now
            }
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [fetchSession])

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setSession(null)
            // Optional: Redirect to home or refresh page
            window.location.href = "/"
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const refreshSession = async () => {
        await fetchSession()
    }

    return (
        <SessionContext.Provider value={{ session, loading, logout, refreshSession }}>
            {children}
        </SessionContext.Provider>
    )
}

// Custom hook to use the session context
export function useSessionContext() {
    const context = useContext(SessionContext)
    if (context === undefined) {
        throw new Error("useSessionContext must be used within a SessionProvider")
    }
    return context
}
