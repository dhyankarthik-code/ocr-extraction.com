"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Bot,
    Cpu,
    Layers,
    CheckCircle2,
    Brain,
    Search,
    ArrowRight,
    TrendingUp,
    BarChart3,
    Lock,
    MessageSquare,
    Video,
    ShieldAlert,
    ShoppingBag,
    Scale,
    Stethoscope,
    Terminal,
    AlertCircle,
    Lightbulb
} from "lucide-react"

export default function AISolutionsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="min-h-screen bg-white" />

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden bg-white border-b border-slate-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-20 translate-y-1/4 -translate-x-1/4"></div>

                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="lg:w-3/5 space-y-10"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* INCREASED FONT SIZE FOR HERO BADGE */}
                            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900 text-white font-black text-xs md:text-sm uppercase tracking-[0.4em]">
                                <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                                The 2026 AI Standard
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
                                Engineering <br />
                                <span className="text-red-600 underline decoration-red-100 decoration-8 underline-offset-12">Intelligence</span> <br />
                                For High-Load.
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-semibold">
                                We design and deploy custom AI automation systems that reduce operational overhead by 40% while 10x-ing your output speed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
                                {/* INCREASED FONT SIZE FOR BUTTONS */}
                                <Link
                                    href="/contact"
                                    className="px-14 py-7 bg-red-600 text-white font-black rounded-3xl shadow-2xl shadow-red-200 hover:bg-red-700 transition-all hover:scale-105 active:scale-95 text-center text-xl uppercase tracking-tighter"
                                >
                                    Consult an AI Architect
                                </Link>
                                <Link
                                    href="#services"
                                    className="px-14 py-7 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all text-center text-xl uppercase tracking-tighter"
                                >
                                    Explore Our Stack
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-2/5 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden shadow-2xl p-1 bg-gradient-to-tr from-red-600 via-slate-900 to-blue-900 animate-gradient-slow">
                                <div className="h-full w-full bg-slate-950 rounded-[3.8rem] flex flex-col items-center justify-center p-12 text-center border border-white/5 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#EF4444_0%,_transparent_70%)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <div className="w-24 h-24 bg-red-600/10 rounded-3xl flex items-center justify-center mb-8 border border-red-600/20 shadow-2xl shadow-red-500/20">
                                        <Cpu className="w-12 h-12 text-red-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Neural Backbone</h3>
                                    <p className="text-slate-400 text-lg font-bold tracking-widest uppercase">Proprietary AI Ecosystem</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SERVICES GRID (INCREASED TAG SIZES) --- */}
            <section id="services" className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center mb-20 space-y-4">
                    <motion.div {...fadeInUp}>
                        <div className="text-red-600 font-black text-sm uppercase tracking-[0.5em] mb-4">Core AI Service Suite</div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Enterprise <span className="text-red-600 font-serif italic">Intelligence</span> Modules
                        </h2>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {expandedServices.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(239,68,68,0.12)] hover:border-red-100 transition-all duration-700 group relative overflow-hidden flex flex-col"
                            {...fadeInUp}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm border border-slate-50 group-hover:bg-red-50 group-hover:-rotate-6 transition-all duration-500">
                                <item.icon className="w-10 h-10 text-slate-400 group-hover:text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-red-600 transition-colors leading-tight">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed mb-auto text-lg font-medium">
                                {item.description}
                            </p>
                            {/* REASONABLY INCREASED TAGS AS SHOWN IN SCREENSHOT */}
                            <div className="flex flex-wrap gap-3 mt-10">
                                {item.tags.map((tag, j) => (
                                    <span key={j} className="text-xs md:text-[13px] font-black text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 uppercase tracking-widest group-hover:border-red-100 group-hover:text-red-600 transition-all">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- PROBLEM & SOLUTION SECTION --- */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {problems.map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col md:flex-row gap-10 bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-16 hover:bg-white/10 transition-all duration-500 group"
                                {...fadeInUp}
                            >
                                <div className="md:w-1/2 space-y-8">
                                    <div className="flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-6 h-6" />
                                        <span className="text-base font-black uppercase tracking-[0.4em] font-mono">The Friction</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black leading-none tracking-tighter transition-transform uppercase italic">{item.problemTitle}</h3>
                                    <p className="text-slate-400 text-xl font-medium leading-relaxed">{item.problemText}</p>
                                </div>
                                <div className="hidden md:block w-px bg-white/10 self-stretch"></div>
                                <div className="md:w-1/2 space-y-8 pt-10 md:pt-0">
                                    <div className="flex items-center gap-3 text-green-500">
                                        <Lightbulb className="w-6 h-6" />
                                        <span className="text-base font-black uppercase tracking-[0.4em] font-mono">The Intelligence</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white uppercase italic">{item.solutionTitle}</h3>
                                    <p className="text-slate-300 text-xl font-medium leading-relaxed italic">"{item.solutionText}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-40 bg-white px-6">
                <motion.div
                    className="container mx-auto max-w-7xl bg-red-600 rounded-[6rem] p-20 md:p-32 text-center text-white relative overflow-hidden group shadow-2xl"
                    {...fadeInUp}
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[150px] transition-all group-hover:scale-150 duration-1000"></div>
                    <div className="relative z-10 space-y-12">
                        <h2 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter">
                            Ready to Architect <br /> <span className="underline decoration-white/30 underline-offset-16 italic">Your Growth.</span>
                        </h2>
                        <div className="pt-10">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-6 px-20 py-10 bg-white text-red-600 font-black rounded-3xl hover:bg-slate-900 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-3xl text-2xl uppercase tracking-widest"
                            >
                                Launch Discovery Session
                                <ArrowRight className="w-10 h-10" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

const expandedServices = [
    {
        title: "LLM APIs for Chatbots",
        description: "Custom endpoints for conversational agents, real-time content generation, and deep semantic search indexing.",
        icon: MessageSquare,
        tags: ["GPT-4o", "Cluade 3", "Llama 3.1", "Semantic Search"]
    },
    {
        title: "Intelligent AI + RPA Automation",
        description: "Combining Cognitive AI with Robotic Process Automation for end-to-end workflow and document optimization.",
        icon: Layers,
        tags: ["Workflow Ops", "Cognitive OCR", "RPA Bridge", "Auto-ERP"]
    },
    {
        title: "Generative Media Engine",
        description: "Enterprise solutions for AI-powered high-fidelity image generation, professional video, and synthetic voice creation.",
        icon: Video,
        tags: ["Stable Diffusion", "Sora", "ElevenLabs", "Visual Gen"]
    },
    {
        title: "Domain-Specific AI Verticals",
        description: "Tailored neural networks for high-compliance Healthcare, Legal, Finance, and Civil Engineering use cases.",
        icon: Stethoscope,
        tags: ["HIPAA Ready", "Fin-Tuned", "Legal Reasoning", "BIM AI"]
    },
    {
        title: "Predictive Behavior Modeling",
        description: "Predictive analytics systems that model customer churn, demand forecasting, and market shift detection.",
        icon: BarChart3,
        tags: ["Churn Prediction", "Forecasting", "ML Modeling", "Insights"]
    },
    {
        title: "AI-Powered Cybersecurity",
        description: "Next-gen fraud detection and adaptive security systems that prevent zero-day attacks and account takeovers.",
        icon: ShieldAlert,
        tags: ["Fraud Detection", "Threat Hunting", "Anomaly AI", "SecOps"]
    },
    {
        title: "E-commerce Personalization",
        description: "Hyper-personalization engines that drive conversion via real-time recommendation and dynamic media mapping.",
        icon: ShoppingBag,
        tags: ["RecEngines", "Dynamic Pricing", "User Intent", "Retail AI"]
    },
    {
        title: "Autonomous Multi-step Agents",
        description: "AI agents capable of multi-step task execution, tool use, and long-horizon planning for complex operations.",
        icon: Bot,
        tags: ["Agentic AI", "Task Planning", "Auto-Execute", "Auto-Feedback"]
    },
    {
        title: "Developer AI Tools",
        description: "Speed up development cycles with custom AI assistants for coding, deep debugging, and automated model deployment.",
        icon: Terminal,
        tags: ["Code Gen", "Bug Hunting", "Model Ops", "CI/CD AI"]
    },
    {
        title: "AI Governance & Audit",
        description: "Compliance-first solutions for AI risk management, bias auditing, and regulatory alignment for enterprises.",
        icon: Scale,
        tags: ["Risk Mgmt", "Bias Audit", "Compliance", "Ethical AI"]
    }
]

const problems = [
    {
        problemTitle: "Information Silos",
        problemText: "Valuable enterprise knowledge is locked in PDFs, Emails, and manual spreadsheets that don't talk to each other.",
        solutionTitle: "Unified Knowledge Graph",
        solutionText: "We build a RAG-powered central brain that indexes all unstructured data for instant AI-driven querying."
    },
    {
        problemTitle: "Scaling Bottlenecks",
        problemText: "Growing businesses face linear cost increases as more humans are needed for routine data tasks.",
        solutionTitle: "Agentic Automation",
        solutionText: "Autonomous AI agents handle 80% of routine workflows with zero human intervention."
    }
]
