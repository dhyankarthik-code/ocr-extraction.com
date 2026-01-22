"use client"

import Link from "next/link"
import Image from "next/image"
import { toolCategories } from "@/lib/tools-data"
import {
    Heart01 as Heart,
    FileDocument as FileText,
    Settings as Wrench,
    BookOpen,
    Info,
    Mail,
    Note as Newspaper
} from "react-coolicons"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Upper Section: Tools */}
                <div className="mb-12">
                    <h3 className="text-white font-bold mb-8 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-3 md:gap-3 text-center md:text-left">
                        <Wrench className="w-10 h-10 md:w-8 md:h-8 flex-shrink-0" />
                        <span className="text-lg md:text-2xl leading-tight">File Format Conversion Tools for Documentation and Digital Record Keeping</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {toolCategories.map((category) => (
                            <div key={category.name}>
                                <h4 className="text-white font-bold uppercase tracking-wider mb-3">
                                    {category.name}
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    {category.items.map((tool) => (
                                        <li key={tool.label}>
                                            <Link href={tool.href} className="hover:text-red-500 transition-colors">
                                                {tool.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {/* All Tools Link */}
                    <div className="mt-6 text-center md:text-left">
                        <Link href="/tools" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors">
                            View All Tools <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">&rarr;</div>
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Lower Section: Brand & Nav Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative h-9 w-fit">
                                <Image
                                    src="/logo.png"
                                    alt="Infy Galaxy Logo"
                                    height={36}
                                    width={0}
                                    style={{ width: 'auto', height: '100%' }}
                                    sizes="100vw"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col items-center leading-none mt-2">
                                <span className="text-xl font-bold text-red-600">
                                    InfyGalaxy
                                </span>
                                <div className="h-[1px] w-full bg-red-600 my-0.5" />
                                <span className="text-[8px] font-light text-red-600 tracking-[0.3em] uppercase">
                                    "Shaping AI Tools"
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">
                            Free OCR Extraction and Report Generation Tool
                        </p>
                        <p className="text-xs text-gray-400">
                            The Necessary Tool For OCR Data Extraction – Go Beyond Extraction and Generate Reports, AI Summary, and Download in Various Formats
                        </p>
                    </div>

                    {/* OCR */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            OCR
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about-ocr/" className="hover:text-red-500 transition-colors">
                                    About OCR
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Blog */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Newspaper className="w-4 h-4" />
                            Blog
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/blog" className="hover:text-red-500 transition-colors">
                                    Latest Updates
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Company
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/mission/" className="hover:text-red-500 transition-colors">
                                    Our Mission
                                </Link>
                            </li>
                            <li>
                                <Link href="/company-profile/" className="hover:text-red-500 transition-colors">
                                    Company Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/about/" className="hover:text-red-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faqs" className="hover:text-red-500 transition-colors">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services - NEW SECTION */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/services/" className="hover:text-red-500 transition-colors">
                                    Our Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support / Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Support
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact/" className="hover:text-red-500 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback/" className="hover:text-red-500 transition-colors">
                                    Feedback is appreciated
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy/" className="hover:text-red-500 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms/" className="hover:text-red-500 transition-colors">
                                    Terms and Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} InfyGalaxy. All rights reserved.
                    </p>
                    {/* Privacy Policy and Terms of Service removed */}
                </div>
            </div>
        </footer >
    )
}
