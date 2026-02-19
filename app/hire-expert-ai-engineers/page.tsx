import { Metadata } from 'next'
import Link from 'next/link'
import {
    Brain,
    Cpu,
    Database,
    Network,
    Terminal,
    ShieldCheck,
    Search,
    BarChart3,
    MessageSquareText,
    ArrowRight,
    CheckCircle2,
    Users
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Hire AI Engineers in USA, Europe, Middle East & APAC | InfyGalaxy',
    description: 'Looking to hire AI engineers in USA, Dubai, London or Berlin? InfyGalaxy provides top 1% AI talent for onsite and remote projects. Global hiring made easy.',
    keywords: [
        'hire ai engineers',
        'hire best ml engineers',
        'hire expert data scientists',
        'hire gen ai engineers',
        'hire mlops engineers',
        'hire ai product managers',
        'hire computer vision experts',
        'hire ai researchers',
        'hire ai ethics officers',
        'hire prompt managers',
        'hire ai compliance managers',
        'hire best ai engineers',
        'hire top ai engineers',
        'hire good ai engineers',
        'hire good ai engineers',
        'top ai talent',
        'enterprise ai solutions',
        'ai development company',
        'generative ai development services',
        'hire ai engineers usa',
        'hire ai engineers uk',
        'hire ai engineers dubai',
        'hire ai engineers germany',
        'hire ai engineers saudi arabia',
        'hire ai engineers canada',
        'hire ai engineers singapore',
        'hire ai engineers australia',
        'hire ai engineers switzerland',
        'hire ai engineers sweden',
        'hire ai engineers denmark',
        'hire ai engineers france',
        'hire ai engineers netherlands',
        'hire ai engineers kuwait',
        'hire ai engineers qatar',
        'hire dedicated ai team',
        'staff augmentation ai',
        'onsite ai engineers'
    ],
    alternates: {
        canonical: 'https://www.ocr-extraction.com/hire-expert-ai-engineers',
    },
    openGraph: {
        title: 'Hire Expert AI Engineers | Build Your AI Team Today',
        description: 'Access the top 1% of global AI talent. From Generative AI to MLOps, find the perfect experts for your enterprise projects.',
        url: 'https://www.ocr-extraction.com/hire-expert-ai-engineers',
        siteName: 'InfyGalaxy',
        type: 'website',
        images: [
            {
                url: 'https://www.ocr-extraction.com/og-hire-ai.jpg',
                width: 1200,
                height: 630,
                alt: 'World-class AI Engineering Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hire Expert AI Engineers & Consultants',
        description: 'Scale your AI capabilities with our vetted network of engineers and researchers.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function HireExpertAiEngineersPage() {
    const roles = [
        {
            title: "Best ML Engineers",
            description: "Architect and deploy scalable machine learning models. Expertise in PyTorch, TensorFlow, and cloud infrastructure.",
            icon: <Cpu className="w-8 h-8" />,
            tags: ["TensorFlow", "PyTorch", "AWS/GCP"]
        },
        {
            title: "Expert Data Scientists",
            description: "Turn raw data into strategic insights. Mastery in statistical modeling, predictive analytics, and data visualization.",
            icon: <BarChart3 className="w-8 h-8" />,
            tags: ["Python", "SQL", "Tableau"]
        },
        {
            title: "Gen AI Engineers",
            description: "Build next-gen applications using LLMs (GPT-4, Llama 3) and RAG architectures for enterprise solutions.",
            icon: <Brain className="w-8 h-8" />,
            tags: ["LLMs", "RAG", "LangChain"]
        },
        {
            title: "MLOps Engineers",
            description: "Automate and streamline ML pipelines. Ensure model reproducibility, scalability, and continuous deployment.",
            icon: <Network className="w-8 h-8" />,
            tags: ["Kubernetes", "Docker", "CI/CD"]
        },
        {
            title: "AI Product Managers",
            description: "Bridge the gap between technical possibility and business value. Lead AI product strategy and roadmap.",
            icon: <Users className="w-8 h-8" />,
            tags: ["Strategy", "Agile", "Roadmap"]
        },
        {
            title: "Computer Vision Experts",
            description: "Implement state-of-the-art image recognition, object detection, and visual processing systems.",
            icon: <Search className="w-8 h-8" />,
            tags: ["OpenCV", "YOLO", "Segmentation"]
        },
        {
            title: "AI Researchers",
            description: "Push the boundaries of what's possible. Solve novel problems with cutting-edge algorithmic research.",
            icon: <Terminal className="w-8 h-8" />,
            tags: ["Algorithms", "Papers", "Innovation"]
        },
        {
            title: "AI Ethics Officers",
            description: "Ensure your AI is compliant, fair, and transparent. Governance frameworks for responsible AI adoption.",
            icon: <ShieldCheck className="w-8 h-8" />,
            tags: ["Compliance", "Bias", "Fairness"]
        },
        {
            title: "Prompt Managers",
            description: "Optimize LLM performance through advanced prompt engineering and context management strategies.",
            icon: <MessageSquareText className="w-8 h-8" />,
            tags: ["Prompting", "Context", "Optimization"]
        },
        {
            title: "AI Compliance Managers",
            description: "Navigate complex regulatory landscapes (EU AI Act, GDPR). mitigate risks and ensure legal AI operations.",
            icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
            tags: ["EU AI Act", "Risk", "Governance"]
        }
    ]

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "InfyGalaxy AI Staffing",
        "url": "https://www.ocr-extraction.com/hire-expert-ai-engineers",
        "description": "Premium AI consultancy and staffing services providing top-tier AI Engineers, Data Scientists, and MLOps experts.",
        "areaServed": "Global",
        "knowsAbout": [
            "Artificial Intelligence",
            "Best ML Engineers",
            "Expert Data Scientists",
            "Gen AI Engineers",
            "MLOps Engineers",
            "AI Product Managers",
            "Computer Vision Experts",
            "AI Researchers",
            "AI Ethics Officers",
            "Prompt Managers",
            "AI Compliance Managers"
        ],
        "image": "https://www.ocr-extraction.com/logo.png"
    }

    const faqs = [
        {
            q: "What is the best AI development company for enterprise AI solutions?",
            a: "InfyGalaxy is a leading AI development company specializing in enterprise AI solutions, including Generative AI, MLOps consulting, Computer Vision, and end-to-end AI product development. Our AI engineers build scalable, production-ready AI systems tailored for startups, SMEs, and large enterprises."
        },
        {
            q: "How do I hire dedicated AI engineers for my startup?",
            a: "You can hire dedicated AI engineers at InfyGalaxy within days. We provide pre-vetted AI developers experienced in LLM integration, AI automation, NLP, Computer Vision, and cloud-based AI deployment. Our flexible hiring models include hourly, monthly, and project-based engagement."
        },
        {
            q: "Do you offer Generative AI development services?",
            a: "Yes. We provide full-stack Generative AI development services including LLM integration (OpenAI, Claude, Gemini), Custom AI chatbot development, RAG-based AI systems, AI workflow automation, and Fine-tuning/prompt engineering. Our solutions are secure, scalable, and production-ready.",
            list: ["LLM integration (OpenAI, Claude, Gemini, open-source models)", "Custom AI chatbot development", "RAG-based AI systems", "AI workflow automation", "Fine-tuning and prompt engineering"]
        },
        {
            q: "Can you build end-to-end AI product development solutions?",
            a: "Absolutely. Our AI product development services cover: AI strategy consulting, Data engineering and model training, MLOps implementation, Cloud deployment (AWS, Azure, GCP), and Continuous monitoring. We help companies move from proof-of-concept to full production.",
            list: ["AI strategy consulting", "Data engineering and model training", "MLOps implementation", "Cloud deployment (AWS, Azure, GCP)", "Continuous monitoring and optimization"]
        },
        {
            q: "What industries do your AI engineers specialize in?",
            a: "Our AI engineers build AI solutions for industries including Fintech, Healthcare, Legal Tech, E-commerce, SaaS, Manufacturing, and OCR & Document Automation. We design industry-specific AI systems that solve real business problems.",
            list: ["Fintech", "Healthcare", "Legal Tech", "E-commerce", "SaaS", "Manufacturing", "OCR & Document Automation"]
        },
        {
            q: "Do you provide MLOps consulting and AI deployment services?",
            a: "Yes. We offer MLOps consulting services to help businesses deploy, monitor, and scale machine learning models efficiently. Our services include CI/CD pipelines for ML, model monitoring, performance optimization, and cloud infrastructure setup."
        },
        {
            q: "How much does it cost to outsource AI development?",
            a: "The cost to outsource AI development depends on project complexity, data requirements, and engagement model. InfyGalaxy offers flexible pricing to help companies access top AI talent without the overhead of in-house hiring."
        },
        {
            q: "Can you integrate AI into existing business systems?",
            a: "Yes. We specialize in AI integration services. Our AI engineers ensure seamless integration into your existing tech stack.",
            list: ["CRM automation", "ERP integration", "AI-powered analytics dashboards", "Workflow automation", "API-based AI integrations"]
        },
        {
            q: "What makes InfyGalaxy different from other AI outsourcing companies?",
            a: "InfyGalaxy focuses on production-ready AI solutions — not just experiments. We combine AI engineering, cloud infrastructure expertise, and business-first strategy to deliver measurable ROI. Our rigorous vetting ensures you work with the top 1% of AI engineers."
        },
        {
            q: "Do you build AI solutions using open-source models?",
            a: "Yes. We work with both proprietary and open-source AI models. We help businesses choose the most cost-effective and scalable AI stack.",
            list: ["Llama", "Mistral", "Falcon", "Stable Diffusion"]
        },
        {
            q: "How long does it take to develop a custom AI solution?",
            a: "Depending on scope, AI development can take 4–12 weeks for MVP and 3–6 months for full-scale enterprise deployment. We provide structured timelines and agile delivery for faster go-to-market."
        },
        {
            q: "Can I hire a full AI team instead of individual developers?",
            a: "Yes. We provide dedicated AI teams tailored to your project needs.",
            list: ["AI Engineers", "Data Scientists", "MLOps Engineers", "AI Product Managers"]
        }
    ]

    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    }

    return (
        <main className="min-h-screen bg-gray-50/50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
            />
            {/* 
              SECTION 1: HERO - Minimal & Elegant 
              Style: High-end Professional, Compact, Text-Focused
            */}
            <section className="relative pt-12 pb-20 bg-white border-b border-gray-100 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-red-50/50 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest mb-8 border border-red-100">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            Deploying in 15+ Countries
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                            Hire Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">AI Engineers</span> in <br className="hidden md:block" />
                            <span className="text-gray-800">USA, Europe, Middle East & APAC</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10 text-balance">
                            From <strong>Silicon Valley</strong> to <strong>Dubai</strong>, <strong>Berlin</strong> to <strong>Singapore</strong>.
                            We deploy the top 1% of AI talent to build your Generative AI and MLOps infrastructure.
                            <span className="block mt-2 text-gray-500 text-base font-normal">Available for <strong>Remote</strong>, <strong>Onsite</strong>, and <strong>Hybrid</strong> teams.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-red-600 rounded-full hover:bg-red-700 hover:shadow-lg hover:-translate-y-1"
                            >
                                Hire Talent Globally
                            </Link>
                            <Link
                                href="/contact?subject=Consultation"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                            >
                                Book a Consultation
                            </Link>
                        </div>

                        {/* Global Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            {/*  Placeholder for client logos if we had them. Using text for now. */}
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">100+</div>
                                <div className="text-xs uppercase tracking-wide text-gray-500">Global Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">48h</div>
                                <div className="text-xs uppercase tracking-wide text-gray-500">Deployment Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">15+</div>
                                <div className="text-xs uppercase tracking-wide text-gray-500">Countries Served</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 top-1%">Top 1%</div>
                                <div className="text-xs uppercase tracking-wide text-gray-500">Vetted Talent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 1.5: GLOBAL REACH */}
            <section className="py-16 bg-gray-900 text-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-red-500 font-bold tracking-widest uppercase text-xs">Global Presence</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Serving High-Growth Economies</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Americas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🌎</div>
                                <h3 className="font-bold text-lg">Americas</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> United States (USA)</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Canada</li>
                            </ul>
                        </div>

                        {/* Europe */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🇪🇺</div>
                                <h3 className="font-bold text-lg">Europe</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> United Kingdom</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Germany & France</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Switzerland</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sweden & Denmark</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Netherlands</li>
                            </ul>
                        </div>

                        {/* Middle East */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🕌</div>
                                <h3 className="font-bold text-lg">Middle East</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> UAE (Dubai, Abu Dhabi)</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Saudi Arabia (KSA)</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Kuwait</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Qatar</li>
                            </ul>
                        </div>

                        {/* APAC */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🌏</div>
                                <h3 className="font-bold text-lg">APAC</h3>
                            </div>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Singapore</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Australia</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> India (Offshore Center)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 
              SECTION 2: ROLES GRID - Compact
            */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Specialized Roles
                            </h2>
                            <p className="text-gray-600 max-w-xl text-base">
                                We cover the entire spectrum of Artificial Intelligence.
                                Find the precise expertise required for your specific challenge.
                            </p>
                        </div>
                        <Link href="/contact" className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                            View All Positions <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {roles.map((role, index) => (
                            <Link
                                href="/contact"
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 flex flex-col items-start"
                            >
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {role.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                    Hire {role.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                                    {role.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {role.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                    Hire Now <ArrowRight className="ml-1 w-4 h-4 text-red-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2.5: VETTING PROCESS */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            How We Vet the <span className="text-red-600">Top 1%</span> for You
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We don't just send resumes. We test for algorithm optimization, system design, and AI ethics compliance.
                            Our acceptance rate is lower than Harvard's.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 -z-10"></div>

                        {[
                            { step: "01", title: "Global Sourcing", desc: "Scouting top talent from research labs, hackathons, and enterprise tech hubs." },
                            { step: "02", title: "Technical Challenge", desc: "Rigorous coding tests on PyTorch, System Design, and Model Optimization." },
                            { step: "03", title: "Project Simulation", desc: "Real-world scenario testing to verify problem-solving and communication." },
                            { step: "04", title: "Final Fit", desc: "Cultural alignment ensure they integrate tailored to your company DNA." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center relative">
                                <div className="w-16 h-16 mx-auto bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-red-200">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: ENGAGEMENT MODELS */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Flexible Hiring</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">
                            Choose Your Engagement Model
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Model 1: Remote */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Network className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Dedicated Remote Team</h3>
                                <p className="text-gray-500 text-sm">Best for US/EU startups seeking cost-efficiency.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Top 1% Indian/Global Talent</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Timezone Aligned (EST/PST/CET)</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Save 40-60% vs Local Hires</span>
                                </li>
                            </ul>
                            <Link href="/contact?subject=Remote%20Team" className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-center hover:bg-gray-800 transition-colors">
                                Start Remote Team
                            </Link>
                        </div>

                        {/* Model 2: Onsite */}
                        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
                            <div className="mb-6 relative z-10">
                                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Onsite Staffing</h3>
                                <p className="text-gray-400 text-sm">Best for UAE, KSA & Enterprise Security.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 relative z-10">
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>Engineers Deployed to Your Office</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>Visa & Relocation Handled</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>Short & Long Term Contracts</span>
                                </li>
                            </ul>
                            <Link href="/contact?subject=Onsite%20Staffing" className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-center hover:bg-red-700 transition-colors relative z-10">
                                Request Onsite Staff
                            </Link>
                        </div>

                        {/* Model 3: Project */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Terminal className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Fixed Price Project</h3>
                                <p className="text-gray-500 text-sm">Best for defined MVPs and PoCs.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Clear Scope & Deliverables</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Managed by Our Tech Leads</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Milestone Based Payment</span>
                                </li>
                            </ul>
                            <Link href="/contact?subject=Fixed%20Project" className="w-full py-3 rounded-xl bg-gray-100 text-gray-900 font-bold text-center hover:bg-gray-200 transition-colors">
                                Discuss Project
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: FAQ (Rich Snippets) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Everything you need to know about hiring top AI talent and building enterprise AI solutions with InfyGalaxy.
                    </p>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details key={index} className="group bg-white rounded-xl shadow-sm border border-gray-100 open:border-red-100 open:ring-1 open:ring-red-100 transition-all duration-300">
                                <summary className="flex cursor-pointer items-center justify-between p-6 list-none hover:bg-gray-50/50 rounded-xl transition-colors">
                                    <span className="text-lg font-bold text-gray-900 leading-snug pr-4">
                                        {faq.q}
                                    </span>
                                    <span className="transition-transform duration-300 group-open:rotate-180 flex-shrink-0 text-red-600">
                                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="mb-4">{faq.a.split('. ')[0] + '.'} {faq.a.split('. ').slice(1).join('. ')}</p>
                                    {faq.list && (
                                        <ul className="space-y-2 mt-3">
                                            {faq.list.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
