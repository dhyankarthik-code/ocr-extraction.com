"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import Flag from 'react-world-flags'
import SmartUploadZone from "@/components/smart-upload-zone"
import CtaSection from "@/components/cta-section"

// Lazy load TypeAnimation for better performance
const TypeAnimation = dynamic(
    () => import('react-type-animation').then(mod => mod.TypeAnimation),
    { ssr: false }
)

export default function HomePage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-8 w-full" data-hydrated={mounted}>
            <div className="w-full max-w-2xl">
                <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center text-balance">
                    {/* SEO H1 (Visually Hidden but accessible to crawlers) */}
                    <h1 className="text-gray-900 text-center relative w-full min-h-[8rem] md:min-h-[7rem] flex items-center justify-center">
                        <span className="sr-only">Free OCR Extraction Tool - Convert Images to Text, Excel & PDF</span>

                        {!mounted && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                Free OCR Extraction tool
                            </span>
                        )}

                        <TypeAnimation
                            sequence={[
                                'Free OCR Extraction tool',
                                2500,
                                'Free OCR Extraction tool and Report Generation Tool',
                                2500,
                            ]}
                            wrapper="span"
                            speed={15}
                            style={{ display: mounted ? 'inline-block' : 'none' }}
                            repeat={Infinity}
                        />
                    </h1>
                </div>


                <p className="text-sm md:text-base text-gray-500 text-center mb-8 text-balance">
                    The Necessary Tool For OCR Data Extraction – Go Beyond Extraction and Generate Reports, AI Summary, and Download in Various Formats
                </p>

                <SmartUploadZone />

            </div>

            {/* Welcome Section */}
            <section className="w-full max-w-5xl mt-20 px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome to <span className="text-red-500">OCR-Extraction.com</span>
                    </h2>
                    <div className="mt-8 text-center text-sm text-gray-500">
                        {/* <p>© {new Date().getFullYear()} Free OCR Tool. All rights reserved.</p> */}
                    </div>
                    <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
                        The World's "Most Accurate OCR" Tool for Free
                    </p>
                    <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Convert your images, scanned documents, and PDFs into clean, editable text in seconds.
                        OCR-Extraction.com is engineered with advanced AI technology to deliver <strong>95–100% accuracy</strong>,
                        lightning-fast processing, and zero data loss — all completely free.
                    </p>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Whether you're a student, professional, or business user, our powerful OCR engine helps you
                        extract text instantly without the need for any installations or subscriptions.
                    </p>
                </div>
            </section>

            {/* Why Users Trust Us */}
            <section className="w-full max-w-6xl mt-16 px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Users Trust OCR-Extraction.com
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            Desktop, laptop, tablet, or smartphone — OCR-Extraction.com adapts to every screen
                            for a seamless user experience.
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
            </section>

            {/* What You Can Do */}
            <section className="w-full max-w-4xl mt-20 px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                    What You Can Do With OCR-Extraction.com
                </h3>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                    <ul className="grid md:grid-cols-2 gap-4">
                        {[
                            "Convert images (.jpg, .png, .jpeg) to text",
                            "Extract text from PDFs and scanned documents",
                            "Convert tables and structured data into Excel",
                            "Summarize long or complex documents instantly",
                            "Digitize notes, invoices, medical reports, legal papers",
                            "Create searchable document archives",
                            "Use it for education, business, research, analytics"
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
            </section>

            {/* We Are Available in Other Languages */}
            <section className="w-full max-w-5xl mt-24 px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                    We Are Available in Other Languages
                </h3>
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
            <section className="w-full max-w-6xl mt-16 px-4 mb-20">
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Input Formats Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col relative overflow-hidden group h-full">
                        <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                        <div className="p-8 md:p-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
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
                                            <span key={fmt} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                                                {fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Documents & Archives</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['PDF Multi-page', 'DOCX', 'DJVU', 'GZIP', 'BZIP2', 'UNIX Compress'].map(fmt => (
                                            <span key={fmt} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                                                {fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mt-4">
                                    <p className="text-sm text-gray-600 italic">
                                        "We also process compressed screenshots from WhatsApp, Instagram, and other social platforms automatically."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Formats Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-green-50/50 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 flex flex-col relative overflow-hidden group h-full">
                        <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                        <div className="p-8 md:p-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
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
                                            <span key={fmt} className="px-2.5 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-md">
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

                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 mt-4 flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-sm text-gray-700 font-medium">
                                        Includes automatic AI Summaries & Smart Formatting
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built by Experts */}
            <section className="w-full max-w-4xl mt-20 px-4">
                <div className="bg-red-700 bg-gradient-to-r from-red-600 to-red-700 p-8 md:p-12 rounded-2xl text-white text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Built by Industry Experts</h3>
                    <p className="text-white mb-4 max-w-2xl mx-auto">
                        OCR-Extraction.com is developed by <strong>Infy Galaxy</strong>, a team of AI professionals
                        dedicated to building reliable and user-centric tools.
                    </p>
                    <p className="text-white italic">
                        "Make digital text extraction fast, accurate, and accessible to everyone."
                    </p>
                </div>
            </section>

            {/* Try It Now CTA */}
            <CtaSection />
        </div>
    )
}
