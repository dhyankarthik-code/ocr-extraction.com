"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"
import AuthModal from "@/components/auth-modal"

export default function FAQPage() {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions (FAQs)</h1>

                    <div className="space-y-6">
                        {[
                            { q: "Is Infy Galaxy OCR completely free?", a: "Yes. You can extract text from images at zero cost, with no software installation required." },
                            { q: "What file types does FreeOCR.AI support?", a: "JPG, PNG, JPEG, PDF, TIFF, BMP, Web P and more." },
                            { q: "Can it extract text from handwriting?", a: "Yes. Thanks to advanced AI models, Infy Galaxy OCR can recognize both printed and handwritten text." },
                            { q: "Is my uploaded data safe?", a: "Files are processed online securely and are not stored permanently. Once the data is extracted, the original file uploaded is deleted to ensure that we don’t retain the copy of the file." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-700">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
                        <p className="font-semibold mb-1">Disclaimer:</p>
                        <p>
                            The user is uploading the image on their own discretion and Infy Galaxy will not be held responsible for any incidents arising due to the uploading or any other arising out of uploading the file / image. The user is at their own the risk for uploading the images / files.
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
