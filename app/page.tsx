"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import SmartUploadZone from "@/components/smart-upload-zone"
import CtaSection from "@/components/cta-section"

// Lazy load TypeAnimation for better performance
const TypeAnimation = dynamic(
  () => import('react-type-animation').then(mod => mod.TypeAnimation),
  { ssr: false }
)

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 w-full" data-hydrated={mounted}>
      <div className="w-full max-w-2xl">
        <div className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-center text-balance min-h-[4rem] flex items-center justify-center">
          {/* SEO H1 (Visually Hidden but accessible to crawlers) */}
          <h1 className="text-gray-900 text-center relative overflow-hidden w-full">
            <span className="sr-only">Free OCR Extraction Tool - Convert Images to Text, Excel & PDF</span>

            {!mounted && (
              <span className="absolute inset-0 flex items-center justify-center">
                Free OCR Extraction tool
              </span>
            )}

            <TypeAnimation
              sequence={[
                'Free OCR Extraction tool',
                1000,
                'Free OCR Extraction tool and Report Generation Tool',
                1000,
              ]}
              wrapper="span"
              speed={50}
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
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Built by Experts */}
      <section className="w-full max-w-4xl mt-20 px-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 md:p-12 rounded-2xl text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Built by Industry Experts</h3>
          <p className="text-white/90 mb-4 max-w-2xl mx-auto">
            OCR-Extraction.com is developed by <strong>Infy Galaxy</strong>, a team of AI professionals
            dedicated to building reliable and user-centric tools.
          </p>
          <p className="text-white/80 italic">
            "Make digital text extraction fast, accurate, and accessible to everyone."
          </p>
        </div>
      </section>

      {/* Try It Now CTA */}
      <CtaSection />
    </div>
  )
}
