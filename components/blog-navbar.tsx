"use client"

import Navbar from "@/components/navbar"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"
import AuthModal from "@/components/auth-modal"

export default function BlogNavbar() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)

    return (
        <>
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </>
    )
}
