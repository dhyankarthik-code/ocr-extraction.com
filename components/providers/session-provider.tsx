"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
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

    const fetchSession = useCallback(async () => {
        try {
            // Don't set loading to true here if we want background refresh
            // But for initial load, loading state is already true
            const response = await fetch("/api/auth/session")
            if (response.ok) {
                const data = await response.json()
                setSession(data)
            } else {
                setSession(null)
            }
        } catch (error) {
            console.error("Error checking session:", error)
            setSession(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSession()

        // Refresh session when window regains focus (user returns to tab)
        const handleFocus = () => {
            fetchSession()
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
