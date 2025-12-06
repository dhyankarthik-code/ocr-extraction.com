"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState } from "react"
import AuthModal from "@/components/auth-modal"

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

                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Ease of Use</h2>
                        <p className="text-gray-700">
                            Anyone who has a basic internet can use our service from any part of the world, people from all walks of life can use our service whether it is students, researchers, housewives, financial executives, sales executives, or any one who wants to get their data from their image.
                        </p>
                    </div>

                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 uppercase">Input Galaxy OCR – Absolutely Free?</h2>
                        <h3 className="text-xl font-semibold text-gray-800">Infy Galaxy OCR – Free Version: Smart, Fast & Accurate AI-Powered Text Extraction</h3>
                        <p className="text-gray-700">
                            Infy Galaxy OCR – Free Version is a very powerful, free online OCR (Optical Character Recognition) solution / tool designed to extract text from images with exceptional accuracy. This tool's speciality is that it has the ability to extract data even from blurred or difficult images. Built on advanced AI and Vision Large Language Model (VLM) technology, it effortlessly converts scanned documents, photos, screenshots, PDFs, and handwritten notes into editable, reportable, and searchable text with the feature where the extracted content can be downloaded in the format required by the user such as Word or PDF or Text. Artificial Intelligence based summary is also available and other value addition where reports can be generated from the extracted data or text.
                        </p>
                        <p className="text-gray-700">
                            The system supports major international languages and a wide range of file formats such as PNG, WebP, JPEG, JPG, PDF, TIFF, and other formats as well making it a versatile choice for students, professionals, researchers, fiance executives, sales executives, doctors, and any businesses. Infy Galaxy OCR intelligently preserves the original formatting—including line breaks, spacing, and structure—ensuring clean, ready-to-use output every time.
                        </p>
                        <p className="text-gray-700">
                            With ultra-fast processing, cloud-based performance, and industry-leading accuracy, Infy Galaxy OCR – Free Version gives users a simple and reliable way to digitize content without installing any software. Whether you're digitizing documents, extracting text for translations, or converting images into editable content, Infy Galaxy OCR provides unmatched quality at zero cost.
                        </p>
                    </div>

                    <div className="mt-12 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">How to Use Infy Galaxy OCR - Absolutely Free (Step-by-Step Guide)</h2>
                        <p className="text-gray-700">
                            Infy Galaxy OCR is designed for greater accuracy or near precise text extraction. Whether you're converting scanned documents, photos, PDFs, handwritten notes or from any image, the process takes only a few seconds. Follow this simple guide to get high-accuracy OCR results instantly.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">1. Upload Your Image File</h3>
                                <p className="text-gray-700">Start by uploading the file you want to convert. You can either:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                    <li>Click the upload dropzone, or</li>
                                    <li>Drag and drop your image directly into the box</li>
                                </ul>
                                <p className="mt-3 text-sm text-gray-600">
                                    Infy Galaxy OCR supports multiple formats including JPG, PNG, JPEG, BMP, TIFF, PDF, and more, ensuring maximum flexibility for different types of documents and images.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">2. Click "Extract Text" Or Use Summarize or Search Content or "Generate Report"</h3>
                                <p className="text-gray-700">
                                    After the upload, hit the Extract Text button. Our advanced Vision Large Language Model (VLM) instantly analyzes your file, recognizes characters with exceptional precision, and converts the content into editable text. The processing takes only a few seconds even for complex layouts or multilingual information.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">3. Copy or Download Your OCR Output</h3>
                                <p className="text-gray-700">Once the text extraction is complete, your results will be displayed on the screen. You can:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                    <li>Copy the extracted text to your clipboard, or</li>
                                    <li>Download the text as a .txt file or other formats for offline use.</li>
                                </ul>
                                <p className="mt-3 text-sm text-gray-600">
                                    Once the converted file is downloaded, you can share it through apps, documents, emails or use the extracted information for research and for any other purpose.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Why This Process Is So Fast and Accurate</h2>
                        <p className="text-gray-700">
                            Infy Galaxy OCR uses cutting-edge AI and Vision-LLM technology. This allows it to read text with high accuracy and handle everything from handwriting to scanned PDFs due to which the the extracted text is clean and clear and ease of use.
                        </p>
                    </div>

                    <div className="mt-16 border-t pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {[
                                { q: "Is Infy Galaxy OCR completely free?", a: "Yes. You can extract text from images at zero cost, with no software installation required." },
                                { q: "What file types does FreeOCR.AI support?", a: "JPG, PNG, JPEG, PDF, TIFF, BMP, Web P and more." },
                                { q: "Can it extract text from handwriting?", a: "Yes. Thanks to advanced AI models, Infy Galaxy OCR can recognize both printed and handwritten text." },
                                { q: "Is my uploaded data safe?", a: "Files are processed online securely and are not stored permanently. Once the data is extracted, the original file uploaded is deleted to ensure that we don't retain the copy of the file." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                                    <p className="text-gray-700">{faq.a}</p>
                                </div>
                            ))}
                        </div>
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
