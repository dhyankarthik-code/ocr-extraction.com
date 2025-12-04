"use client"

import Link from "next/link"
import { Heart, FileText, Wrench, BookOpen, Info } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="FreeOCR Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold text-white">FreeOCR</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Convert images into readable and editable documents with AI precision.
                        </p>
                    </div>

                    {/* About Us */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            About Us
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-red-500 transition-colors">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/about#team" className="hover:text-red-500 transition-colors">
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link href="/about#mission" className="hover:text-red-500 transition-colors">
                                    Mission
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* OCR & Tools */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            OCR & Tools
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-red-500 transition-colors">
                                    Free OCR
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools" className="hover:text-red-500 transition-colors">
                                    Image Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools#converter" className="hover:text-red-500 transition-colors">
                                    Format Converter
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools#resources" className="hover:text-red-500 transition-colors">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Blog & Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/blog" className="hover:text-red-500 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog#guides" className="hover:text-red-500 transition-colors">
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog#tutorials" className="hover:text-red-500 transition-colors">
                                    Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-red-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} FreeOCR. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="hover:text-red-500 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-red-500 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
