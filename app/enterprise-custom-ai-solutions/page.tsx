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
    Lightbulb,
    Quote,
    FileText,
    ExternalLink,
    Zap,
    Users
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
            <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white border-b border-slate-50">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-[100px] opacity-25 -translate-y-1/2 translate-x-1/4"></div>

                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            className="lg:w-3/5 space-y-8"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/5 text-slate-900 font-bold text-xs uppercase tracking-[0.3em] border border-slate-200">
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                Enterprise Grade
                            </div>
                            <h1 className="text-4xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                                Architecting <br />
                                <span className="text-red-600">Enterprise AI</span> <br />
                                Solutions.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                                Deep-tech consulting for high-load document extraction, autonomous agent workflows, and sovereign AI deployment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all hover:-translate-y-0.5 active:scale-95 text-center text-lg uppercase tracking-tight"
                                >
                                    Consult an Architect
                                </Link>
                                <Link
                                    href="#services"
                                    className="px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all text-center text-lg uppercase tracking-tight"
                                >
                                    View Solutions
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-2/5 relative hidden lg:block"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl p-0.5 bg-gradient-to-tr from-red-500/20 to-slate-900/10">
                                <div className="h-full w-full bg-slate-950 rounded-[2.4rem] flex flex-col items-center justify-center p-10 text-center border border-white/5 relative group overflow-hidden">
                                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 border border-red-600/20">
                                        <Cpu className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase italic font-display">Neural Engine</h3>
                                    <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Verified Deployment 2.0</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SERVICES GRID --- */}
            <section id="services" className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center mb-16 space-y-3">
                    <motion.div {...fadeInUp}>
                        <div className="text-red-600 font-bold text-xs uppercase tracking-[0.4em] mb-2">Capabilities Registry</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            Enterprise <span className="text-red-600 italic">Solution</span> Catalog
                        </h2>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {expandedServices.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-red-100 transition-all duration-500 group relative flex flex-col"
                            {...fadeInUp}
                            transition={{ delay: i * 0.03 }}
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-50 group-hover:bg-red-50 transition-colors">
                                <item.icon className="w-8 h-8 text-slate-400 group-hover:text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">{item.title}</h3>
                            <p className="text-slate-500 text-base leading-relaxed mb-auto">
                                {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-8">
                                {item.tags.map((tag, j) => (
                                    <span key={j} className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest group-hover:border-red-50 group-hover:text-red-500 transition-all">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- PROBLEM & SOLUTION SECTION --- */}
            <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The <span className="text-red-600">Cognitive</span> Gap</h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Bridging the distance between legacy data and intelligent automation.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-10">
                        {problems.map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col md:flex-row gap-8 bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all duration-500 group"
                                {...fadeInUp}
                            >
                                <div className="md:w-1/2 space-y-5">
                                    <div className="flex items-center gap-2.5 text-red-500">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono opacity-60">Legacy Challenge</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase italic">{item.problemTitle}</h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{item.problemText}</p>
                                </div>
                                <div className="hidden md:block w-px bg-white/5 self-stretch"></div>
                                <div className="md:w-1/2 space-y-5 pt-8 md:pt-0">
                                    <div className="flex items-center gap-2.5 text-green-500">
                                        <Lightbulb className="w-5 h-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono opacity-60">AI Solution</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">{item.solutionTitle}</h3>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed italic opacity-80">"{item.solutionText}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CASE STUDIES / SUCCESS STORIES --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <div className="text-red-600 font-bold text-xs uppercase tracking-[0.4em]">Success Stories</div>
                            <h2 className="text-3xl md:text-6xl font-bold text-slate-900 tracking-tight">Impact <span className="text-red-600">Metrics.</span></h2>
                        </div>
                        <p className="text-slate-500 max-w-md text-lg font-medium">Quantifiable results from our most recent enterprise AI deployments.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {caseStudies.map((cs, i) => (
                            <motion.div
                                key={i}
                                className="group relative bg-[#F8FAFC] rounded-[3rem] border border-slate-100 overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-500"
                                {...fadeInUp}
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={cs.image}
                                        alt={cs.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute top-6 left-6 flex items-start justify-between w-[calc(100%-3rem)]">
                                        <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">{cs.industry}</span>
                                        <TrendingUp className="w-8 h-8 text-white filter drop-shadow-md" />
                                    </div>
                                </div>
                                <div className="p-10 md:p-14">
                                    <h3 className="text-3xl font-bold text-slate-900 mb-6">{cs.title}</h3>
                                    <p className="text-slate-600 text-lg mb-10 leading-relaxed italic border-l-4 border-red-600 pl-6">{cs.objective}</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        {cs.metrics.map((m, j) => (
                                            <div key={j} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                <div className="text-3xl font-bold text-red-600 mb-1">{m.value}</div>
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <Quote className="w-12 h-12 text-red-600 mx-auto mb-6 opacity-20" />
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Voice of the <span className="text-red-600">Enterprise</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 italic text-slate-600 leading-relaxed relative"
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-serif text-3xl font-bold">"</div>
                                "{t.quote}"
                                <div className="mt-8 not-italic">
                                    <div className="font-bold text-slate-900 uppercase tracking-widest text-xs">{t.author}</div>
                                    <div className="text-[10px] text-red-600 font-bold uppercase tracking-[0.2em] mt-1">{t.position}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- WHITE PAPERS / INSIGHTS --- */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Abstract Background Visual */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
                        <div className="max-w-xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Zap className="w-3 h-3" /> Latest Research
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">AI <span className="text-red-600 italic">Technical</span> Papers</h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed">Deep dives into the technical architecture and ethical governance of enterprise-scale models. Verified by InfyGalaxy Architects.</p>
                        </div>
                        <Link href="/white-papers" className="group px-10 py-5 bg-slate-900 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-3 shadow-xl hover:shadow-red-200">
                            Browse Full Library <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whitePapers.map((wp, i) => (
                            <motion.div
                                key={i}
                                className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-950 flex flex-col justify-end border border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500"
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                            >
                                {/* Background Image Visual */}
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                    <img
                                        src={wp.image}
                                        alt={wp.title}
                                        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-transparent to-slate-900/60"></div>
                                </div>

                                <div className="relative z-10 p-10 space-y-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-32">
                                    <div className="flex items-center justify-between">
                                        <div className="text-red-500 font-bold text-[10px] uppercase tracking-widest">{wp.year}</div>
                                        <div className="text-white/40 font-bold text-[10px] uppercase tracking-widest">{wp.category}</div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight transition-transform group-hover:-translate-y-1">{wp.title}</h3>
                                    <p className="text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 line-clamp-2 h-0 group-hover:h-auto">{wp.description}</p>
                                    <Link href="/white-papers" className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest pt-4 border-t border-white/10 group-hover:text-red-500 transition-colors">
                                        Download Full Paper <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION for SEO --- */}
            <section className="py-28 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <div className="text-red-600 font-black text-xs uppercase tracking-[0.5em]">Central Intelligence</div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Enterprise <span className="text-red-600">Q&A</span></h2>
                        <p className="text-slate-500 text-lg font-medium">Critical answers for technical leaders and decision founders.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 max-w-6xl mx-auto">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-red-100 hover:shadow-md transition-all group"
                                {...fadeInUp}
                                transition={{ delay: i * 0.05 }}
                            >
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-start gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">Q</span>
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-12">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link href="/contact" className="text-slate-900 font-bold uppercase tracking-widest text-xs border-b-2 border-red-600 pb-1 hover:text-red-600 transition-colors">
                            Have more specific technical questions? Contact an Architect
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SCHEMA MARKUP --- */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "AI Solutions & Custom AI Development",
                        "serviceType": "Artificial Intelligence Consulting",
                        "provider": {
                            "@type": "Organization",
                            "name": "InfyGalaxy",
                            "url": "https://ocr-extraction.com"
                        },
                        "description": "Bespoke AI solutions including LLM APIs, Intelligent Automation (RPA + AI), Generative Media, and Domain-Specific AI.",
                        "areaServed": "Worldwide",
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "AI Services",
                            "itemListElement": expandedServices.map(s => ({
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": s.title
                                }
                            }))
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(f => ({
                            "@type": "Question",
                            "name": f.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.answer
                            }
                        }))
                    })
                }}
            />

            {/* --- FINAL CTA --- */}
            <section className="py-24 bg-white px-6">
                <motion.div
                    className="container mx-auto max-w-5xl bg-red-600 rounded-[3rem] p-14 md:p-20 text-center text-white relative overflow-hidden group shadow-xl"
                    {...fadeInUp}
                >
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                            Scale Your Operations <br /> <span className="underline decoration-white/20 underline-offset-8 italic">With Intelligence.</span>
                        </h2>
                        <div className="pt-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-lg text-lg uppercase tracking-wider"
                            >
                                Start Discovery Session
                                <ArrowRight className="w-6 h-6" />
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

const faqs = [
    {
        question: "What industries can benefit from your custom AI solutions?",
        answer: "Our AI solutions serve high-compliance sectors including Healthcare (HIPAA compliant automation), Legal (Reasoning models), Finance (Fraud detection), and Manufacturing (Predictive maintenance)."
    },
    {
        question: "How long does it take to deploy a custom LLM solution?",
        answer: "Initial pilot deployments typically take 4–6 weeks. Complex enterprise-wide integrations with full RAG-pipeline development usually span 3–5 months depending on the data scale."
    },
    {
        question: "Do you offer on-premise AI deployment for high security?",
        answer: "Yes, we specialize in 'Sovereign AI' where we deploy models on-premise or in your private VPC to ensure 100% data residency and security."
    },
    {
        question: "How does InfyGalaxy ensure AI security and data privacy?",
        answer: "We implement multi-layered security including SOC2 compliance, end-to-end encryption (AES-256), and PII masking. For highly sensitive data, we use Air-Gapped LLM deployments."
    },
    {
        question: "Can your AI solutions integrate with legacy ERP and CRM systems?",
        answer: "Absolutely. We build custom API bridges and middleware that allow our AI agents to read and write data across SAP, Oracle, Salesforce, and proprietary legacy databases."
    },
    {
        question: "What is the difference between your custom models and simple API calls to OpenAI?",
        answer: "While public APIs are general-purpose, our solutions use Domain-Specific fine-tuning, RAG (Retrieval-Augmented Generation) with your private data, and custom reward models to eliminate hallucinations."
    },
    {
        question: "How do you handle 'hallucinations' in enterprise AI?",
        answer: "We use a 'Dual-Check' architecture where a secondary reasoning model verifies the primary model's output against your verified knowledge base before presenting it to the user."
    },
    {
        question: "Is your AI infrastructure compliant with international standards?",
        answer: "Yes, every deployment can be configured for GDPR, HIPAA, and CCPA compliance, including automated data deletion and audit logging for regulatory transparency."
    },
    {
        question: "Do you provide training for our internal staff during hand-off?",
        answer: "Yes, we provide comprehensive documentation, workshops, and ongoing support to ensure your technical and non-technical teams can manage the AI ecosystem effectively."
    },
    {
        question: "What is the scalability limit for your high-load AI systems?",
        answer: "Our systems use distributed inference clusters (vLLM/TGI) that scale horizontally. We have successfully managed systems processing hundreds of thousands of documents per hour."
    },
    {
        question: "Can your AI agents perform multi-step cross-tool operations?",
        answer: "Yes, our agentic workflows use Function Calling to interact with web browsers, databases, and third-party SaaS tools to execute complex, multi-stage business tasks."
    },
    {
        question: "How do you measure the ROI of an AI implementation?",
        answer: "We provide real-time dashboards tracking 'Human-hours Saved,' 'Processing Throughput,' and 'Error Rate Reduction' (accuracy delta) to provide clear financial metrics."
    },
    {
        question: "What pricing models do you offer for enterprise AI?",
        answer: "We offer flexible models including 'Project-based' (fixed cost), 'Dedicated Team' (monthly), and 'Usage-based' (token or throughput limited) to fit different budget cycles."
    },
    {
        question: "Do you offer post-deployment maintenance and updates?",
        answer: "Yes, we provide ModelOps (Maintenance for ML) which includes periodic fine-tuning on new data, security patching, and model performance monitoring."
    },
    {
        question: "Can we start with a small Pilot before full-scale integration?",
        answer: "We highly recommend a 'Discovery & Pilot' phase (4 weeks) to prove the technical feasibility and ROI before scaling to a multi-departmental deployment."
    }
]

const whitePapers = [
    {
        title: "The Future of RAG: Beyond Vector Search",
        category: "Deep Tech",
        year: "2026",
        description: "An analysis of advanced Knowledge Graph integration for improved model factuality.",
        image: "/services-images/OCR Extraction Website Archs/Documentation & Records.png"
    },
    {
        title: "Autonomous Agents in Logistics",
        category: "Automation",
        year: "2025",
        description: "A study on multi-step task execution in supply chain optimization.",
        image: "/services-images/OCR Extraction Website Archs/Logistics & Supply Chain.png"
    },
    {
        title: "Financial AI Ethics & Compliance",
        category: "Governance",
        year: "2026",
        description: "Audit frameworks for preventing bias in credit scoring algorithms.",
        image: "/services-images/OCR Extraction Website Archs/Banking & Financial Services.png"
    },
    {
        title: "Hybrid Cloud for High-Load AI",
        category: "Infrastructure",
        year: "2025",
        description: "Optimizing throughput for inference-heavy enterprise applications.",
        image: "/services-images/OCR Extraction Website Archs/Telecom.png"
    }
]

const testimonials = [
    {
        quote: "InfyGalaxy didn't just give us a bot; they built a knowledge ecosystem that changed how our legal team processes discovery documents.",
        author: "Director of Innovation",
        position: "Tier-1 Legal Firm"
    },
    {
        quote: "The reduction in manual data entry overhead was immediate. We saw a 65% increase in throughput within the first quarter.",
        author: "CTO",
        position: "Global Logistics Group"
    },
    {
        quote: "Their focus on high-load security and data residency was the deciding factor for our healthcare data migration.",
        author: "Chief Medical Officer",
        position: "HealthBridge Systems"
    }
]

const caseStudies = [
    {
        industry: "Finance",
        title: "Real-time Fraud Shield",
        objective: "Prevent zero-day transaction fraud using adaptive behavior modeling.",
        image: "/services-images/OCR Extraction Website Archs/Finance.png",
        metrics: [
            { label: "Fraud Detection", value: "99.4%" },
            { label: "False Positives", value: "-40%" }
        ]
    },
    {
        industry: "Manufacturing",
        title: "Autonomous Factory Ops",
        objective: "End-to-end supply chain orchestration using multi-step AI agents.",
        image: "/services-images/OCR Extraction Website Archs/Manufacturing.png",
        metrics: [
            { label: "Lead Time", value: "-28%" },
            { label: "Predictive Acc.", value: "92%" }
        ]
    }
]
