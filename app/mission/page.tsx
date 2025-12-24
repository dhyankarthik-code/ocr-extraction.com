"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"
import AuthModal from "@/components/auth-modal"

export const metadata = {
    title: 'Our Mission | Making AI OCR Accessible to Everyone',
    description: 'Our mission is to provide free, high-accuracy OCR tools to students, professionals, and businesses worldwide without hidden costs.',
}

export default function MissionPage() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <article className="prose prose-lg max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h1>

                    <div className="space-y-6 text-gray-700">
                        <p className="lead text-xl">
                            We give the online OCR - optical character recognition technology extraction service for free without any kind of hidden price whatsoever.
                            We also have value added on top of the data extraction service such as providing summary of the extracted data for ease of understanding using artificial intelligence - AI, reporting, creating structure based on your inputs, ability to download in any format that you prefer.
                        </p>

                        <p>
                            We use the latest and most sophisticated models to ensure greater accuracy in converting images and scanned documents into editable, summarizable, searchable, and reportable formats.
                        </p>
                    </div>
                </article>
            </main>

            <Footer />

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    )
}
