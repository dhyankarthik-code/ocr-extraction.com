"use client"
// Deployment update: 2026-01-26 - Performance optimized

import { useState, useEffect, useRef } from "react"
import dynamic from 'next/dynamic'
import SmartUploadZone from "@/components/smart-upload-zone"
import CtaSection from "@/components/cta-section"

// Dynamic imports for performance (reduces initial JS bundle ~100KB)
const TypeAnimation = dynamic(() => import('react-type-animation').then(mod => mod.TypeAnimation), {
    ssr: false,
    loading: () => <span>Free OCR Extraction tool</span>
})
const Flag = dynamic(() => import('react-world-flags'), { ssr: false }) as any

export default function HomePage() {
    const [mounted, setMounted] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
        // Dynamic import GSAP for reduced initial bundle
        if (heroRef.current) {
            Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]).then(([{ gsap }, { ScrollTrigger }]) => {
                gsap.registerPlugin(ScrollTrigger)

                // Hero Entry
                gsap.fromTo(heroRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
                )

                // Section Reveals
                gsap.utils.toArray('section').forEach((section: any) => {
                    gsap.fromTo(section,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            scrollTrigger: {
                                trigger: section,
                                start: "top 85%",
                                toggleActions: "play none none none"
                            }
                        }
                    )
                })
            })
        }
    }, [])

    return (
        <div ref={heroRef} className="flex flex-col items-center justify-center p-4 md:p-6 w-full premium-gradient" data-hydrated={mounted} data-deploy-id="811ca08-v3">
            <div className="glass-card p-5 md:p-8 mb-6 rounded-[2.5rem] text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 text-balance text-premium-gradient">
                    {/* SEO H1 (Visually Hidden but accessible to crawlers) */}
                    <h1 className="text-gray-900 text-center relative w-full min-h-[4rem] md:min-h-[3.5rem] flex items-center justify-center">
                        <span className="sr-only">Free OCR Extraction Tool - Convert Images to Text, Excel & PDF</span>

                        {!mounted && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                Free OCR Extraction tool
                            </span>
                        )}

                        {mounted && (
                            <TypeAnimation
                                sequence={[
                                    'Free OCR Extraction tool',
                                    2500,
                                    'Free AI OCR & Report Tool',
                                    2500,
                                ]}
                                wrapper="span"
                                speed={15}
                                style={{ display: 'inline-block' }}
                                repeat={Infinity}
                            />
                        )}
                    </h1>
                </div>

                <h2 className="text-base md:text-lg font-bold text-red-600 tracking-tight uppercase mb-2">
                    IMAGE TO TEXT CONVERTER
                </h2>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
                    Extract text from images, convert JPG to Word/Excel, and generate AI insights using state-of-the-art Optical Character Recognition.
                </p>
            </div>

            <SmartUploadZone />

            <div className="mt-12 mb-8 flex justify-center">
                <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/30 max-w-4xl w-full text-center relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-2xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight">
                            Just Take A Photo From Your Mobile And Convert It To Text or Word - As Simple As That !!!
                        </h2>

                        <p className="text-lg md:text-xl font-bold text-red-600 tracking-wide uppercase">
                            On The Move and On The Go !!!
                        </p>
                    </div>
                </div>
            </div>

            {/* Welcome Section */}
            <section className="w-full max-w-5xl mt-12 px-4">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-red-500">OCR-Extraction.com</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
                        The World's "Most Accurate OCR" Tool for Free
                    </p>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
                        Convert your images, scanned documents, and PDFs into clean, editable text in seconds.
                        OCR-Extraction.com is engineered with advanced AI technology to deliver <strong>95–100% accuracy</strong>,
                        lightning-fast processing, and zero data loss — all completely free.
                    </p>
                    <p className="text-gray-500 mt-6 max-w-2xl mx-auto italic">
                        Whether you're a student, professional, or business user, our powerful OCR engine helps you
                        extract text instantly without the need for any installations or subscriptions.
                    </p>
                </div>
            </section>

            {/* AI Reports & Data Section */}
            <section className="w-full max-w-5xl mt-12 px-4">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                Generate customized AI reports
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Create actionable reports such as Key Insights Reports, Medical Report, Cost Analysis Reports, Performance Reports, Trend & Forecast Reports, and Operational Efficiency Reports—all generated instantly from your documents.
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border border-white/20 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                AI Agent Assistance
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our free AI agent helps you get the key answers you need from your extracted data, providing insights and summaries immediately.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-8 rounded-3xl text-center shadow-sm">
                        <p className="text-lg text-red-800 font-bold mb-4">
                            Download Extracted Data in Multiple Formats:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Word', 'Text', 'PDF', 'Excel', 'PowerPoint'].map(format => (
                                <span key={format} className="px-5 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl shadow-sm hover:scale-105 transition-transform">
                                    {format}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Users Trust Us */}
            <section className="w-full max-w-6xl mt-12 px-4 text-center">
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
                        Why Users Trust OCR-Extraction.com
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Exceptional Accuracy</h4>
                            <p className="text-gray-600 text-sm">
                                Our AI-powered optical character recognition engine is trained on millions of samples to ensure
                                unmatched detail, clarity, and precision. From printed text to complex documents, you get
                                near-perfect extraction every time.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Instant Results</h4>
                            <p className="text-gray-600 text-sm">
                                Upload your file and watch it convert within seconds. Thanks to our optimized backend and
                                fast cloud processing, your workflow stays smooth and effortless.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">100% Free to Use</h4>
                            <p className="text-gray-600 text-sm">
                                No hidden fees, no limits, no sign-ups. Access all features without worrying about
                                subscriptions or trials.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">AI Summary Included</h4>
                            <p className="text-gray-600 text-sm">
                                Go beyond text extraction. Our built-in AI Summary tool instantly creates a clean,
                                readable summary of the extracted content — perfect for students, researchers, and professionals.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Export to Excel</h4>
                            <p className="text-gray-600 text-sm">
                                Need structured data? Download your results in Excel format with auto-column formatting.
                                Ideal for analysts, finance teams, logistics departments, and anyone working with tabular data.
                            </p>
                        </div>


                        {/* Feature 6 */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Works on Any Device</h4>
                            <p className="text-gray-600 text-sm">
                                Our Tool / software is browser based and through Artificial Intelligence engine, we process all data without having the need to download or install locally in the desktop or in any device.
                            </p>
                        </div>

                        {/* Feature 7 - Convert File Formats */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Convert File Formats</h4>
                            <p className="text-gray-600 text-sm">
                                Accurate conversion from one format to another is simple, fast, and secure with 100% quality.
                                Examples: Word to PDF, PDF to Excel, PDF to PPT, Excel to PDF, PPT to PDF, Image to Word, or Text to PDF.
                            </p>
                        </div>

                        {/* Feature 8 - Extract DATA */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Extract DATA</h4>
                            <p className="text-gray-600 text-sm">
                                Extract data from PDFs, images, handwritten notes, or any documents. We have solved the complexity of manual data entry for you.
                            </p>
                        </div>

                        {/* Feature 9 - Digital Documentation */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Digital Documentation</h4>
                            <p className="text-gray-600 text-sm">
                                Extract and save documents in digital formats for documentation such as <strong>invoice details, billing details,
                                    insurance claims, loan documents, contracts, logistics documents, and any type of documents</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Convert Image to Text - Step by Step */}
            <section className="w-full max-w-6xl mt-16 px-4">
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/30 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 text-center">
                        How to Convert <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Image to Text?</span>
                    </h3>
                    <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto text-base md:text-lg">
                        Transform any image into editable text in three simple steps. No technical expertise required.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative bg-white p-8 rounded-3xl border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg group/card">
                            <div className="absolute -top-5 left-8 bg-gradient-to-r from-red-600 to-orange-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                1
                            </div>
                            <div className="mt-4">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5 group-hover/card:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Upload Your Image</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Upload JPG, PNG, PDF, TIFF, BMP, or any image format. Supports multi-page PDFs and batch uploads. Maximum file size: 10 MB per document.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white p-8 rounded-3xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg group/card">
                            <div className="absolute -top-5 left-8 bg-gradient-to-r from-orange-600 to-yellow-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                2
                            </div>
                            <div className="mt-4">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 group-hover/card:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Select Language & Format</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Choose your document's language from 117+ supported languages. Select output format: Plain Text, MS Word (.docx), Excel (.xlsx), or PDF.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white p-8 rounded-3xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg group/card">
                            <div className="absolute -top-5 left-8 bg-gradient-to-r from-green-600 to-teal-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                3
                            </div>
                            <div className="mt-4">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-5 group-hover/card:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">Download Results</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Get your converted file instantly. Download as editable document, copy text to clipboard, or generate AI-powered summary and insights.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real-World Use Cases */}
            <section className="w-full max-w-6xl mt-16 px-4">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">
                            Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Use Cases</span>
                        </h3>
                        <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
                            Discover how OCR-Extraction.com transforms workflows across industries and professions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Use Case 1: Manufacturing */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Manufacturing & Production</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Digitize production logs, quality control reports, equipment manuals, and safety documentation. Extract data from inspection forms and maintenance records for analysis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 2: Invoicing & Billing */}
                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-2xl border border-violet-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Invoicing & Billing</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Automate invoice processing by extracting vendor details, line items, amounts, and payment terms. Convert paper invoices to digital records for accounting systems.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 3: Finance & Banking */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Finance & Banking</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Process loan applications, bank statements, financial reports, and compliance documents. Extract transaction data and convert scanned checks into digital records.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 4: Healthcare */}
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Healthcare & Medical</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Digitize patient records, prescriptions, lab reports, and insurance claims. Extract medical data from handwritten notes and convert them into searchable electronic health records.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 5: Retail & E-commerce */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Retail & E-commerce</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Process receipts, purchase orders, inventory lists, and shipping labels. Extract product information from catalogs and convert physical documents to digital inventory systems.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 6: Automotive */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Automotive Industry</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Digitize vehicle inspection reports, service records, warranty documents, and parts catalogs. Extract VIN numbers and specifications from registration documents.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 7: Oil & Gas */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Oil & Gas Industry</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Process drilling reports, safety compliance documents, equipment logs, and geological surveys. Extract data from field reports and convert technical specifications to digital formats.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 8: Education & Research */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Education & Research</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Students and teachers convert scanned textbooks, lecture notes, and study materials into editable text. Reduces file size and enables better exam preparation with searchable content.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 9: Legal & Compliance */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Legal & Compliance</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Extract critical information from legal documents, contracts, court filings, and government forms. Convert scanned documents into digital versions for compliance and record-keeping.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Use Case 10: Logistics & Supply Chain */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Logistics & Supply Chain</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Extract data from shipping manifests, bills of lading, customs documents, and delivery receipts. Automate data entry for warehouse management and tracking systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features Highlight */}
            <section className="w-full max-w-6xl mt-16 px-4">
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/30 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">
                            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Features</span>
                        </h3>
                        <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
                            Industry-leading capabilities designed for accuracy, speed, and versatility
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Feature: Multilingual */}
                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-black text-gray-900">117+ Languages Supported</h4>
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Our advanced OCR engine recognizes text in <strong>117+ languages</strong>, including all major European and Asian languages. Perfect for international businesses and multilingual documents.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Russian', 'Portuguese', 'Italian', 'Korean'].map((lang) => (
                                    <span key={lang} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-100">
                                        {lang}
                                    </span>
                                ))}
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                    +105 more
                                </span>
                            </div>
                        </div>

                        {/* Feature: AI-Powered Accuracy */}
                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-black text-gray-900">AI-Powered Accuracy</h4>
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Our advanced AI engine delivers industry-leading accuracy with intelligent text recognition, layout preservation, and automatic error correction for superior results.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-800 font-semibold text-sm">Recognition Rate:</span>
                                    <span className="text-gray-600 text-sm">99%+ accuracy on printed text, 95%+ on handwritten</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-800 font-semibold text-sm">Smart Processing:</span>
                                    <span className="text-gray-600 text-sm">Auto-rotation, deskewing, noise reduction, contrast enhancement</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-800 font-semibold text-sm">Layout Intelligence:</span>
                                    <span className="text-gray-600 text-sm">Preserves tables, columns, formatting, and document structure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You Can Do */}
            <section className="w-full max-w-5xl mt-12 px-4 text-center">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
                        What You Can Do With OCR-Extraction.com
                    </h3>
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-left">
                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                "Convert images (.jpg, .png, .jpeg) to text",
                                "Extract text from PDFs and scanned documents",
                                "Convert tables and structured data into Excel",
                                "Summarize long or complex documents instantly",
                                "Digitize notes, invoices, medical reports, legal papers",
                                "Create searchable document archives",
                                "Use it for education, business, research, analytics",
                                "No Download or Installation is required. Our process is browser based and not desktop or any device based."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-900">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* We Are Available in Other Languages */}
            <section className="w-full max-w-6xl mt-12 px-4 text-center">
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        We Are Available in Other Languages
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-left mb-8 text-lg">
                        www.ocr-extraction.com OCR service offers image to text recognition and conversion for a variety of languages including:
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: "Afrikaans", code: "ZA" }, { name: "Amharic", code: "ET" }, { name: "Arabic", code: "SA" },
                            { name: "Assamese", code: "IN" }, { name: "Azerbaijani", code: "AZ" }, { name: "Belarusian", code: "BY" },
                            { name: "Bengali", code: "BD" }, { name: "Tibetan", code: "CN" }, { name: "Bosnian", code: "BA" },
                            { name: "Breton", code: "FR" }, { name: "Bulgarian", code: "BG" }, { name: "Catalan", code: "ES" },
                            { name: "Valencian", code: "ES" }, { name: "Cebuano", code: "PH" }, { name: "Czech", code: "CZ" },
                            { name: "Chinese (Simplified)", code: "CN" }, { name: "Chinese (Traditional)", code: "TW" },
                            { name: "Cherokee", code: "US" }, { name: "Welsh", code: "GB-WLS" }, { name: "Danish", code: "DK" },
                            { name: "German", code: "DE" }, { name: "Dzongkha", code: "BT" }, { name: "Greek (Modern)", code: "GR" },
                            { name: "Greek (Ancient)", code: "GR" }, { name: "English", code: "US" }, { name: "Esperanto", code: "EU" },
                            { name: "Estonian", code: "EE" }, { name: "Basque", code: "ES" }, { name: "Persian", code: "IR" },
                            { name: "Finnish", code: "FI" }, { name: "French", code: "FR" }, { name: "Frankish", code: "FR" },
                            { name: "Irish", code: "IE" }, { name: "Galician", code: "ES" }, { name: "Gujarati", code: "IN" },
                            { name: "Haitian Creole", code: "HT" }, { name: "Hebrew", code: "IL" }, { name: "Hindi", code: "IN" },
                            { name: "Croatian", code: "HR" }, { name: "Hungarian", code: "HU" }, { name: "Inuktitut", code: "CA" },
                            { name: "Indonesian", code: "ID" }, { name: "Icelandic", code: "IS" }, { name: "Italian", code: "IT" },
                            { name: "Javanese", code: "ID" }, { name: "Japanese", code: "JP" }, { name: "Kannada", code: "IN" },
                            { name: "Georgian", code: "GE" }, { name: "Kazakh", code: "KZ" }, { name: "Central Khmer", code: "KH" },
                            { name: "Kirghiz", code: "KG" }, { name: "Korean", code: "KR" }, { name: "Kurdish", code: "TR" },
                            { name: "Lao", code: "LA" }, { name: "Latin", code: "VA" }, { name: "Latvian", code: "LV" },
                            { name: "Lithuanian", code: "LT" }, { name: "Luxembourgish", code: "LU" }, { name: "Malayalam", code: "IN" },
                            { name: "Marathi", code: "IN" }, { name: "Macedonian", code: "MK" }, { name: "Maltese", code: "MT" },
                            { name: "Mongolian", code: "MN" }, { name: "Maori", code: "NZ" }, { name: "Malay", code: "MY" },
                            { name: "Burmese", code: "MM" }, { name: "Nepali", code: "NP" }, { name: "Dutch", code: "NL" },
                            { name: "Norwegian", code: "NO" }, { name: "Occitan", code: "FR" }, { name: "Oriya", code: "IN" },
                            { name: "Panjabi", code: "IN" }, { name: "Polish", code: "PL" }, { name: "Portuguese", code: "PT" },
                            { name: "Pushto", code: "AF" }, { name: "Quechua", code: "PE" }, { name: "Romanian", code: "RO" },
                            { name: "Russian", code: "RU" }, { name: "Sanskrit", code: "IN" }, { name: "Sinhala", code: "LK" },
                            { name: "Slovak", code: "SK" }, { name: "Slovenian", code: "SI" }, { name: "Sindhi", code: "PK" },
                            { name: "Spanish", code: "ES" }, { name: "Albanian", code: "AL" }, { name: "Serbian", code: "RS" },
                            { name: "Sundanese", code: "ID" }, { name: "Swahili", code: "KE" }, { name: "Swedish", code: "SE" },
                            { name: "Syriac", code: "SY" }, { name: "Tamil", code: "IN" }, { name: "Tatar", code: "RU" },
                            { name: "Telugu", code: "IN" }, { name: "Tajik", code: "TJ" }, { name: "Tagalog", code: "PH" },
                            { name: "Thai", code: "TH" }, { name: "Tigrinya", code: "ER" }, { name: "Tonga", code: "TO" },
                            { name: "Turkish", code: "TR" }, { name: "Uighur", code: "CN" }, { name: "Ukrainian", code: "UA" },
                            { name: "Urdu", code: "PK" }, { name: "Uzbek", code: "UZ" }, { name: "Vietnamese", code: "VN" },
                            { name: "Yiddish", code: "IL" }, { name: "Yoruba", code: "NG" }
                        ].map((lang, idx) => (
                            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors cursor-default">
                                <Flag
                                    code={lang.code}
                                    style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }}
                                    fallback={<span className="inline-block w-5 h-4 bg-gray-300 rounded-sm"></span>}
                                />
                                {lang.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Input & Output Formats - Symmetrical & Visual */}
            <section className="w-full max-w-6xl mt-12 px-4 mb-16 text-center">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch text-left">
                        {/* Input Formats Card */}
                        <div className="bg-gray-50 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden group h-full">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Input Formats</h3>
                                </div>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Our engine handles a massive variety of formats, from standard images to compressed archives and multi-page documents.
                                </p>

                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Images & Scans</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['JPEG', 'PNG', 'TIFF', 'BMP', 'WEBP', 'GIF', 'HEIC', 'AVIF'].map(fmt => (
                                                <span key={fmt} className="px-2.5 py-1 bg-white border border-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                                                    {fmt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Documents & Archives</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['PDF Multi-page', 'DOCX', 'DJVU', 'GZIP', 'BZIP2', 'UNIX Compress'].map(fmt => (
                                                <span key={fmt} className="px-2.5 py-1 bg-white border border-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                                                    {fmt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Output Formats Card */}
                        <div className="bg-gray-50 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden group h-full">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors">
                                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Output Formats</h3>
                                </div>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Get your data exactly how you need it. From simple text to fully formatted reports, we deliver 99% accuracy.
                                </p>

                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Editable Formats</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Microsoft Word (DOC)', 'Excel (XLS)', 'Plain Text (TXT)', 'Searchable PDF', 'JSON'].map(fmt => (
                                                <span key={fmt} className="px-2.5 py-1 bg-white border border-green-100 text-green-700 text-xs font-semibold rounded-md">
                                                    {fmt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">AI & Specialized Reports</h4>
                                        <ul className="space-y-2">
                                            {[
                                                'Legal & Healthcare Documentation',
                                                'Manufacturing & Logistics Reports',
                                                'Financial & Banking Summaries'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center text-sm text-gray-600 gap-2">
                                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built by Experts */}
            <section className="w-full max-w-4xl mt-12 px-4 text-center">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50"></div>
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-700 ease-in-out"></div>
                    <div className="bg-red-700 bg-gradient-to-r from-red-600 to-red-700 p-8 md:p-10 rounded-3xl text-white text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Built by Industry Experts</h3>
                        <p className="text-white mb-4 max-w-2xl mx-auto">
                            OCR-Extraction.com is developed by <strong>Infy Galaxy</strong>, a team of AI professionals
                            dedicated to building reliable and user-centric tools.
                        </p>
                        <p className="text-white italic">
                            "Make digital text extraction fast, accurate, and accessible to everyone."
                        </p>
                    </div>
                </div>
            </section>

            {/* Try It Now CTA */}
            <CtaSection />
        </div>
    )
}
