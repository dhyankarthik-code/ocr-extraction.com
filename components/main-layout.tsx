"use client"

import dynamic from 'next/dynamic'
import Navbar from "@/components/navbar"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"

// Lazy load non-critical components for improved INP/FCP
const Footer = dynamic(() => import("@/components/footer"), { ssr: true })
const ChatWidget = dynamic(() => import("@/components/chat-widget"), { ssr: false })
const AuthModal = dynamic(() => import("@/components/auth-modal"), { ssr: false })

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)

    return (
        <div className="min-h-screen bg-white flex flex-col pt-20">
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
