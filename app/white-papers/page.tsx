"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    FileText,
    ArrowRight,
    Search,
    Filter,
    Download,
    BookOpen,
    Lock,
    Cpu,
    ShieldCheck,
    Globe
} from "lucide-react"

export default function WhitePapersPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="min-h-screen bg-white" />

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 pt-32 pb-16">
                <div className="container mx-auto px-6">
                    <motion.div {...fadeInUp} className="max-w-3xl">
                        <div className="text-red-600 font-bold text-xs uppercase tracking-[0.4em] mb-4">Enterprise Insights</div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                            AI Knowledge <span className="text-red-600">Repository</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            Access our library of technical research, implementation frameworks, and strategic white papers for enterprise artificial intelligence.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <section className="py-8 bg-white border-b border-slate-100 sticky top-20 z-30">
                <div className="container mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['All', 'Deep Tech', 'Automation', 'Governance', 'Infrastructure'].map((cat) => (
                            <button key={cat} className="px-5 py-2 white-nowrap rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:border-red-500 hover:text-red-600 transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {fullLibrary.map((wp, i) => (
                            <motion.div
                                key={i}
                                className="group relative bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                            >
                                {/* Premium Card Header/Visual */}
                                <div className="aspect-[16/9] bg-slate-950 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                        <img
                                            src={wp.image}
                                            alt={wp.title}
                                            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                    </div>
                                    <FileText className="w-12 h-12 text-white/20 group-hover:text-red-500/40 transition-colors duration-500 relative z-10 group-hover:scale-110 transition-transform" />
                                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[7px] font-bold text-white/40 uppercase tracking-[0.3em] font-mono z-20">
                                        <span>IF-GXP-00{i + 1}</span>
                                        <span>Secure Archive</span>
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest">{wp.category}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{wp.year}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-red-600 transition-colors italic uppercase">{wp.title}</h3>
                                    <p className="text-slate-500 text-base leading-relaxed line-clamp-3">
                                        {wp.description}
                                    </p>
                                    <div className="pt-8 mt-auto flex items-center justify-between border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                                            <Download className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise PDF</span>
                                        </div>
                                        <button className="flex items-center gap-3 text-red-600 font-bold text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                            Access Case <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Subscription */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
                    <BookOpen className="w-12 h-12 text-red-600 mx-auto" />
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Stay Ahead of the <span className="text-red-600 italic">Curve.</span></h2>
                    <p className="text-slate-400 text-lg">Receive quarterly deep-dives into emerging AI technologies and strategic frameworks directly in your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Professional Email"
                            className="flex-grow px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button className="px-8 py-4 bg-red-600 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

const fullLibrary = [
    {
        title: "The Future of RAG: Beyond Vector Search",
        category: "Deep Tech",
        year: "2026",
        description: "An analysis of advanced Knowledge Graph integration for improved model factuality and semantic depth in enterprise RAG pipelines.",
        image: "/services-images/OCR Extraction Website Archs/Documentation & Records.png"
    },
    {
        title: "Autonomous Agents in Logistics",
        category: "Automation",
        year: "2025",
        description: "Exploring multi-step task execution, tool use, and long-horizon planning for complex supply chain orchestration.",
        image: "/services-images/OCR Extraction Website Archs/Logistics & Supply Chain.png"
    },
    {
        title: "Financial AI Ethics & Compliance",
        category: "Governance",
        year: "2026",
        description: "A framework for algorithmic auditing, bias mitigation, and regulatory alignment in high-stakes financial environments.",
        image: "/services-images/OCR Extraction Website Archs/Banking & Financial Services.png"
    },
    {
        title: "Hybrid Cloud for High-Load AI",
        category: "Infrastructure",
        year: "2025",
        description: "Optimization strategies for inference-heavy enterprise applications across private and public cloud clusters.",
        image: "/services-images/OCR Extraction Website Archs/Telecom.png"
    },
    {
        title: "Sovereign AI: Data Residency Redefined",
        category: "Infrastructure",
        year: "2026",
        description: "A technical guide to local LLM deployment and VPC isolation for sensitive government and healthcare data.",
        image: "/services-images/OCR Extraction Website Archs/Health Care.png"
    },
    {
        title: "Generative Media & Brand Integrity",
        category: "Deep Tech",
        year: "2025",
        description: "Risk assessment and defensive protocols for synthetic voice and image generation in corporate communication.",
        image: "/services-images/OCR Extraction Website Archs/Hospitality.png"
    }
]
