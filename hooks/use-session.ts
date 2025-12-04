"use client"

import { useState, useEffect } from "react"
import type { Session } from "@/types/auth"

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setSession(data)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setSession(null)
  }

  return { session, loading, logout }
}
