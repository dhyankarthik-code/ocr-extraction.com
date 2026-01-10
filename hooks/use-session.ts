"use client"

import { useSessionContext } from "@/components/providers/session-provider"

export function useSession() {
  const context = useSessionContext()
  return {
    session: context.session,
    loading: context.loading,
    logout: context.logout,
    refreshSession: context.refreshSession
  }
}
