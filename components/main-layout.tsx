"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ChatWidget from "@/components/chat-widget"
import AuthModal from "@/components/auth-modal"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)

    return (
        <div className="min-h-screen bg-white flex flex-col pt-24">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 flex flex-col relative w-full">
                {children}
            </main>

            <Footer />
            <ChatWidget />

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => {
                        setShowAuthModal(false)
                        window.location.reload()
                    }}
                />
            )}
        </div>
    )
}
