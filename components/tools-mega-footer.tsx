"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toolCategories } from "@/lib/tools-data"
import { PdfIcon, WordIcon, ExcelIcon, PptIcon, ImageFileIcon } from "@/components/icons/file-type-icons"
import { ArrowRightMd as ArrowRight } from "react-coolicons"

const categoryIcons: Record<string, any> = {
    "PDF Tools": PdfIcon,
    "Word Tools": WordIcon,
    "Image Tools": ImageFileIcon,
    "Excel Tools": ExcelIcon,
    "PPT Tools": PptIcon,
    "Text Conversion Tools": WordIcon,
}

const categoryColors: Record<string, string> = {
    "PDF Tools": "bg-red-50 text-red-600 border-red-100",
    "Word Tools": "bg-blue-50 text-blue-600 border-blue-100",
    "Image Tools": "bg-purple-50 text-purple-600 border-purple-100",
    "Excel Tools": "bg-green-50 text-green-600 border-green-100",
    "PPT Tools": "bg-orange-50 text-orange-600 border-orange-100",
    "Text Conversion Tools": "bg-indigo-50 text-indigo-600 border-indigo-100",
}

export default function ToolsMegaFooter() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-[400px] w-full bg-white animate-pulse" />;

    if (!toolCategories || toolCategories.length === 0) {
        return (
            <div className="p-20 text-center text-red-500 bg-red-50 font-bold border-2 border-dashed border-red-200 m-8 rounded-3xl">
                [Alert] No tools found in lib/tools-data.ts
            </div>
        )
    }

    return (
        <section className="w-full bg-white border-t border-gray-100 py-20 md:py-32 relative z-[20] overflow-visible">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest border border-red-100 mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Enterprise Toolbox
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                        All Your <span className="text-red-600">Power Tools</span> <br /> In One Place
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Access over 30+ production-grade OCR and document conversion tools.
                        All free, secure, and ready to optimize your workflow.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-12">
                    {toolCategories.map((category) => {
                        const Icon = categoryIcons[category.name] || PdfIcon
                        const colorClass = categoryColors[category.name] || "bg-gray-50 text-gray-600 border-gray-100"

                        return (
                            <div key={category.name} className="flex flex-col">
                                {/* Category Title with Icon */}
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-100">
                                    <div className={`p-2 rounded-lg border ${colorClass} shadow-sm flex-shrink-0`}>
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-tight">
                                        {category.name.replace(' Tools', '')}
                                    </h3>
                                </div>

                                {/* Tools List */}
                                <ul className="space-y-3">
                                    {(category.items || []).map((tool) => (
                                        <li key={tool.href}>
                                            <Link
                                                href={tool.href}
                                                className="group flex items-center justify-between text-sm font-medium text-gray-600 hover:text-red-600 transition-all py-1"
                                            >
                                                <span className="truncate pr-2">{tool.label}</span>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                {/* Action CTA */}
                <div className="mt-20 text-center">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200 group active:scale-95"
                    >
                        View All 30+ Tools
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
