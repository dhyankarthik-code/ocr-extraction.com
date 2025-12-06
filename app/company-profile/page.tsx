"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"
import AuthModal from "@/components/auth-modal"

export default function CompanyProfilePage() {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Infy Galaxy – Company Profile</h1>

                    <div className="text-gray-700 lead text-xl mb-12">
                        <p>
                            Infy Galaxy is a global technology company specializing in advanced Artificial Intelligence, OCR solutions, automation platforms, and next-generation digital productivity tools. With a strong focus on innovation and user-driven engineering, Infy Galaxy develops high-performance AI systems that simplify workflows, enhance accuracy, and unlock new possibilities for individuals and enterprises worldwide.
                        </p>
                    </div>

                    <div className="space-y-6 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
                        <p className="text-gray-700">
                            Founded with a vision to make intelligent technology accessible to everyone, Infy Galaxy brings together experts in AI, machine learning, Vision Language Models (VLMs), cloud infrastructure, and human-centric UX design. Our goal is to build reliable, scalable tools that empower users to work smarter and faster across a wide range of industries—including education, finance, e-commerce, legal, data processing, research, and enterprise automation.
                        </p>
                        <p className="text-gray-700">
                            We operate with a commitment to transparency, security, and continuous improvement, ensuring every product delivers measurable impact and long-term value.
                        </p>
                    </div>

                    <div className="space-y-8 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
                        <p className="text-gray-700">
                            Infy Galaxy specializes in creating state-of-the-art AI solutions designed to improve digital efficiency and accuracy. Our product ecosystem includes:
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">1. AI-Powered OCR (Optical Character Recognition) Solutions</h3>
                                <p className="text-gray-700 text-sm">
                                    Our flagship OCR systems, including FreeOCR.AI and Infy Galaxy OCR, use advanced Vision LLM technology to extract text from images, PDFs, scanned documents, and handwritten notes with exceptional precision. These tools support multilingual text recognition, layout preservation, and lightning-fast processing.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Intelligent Automation Platforms</h3>
                                <p className="text-gray-700 text-sm">
                                    We build AI-powered tools that automate repetitive digital workflows such as data entry, document processing, summarization, formatting, and classification. Our automation engines reduce manual effort and enhance operational efficiency for businesses of all sizes.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">3. AI Chatbots & Virtual Assistants</h3>
                                <p className="text-gray-700 text-sm">
                                    Infy Galaxy develops customizable AI chatbot frameworks capable of handling customer support, lead generation, conversational commerce, and internal knowledge automation. These systems integrate seamlessly into websites, mobile apps, and enterprise platforms.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Cloud-Based Productivity Tools</h3>
                                <p className="text-gray-700 text-sm">
                                    We deliver advanced cloud-first applications designed for global accessibility, high performance, and seamless integration with existing systems. Our platforms are optimized for speed, accuracy, and user experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Our Technology</h2>
                        <p className="text-gray-700">Infy Galaxy's solutions are powered by cutting-edge technologies including:</p>

                        <div className="flex flex-wrap gap-3">
                            {[
                                "Vision Large Language Models (VLMs)",
                                "Neural OCR engines",
                                "Machine learning classification models",
                                "Natural language processing (NLP)",
                                "Cloud-native scalable infrastructure",
                                "Real-time text extraction and processing pipelines"
                            ].map((tech, i) => (
                                <span key={i} className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-700 italic mt-4">
                            This technological foundation enables us to provide unmatched accuracy, stability, and execution speed across all our products.
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
