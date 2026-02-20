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
    Users,
    Globe,
    Zap,
    TrendingUp,
    BookOpen,
    Star,
    Code2,
    Layers,
    Clock,
    Quote,
    Briefcase,
    Award,
    Target
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

    const orgLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "InfyGalaxy",
        "url": "https://www.ocr-extraction.com",
        "logo": "https://www.ocr-extraction.com/logo.png",
        "description": "InfyGalaxy provides top 1% AI engineers, ML engineers, NLP specialists, generative AI developers, MLOps engineers, and data scientists for hire globally.",
        "areaServed": ["US", "GB", "DE", "AE", "SA", "SG", "IN"],
        "knowsAbout": ["Artificial Intelligence", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Generative AI", "MLOps", "LLM Fine-tuning", "RAG Pipelines"]
    }

    const serviceLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "AI Engineering Staffing",
        "name": "Hire Expert AI Engineers & Consultants",
        "description": "Hire pre-vetted AI engineers, ML engineers, NLP specialists, and generative AI developers. Global talent deployment in under 48 hours.",
        "provider": {
            "@type": "Organization",
            "name": "InfyGalaxy"
        },
        "areaServed": [
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "United Kingdom" },
            { "@type": "Country", "name": "Germany" },
            { "@type": "Country", "name": "United Arab Emirates" },
            { "@type": "Country", "name": "Saudi Arabia" },
            { "@type": "Country", "name": "Singapore" },
            { "@type": "Country", "name": "India" }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "AI Engineering Roles",
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire ML Engineers" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire NLP Engineers" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire Generative AI Developers" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire MLOps Engineers" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire Data Scientists" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hire Computer Vision Engineers" } }
            ]
        }
    }

    const howToLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Hire AI Engineers Through InfyGalaxy",
        "description": "A 4-step process to hire top AI engineers globally with InfyGalaxy.",
        "step": [
            { "@type": "HowToStep", "name": "Share Your Requirements", "text": "Tell us your tech stack, project scope, and team size. We analyze your needs within 24 hours." },
            { "@type": "HowToStep", "name": "Review Matched Profiles", "text": "We shortlist 3-5 pre-vetted AI engineers matched to your exact requirements." },
            { "@type": "HowToStep", "name": "Start 2-Week Trial", "text": "Your selected engineer begins work immediately with a zero-risk 2-week trial period." },
            { "@type": "HowToStep", "name": "Scale Your Team", "text": "Once satisfied, scale up or adjust your team. We handle contracts, payments, and compliance." }
        ]
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
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

                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                            Hire Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">AI Engineers</span> in <br className="hidden md:block" />
                            <span className="text-gray-800">USA, Europe, Middle East & APAC</span>
                        </h1>
                        <p className="text-lg md:text-xl font-semibold text-gray-700 mb-6">Hire Expert AI Engineers & Consultants</p>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10 text-balance">
                            From <strong>Silicon Valley</strong> to <strong>Dubai</strong>, <strong>Berlin</strong> to <strong>Singapore</strong>.
                            We deploy the top 1% of AI talent to build your Generative AI and MLOps infrastructure.
                            <span className="block mt-2 text-gray-500 text-base font-normal">Available for <strong>Remote</strong>, <strong>Onsite</strong>, and <strong>Hybrid</strong> teams.</span>
                        </p>

                        <p className="text-sm text-gray-400 font-medium max-w-3xl mx-auto mb-8 tracking-wide">
                            Hire ML Engineers · Data Scientists · NLP Engineers · Computer Vision Experts · Generative AI Developers · Deep Learning Engineers · MLOps Architects · AI Consultants — <span className="font-semibold text-gray-500">Remote, Onsite, or Hybrid</span>
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
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Hire AI Engineers by Country</h2>
                        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Select your region for market-specific rates, compliance notes, and talent availability.</p>
                    </div>

                    {/* Country cluster links — each is a dedicated SEO page */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
                        {[
                            { slug: 'saudi-arabia', flag: '🇸🇦', name: 'Saudi Arabia', rate: '$30–60/hr' },
                            { slug: 'uae', flag: '🇦🇪', name: 'UAE (Dubai)', rate: '$30–60/hr' },
                            { slug: 'usa', flag: '🇺🇸', name: 'United States', rate: '$40–80/hr' },
                            { slug: 'united-kingdom', flag: '🇬🇧', name: 'United Kingdom', rate: '$40–70/hr' },
                            { slug: 'germany', flag: '🇩🇪', name: 'Germany', rate: '$35–65/hr' },
                            { slug: 'singapore', flag: '🇸🇬', name: 'Singapore', rate: '$35–70/hr' },
                            { slug: 'india', flag: '🇮🇳', name: 'India (Offshore)', rate: '$25–55/hr' },
                        ].map((c) => (
                            <Link
                                key={c.slug}
                                href={`/hire-expert-ai-engineers/hire-ai-engineer-in-${c.slug}`}
                                className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{c.flag}</span>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{c.name}</div>
                                        <div className="text-xs text-green-400 font-medium">{c.rate}</div>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mb-12">
                        <span className="text-red-500 font-bold tracking-widest uppercase text-xs">All Markets</span>
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

            {/* SECTION 2.5: TECH STACK & AI CAPABILITIES */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Technology Expertise</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            AI & ML Technologies We <span className="text-red-600">Master</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                            Hire AI engineers proficient in the exact frameworks, platforms, and tools your project demands.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                        {[
                            { name: 'PyTorch', category: 'Deep Learning' },
                            { name: 'TensorFlow', category: 'Deep Learning' },
                            { name: 'LangChain', category: 'LLM Framework' },
                            { name: 'OpenAI API', category: 'Generative AI' },
                            { name: 'Hugging Face', category: 'NLP & Models' },
                            { name: 'AWS SageMaker', category: 'Cloud ML' },
                            { name: 'Azure ML', category: 'Cloud ML' },
                            { name: 'GCP Vertex AI', category: 'Cloud ML' },
                            { name: 'Kubernetes', category: 'MLOps' },
                            { name: 'Apache Spark', category: 'Big Data' },
                            { name: 'RAG Pipelines', category: 'Generative AI' },
                            { name: 'FastAPI', category: 'API Layer' },
                            { name: 'Docker', category: 'Containerization' },
                            { name: 'MLflow', category: 'Experiment Tracking' },
                            { name: 'Scikit-learn', category: 'Classical ML' },
                            { name: 'OpenCV', category: 'Computer Vision' },
                            { name: 'Llama / Mistral', category: 'Open-Source LLMs' },
                            { name: 'Stable Diffusion', category: 'Image Gen' },
                        ].map((tech, i) => (
                            <div
                                key={i}
                                className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 rounded-xl p-4 text-center transition-all duration-300 cursor-default"
                            >
                                <Code2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 mx-auto mb-2 transition-colors" />
                                <div className="text-sm font-bold text-gray-800 group-hover:text-red-700 transition-colors">{tech.name}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{tech.category}</div>
                            </div>
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
                            We don&apos;t just send resumes. Our AI engineers are seasoned professionals, rigorously tested
                            for complex AI workflows, enterprise integrations, and multi-system orchestrations.
                            We evaluate algorithm optimization, system design, and AI ethics compliance — our acceptance rate is lower than Harvard&apos;s.
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

            {/* SECTION 2.75: SOCIAL PROOF & RESULTS */}
            <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-red-400 font-bold tracking-widest uppercase text-xs">Proven Results</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Why Enterprises Trust InfyGalaxy</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-14">
                        {[
                            { value: '200+', label: 'AI Engineers Deployed', icon: <Users className="w-6 h-6" /> },
                            { value: '40+', label: 'Countries Served', icon: <Globe className="w-6 h-6" /> },
                            { value: '4.9/5', label: 'Client Satisfaction', icon: <Star className="w-6 h-6" /> },
                            { value: '<48hr', label: 'Avg Deployment Time', icon: <Zap className="w-6 h-6" /> },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="w-14 h-14 mx-auto bg-white/10 rounded-2xl flex items-center justify-center text-red-400 mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</div>
                                <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: 'Enterprise-Grade Security', desc: 'SOC 2 compliant workflows. NDA-first engagements. All engineers sign IP assignment agreements.', icon: <ShieldCheck className="w-6 h-6" /> },
                            { title: 'Zero-Risk Trial Period', desc: 'Every engagement starts with a 2-week trial. If the engineer isn\'t a perfect fit, we replace them free of charge.', icon: <CheckCircle2 className="w-6 h-6" /> },
                            { title: 'Dedicated Account Manager', desc: 'A single point of contact who understands your tech stack, timelines, and culture requirements.', icon: <MessageSquareText className="w-6 h-6" /> },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="text-red-400 mb-3">{item.icon}</div>
                                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
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

            {/* SECTION 3.5: COST COMPARISON TABLE */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Transparent Pricing</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            Cost to Hire AI Engineers: <span className="text-red-600">Local vs InfyGalaxy</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                            Save 40–60% on AI talent costs without compromising on quality. Compare local market rates vs our vetted global talent pool.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="px-6 py-4 rounded-tl-xl font-bold text-sm">Market</th>
                                    <th className="px-6 py-4 font-bold text-sm">Local Hire (Annual)</th>
                                    <th className="px-6 py-4 font-bold text-sm">InfyGalaxy Rate</th>
                                    <th className="px-6 py-4 rounded-tr-xl font-bold text-sm text-green-400">Your Savings</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { market: '🇺🇸 United States', local: '$150K–$250K', ours: '$40–80/hr', savings: 'Up to 60%' },
                                    { market: '🇬🇧 United Kingdom', local: '£90K–£160K', ours: '$40–70/hr', savings: 'Up to 55%' },
                                    { market: '🇩🇪 Germany', local: '€80K–€140K', ours: '$35–65/hr', savings: 'Up to 55%' },
                                    { market: '🇦🇪 UAE (Dubai)', local: 'AED 300K–500K', ours: '$30–60/hr', savings: 'Up to 50%' },
                                    { market: '🇸🇦 Saudi Arabia', local: 'SAR 280K–450K', ours: '$30–60/hr', savings: 'Up to 50%' },
                                    { market: '🇸🇬 Singapore', local: 'SGD 120K–200K', ours: '$35–70/hr', savings: 'Up to 50%' },
                                ].map((row, i) => (
                                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-red-50/50 transition-colors`}>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{row.market}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.local}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{row.ours}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{row.savings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/blog/cost-to-hire-ai-engineers-in-2026-usa-vs-india-vs-europe-vs-dubai" className="inline-flex items-center gap-2 text-red-600 font-semibold text-sm hover:gap-3 transition-all">
                            Read Full Cost Breakdown <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS — 4-Step Timeline */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Simple Process</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            How to <span className="text-red-600">Hire AI Engineers</span> with InfyGalaxy
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                            From your first message to a deployed engineer — our streamlined process gets your AI team up and running in under 48 hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200"></div>

                        {[
                            { step: '01', title: 'Share Your Requirements', desc: 'Tell us your tech stack, project scope, timeline, and team size. We analyze your needs and begin matching within 24 hours.', icon: <MessageSquareText className="w-6 h-6" /> },
                            { step: '02', title: 'Review Matched Profiles', desc: 'We shortlist 3–5 pre-vetted AI engineers matched to your exact requirements. Each profile includes skill assessments and past project outcomes.', icon: <Search className="w-6 h-6" /> },
                            { step: '03', title: 'Start 2-Week Trial', desc: 'Your selected engineer begins work immediately with a zero-risk trial. If the fit isn\'t right, we replace them at no charge.', icon: <Clock className="w-6 h-6" /> },
                            { step: '04', title: 'Scale Your Team', desc: 'Once satisfied, scale up or adjust your team on demand. We handle contracts, payments, IP protection, and compliance across all jurisdictions.', icon: <TrendingUp className="w-6 h-6" /> },
                        ].map((item, i) => (
                            <div key={i} className="relative text-center">
                                <div className="w-16 h-16 mx-auto bg-white border-2 border-red-200 rounded-2xl flex items-center justify-center text-red-600 mb-6 relative z-10 shadow-sm">
                                    {item.icon}
                                </div>
                                <div className="text-red-600 text-xs font-bold tracking-widest mb-2">STEP {item.step}</div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY INFYGALAXY — Prose Section for Content Depth */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Why Choose Us</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Why Companies Worldwide Choose <span className="text-red-600">InfyGalaxy</span> to Hire AI Engineers
                            </h2>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-5">
                            <p>
                                Hiring AI engineers is one of the most critical decisions a technology leader faces today. The global demand for AI talent far exceeds supply — with fewer than 300,000 qualified AI engineers worldwide serving a market that needs millions. This talent gap means that finding, vetting, and retaining world-class AI engineers requires more than posting a job listing.
                            </p>
                            <p>
                                At InfyGalaxy, we&apos;ve built a curated network of over 200 pre-vetted AI engineers, ML specialists, NLP experts, computer vision developers, and generative AI architects across 40+ countries. Every engineer in our network has passed a rigorous 4-stage vetting process that evaluates not just technical skills — algorithm optimization, system design, and model deployment — but also communication, problem-solving under ambiguity, and cultural fit for enterprise environments.
                            </p>
                            <p>
                                Our engineers bring deep expertise in production AI systems: building and fine-tuning large language models (LLMs), designing retrieval-augmented generation (RAG) pipelines, deploying MLOps infrastructure on AWS, Azure, and GCP, and architecting complex multi-agent AI orchestrations. Whether you need a senior PyTorch engineer for a 3-month computer vision project or a full dedicated AI team for a multi-year enterprise transformation, we deliver talent that integrates seamlessly with your existing workflows.
                            </p>
                            <p>
                                What sets InfyGalaxy apart is our speed and accountability. While traditional hiring takes 3–6 months, we deploy vetted engineers within 48 hours. Every engagement starts with a 2-week zero-risk trial — if the engineer isn&apos;t a perfect fit, we replace them immediately at no cost. We handle contracts, compliance, IP protection, and payments across all jurisdictions, so you can focus entirely on building your product.
                            </p>
                            <p>
                                From Silicon Valley startups to Fortune 500 enterprises, from Dubai&apos;s Vision 2031 initiatives to Germany&apos;s Industry 4.0 programs — InfyGalaxy is the trusted partner for companies that refuse to compromise on AI talent quality.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLIENT TESTIMONIALS */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Client Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            What Our <span className="text-red-600">Clients</span> Say
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto mt-3">
                            Hear from technology leaders who scaled their AI capabilities with InfyGalaxy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                quote: 'We needed 3 senior ML engineers for a real-time fraud detection system. InfyGalaxy delivered pre-vetted candidates within 36 hours. The engineers hit the ground running — our model accuracy improved by 22% in the first sprint.',
                                name: 'VP of Engineering',
                                company: 'Fintech Company, New York',
                                rating: 5
                            },
                            {
                                quote: 'Hiring locally in Dubai was taking 4+ months and costing us AED 40K+ per hire in recruitment fees alone. InfyGalaxy gave us a dedicated AI team at 50% lower cost with zero recruitment overhead. The quality exceeded our expectations.',
                                name: 'CTO',
                                company: 'PropTech Startup, Dubai',
                                rating: 5
                            },
                            {
                                quote: 'We were struggling with MLOps — our models worked in notebooks but failed in production. The MLOps engineer from InfyGalaxy set up our entire CI/CD pipeline for ML, reduced deployment time from weeks to hours.',
                                name: 'Head of Data Science',
                                company: 'Healthcare SaaS, London',
                                rating: 5
                            },
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                                <Quote className="w-8 h-8 text-red-200 mb-4" />
                                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div className="flex items-center gap-1 mt-4 mb-3">
                                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                                    <div className="text-gray-400 text-xs">{testimonial.company}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CASE STUDIES */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Case Studies</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            Real Results from <span className="text-red-600">Real Projects</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                            How our AI engineers solved complex challenges for enterprises across industries.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: 'Intelligent Document Processing for Banking',
                                industry: 'Financial Services',
                                challenge: 'A top-tier bank needed to automate processing of 50K+ loan documents monthly, reducing manual review from 15 minutes to under 2 minutes per document.',
                                solution: 'Deployed 2 AI engineers who built a custom OCR + NLP pipeline using Hugging Face transformers, integrated with the bank\'s existing core banking system.',
                                results: ['93% automation rate achieved', '12x faster document processing', '$2.4M annual cost savings'],
                                tech: ['Hugging Face', 'FastAPI', 'AWS', 'PostgreSQL'],
                                icon: <Briefcase className="w-6 h-6" />
                            },
                            {
                                title: 'Real-Time Anomaly Detection for E-Commerce',
                                industry: 'E-Commerce & Retail',
                                challenge: 'A major e-commerce platform experienced $3M+ in annual losses from fraudulent transactions. Their rule-based system caught only 60% of fraud cases.',
                                solution: 'Hired 3 ML engineers who designed a real-time anomaly detection model using gradient boosting and deep autoencoders, deployed on GCP Vertex AI.',
                                results: ['94% fraud detection rate', '75% reduction in false positives', '$2.1M saved in first year'],
                                tech: ['PyTorch', 'GCP Vertex AI', 'Apache Kafka', 'Redis'],
                                icon: <Target className="w-6 h-6" />
                            },
                            {
                                title: 'Generative AI Chatbot for Healthcare',
                                industry: 'Healthcare',
                                challenge: 'A healthcare SaaS company needed a HIPAA-compliant AI assistant that could answer patient queries using their proprietary medical knowledge base.',
                                solution: 'Deployed a senior Generative AI engineer who built a RAG pipeline using LangChain + OpenAI, with fine-tuned embeddings on medical literature.',
                                results: ['85% query resolution without human escalation', '40% reduction in support tickets', 'HIPAA compliant from day one'],
                                tech: ['LangChain', 'OpenAI', 'Pinecone', 'Azure'],
                                icon: <Award className="w-6 h-6" />
                            },
                        ].map((study, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="bg-gray-900 text-white p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-400">
                                            {study.icon}
                                        </div>
                                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider">{study.industry}</span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-snug">{study.title}</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Challenge</div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{study.challenge}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Solution</div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{study.solution}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Results</div>
                                        <ul className="space-y-1">
                                            {study.results.map((result, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium">{result}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {study.tech.map((t, j) => (
                                            <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
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

            {/* SECTION 5: FROM OUR BLOG — Internal Linking */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Resources</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">From Our Blog</h2>
                        <p className="text-gray-600 max-w-xl mx-auto mt-3">
                            Deep dives on hiring AI talent, managing costs, and scaling your engineering team.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                title: 'How to Hire AI Engineers in 2026: The Complete CTO Guide',
                                href: '/blog/how-to-hire-ai-engineers-in-2026-the-complete-cto-guide-to-finding-top-ai-talent',
                                tag: 'Hiring Guide',
                                desc: 'A step-by-step framework for evaluating, interviewing, and onboarding AI engineers at scale.'
                            },
                            {
                                title: 'Cost to Hire AI Engineers: USA vs India vs Europe vs Dubai',
                                href: '/blog/cost-to-hire-ai-engineers-in-2026-usa-vs-india-vs-europe-vs-dubai',
                                tag: 'Cost Analysis',
                                desc: 'Salary benchmarks, hourly rates, and total cost of ownership across 6 major markets.'
                            },
                            {
                                title: 'In-House vs Dedicated AI Teams: Which Model Wins?',
                                href: '/blog/in-house-vs-dedicated-ai-teams',
                                tag: 'Strategy',
                                desc: 'Compare build vs buy for AI teams — pros, cons, and when each model makes sense.'
                            },
                        ].map((post, i) => (
                            <Link
                                key={i}
                                href={post.href}
                                className="group bg-gray-50 hover:bg-red-50/50 rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-all duration-300"
                            >
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-md mb-4">
                                    {post.tag}
                                </span>
                                <h3 className="font-bold text-gray-900 group-hover:text-red-700 text-lg mb-2 transition-colors leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.desc}</p>
                                <span className="text-red-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6: FINAL CTA */}
            <section className="relative py-24 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl -z-0"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 border border-red-600/30">
                        <Zap className="w-3 h-3" /> Ready to Scale
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Build Your AI Team <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">in 48 Hours</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        From initial brief to deployed engineers — we move fast so you don&apos;t lose momentum. Start with a zero-risk trial today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-red-600 rounded-full hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-300"
                        >
                            Hire AI Engineers Now
                        </Link>
                        <Link
                            href="/contact?subject=Consultation"
                            className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                        >
                            Book a Free Consultation
                        </Link>
                    </div>

                    <p className="text-gray-500 text-xs mt-8">No commitment required · 2-week free trial · Cancel anytime</p>
                </div>
            </section>
        </main>
    )
}
