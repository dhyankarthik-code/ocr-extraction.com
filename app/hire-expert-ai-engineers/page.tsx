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
    title: 'Hire Top AI Engineers & Best Consultants | InfyGalaxy',
    description: 'Looking to hire best AI engineers? InfyGalaxy connects you with top AI talent and good AI developers for your projects. Vetted top 1% experts.',
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
        'hire dedicated ai team'
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
            <section className="relative pt-6 pb-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            Top 1% Global AI Talent
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight">
                            Hire Expert <span className="text-red-600">AI Engineers</span> & Consultants
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8 text-balance">
                            Accelerate your digital transformation with world-class AI experts.
                            From <span className="font-semibold text-gray-900">Generative AI</span> to <span className="font-semibold text-gray-900">MLOps</span>,
                            we provide the specialized talent you need.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all bg-red-600 rounded-full hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5"
                            >
                                Hire Talent Now
                            </Link>
                            <Link
                                href="/contact?subject=Consultation"
                                className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50"
                            >
                                Book a Consultation
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-gray-800 uppercase tracking-wide opacity-80">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-600" />
                                Vetted Experts
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-600" />
                                Immediate Availability
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-600" />
                                Enterprise Compliant
                            </div>
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

            {/* SECTION 2.5: WHY US (Content Rich for SEO) */}
            <section className="py-20 bg-white border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            Why Hire the <span className="text-red-600">Best AI Engineers</span> from InfyGalaxy?
                        </h2>
                        <div className="prose prose-lg text-gray-600 mx-auto">
                            <p className="mb-4">
                                When you need to <strong>hire top AI engineers</strong>, technical expertise is non-negotiable. At InfyGalaxy, we go beyond basic coding skills. We connect you with <strong>good AI developers</strong> who understand business logic, scalable architecture, and the ethical implications of AI deployment.
                            </p>
                            <p className="mb-4">
                                Finding the <strong>best AI engineers</strong> can be challenging in a competitive market. Our curated network gives you immediate access to world-class talent in Generative AI, LLMs, and Computer Vision, saving you months of recruitment time.
                            </p>
                            <p>
                                Whether you need to build a custom RAG pipeline or deploy edge AI solutions, our experts are ready to deliver. Don't settle for average; <strong>hire top AI talent</strong> that drives real innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: DEDICATED TEAMS */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden isolate">
                        {/* Gradients */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

                        <div className="max-w-4xl mx-auto">
                            <span className="text-red-400 font-bold tracking-widest uppercase text-sm mb-4 block">
                                Enterprise Solution
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                Hire Dedicated AI Teams
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
                                End-to-end agile pods to run your AI initiatives. From <span className="text-white font-medium">Product Design</span> to <span className="text-white font-medium">Planning</span>, <span className="text-white font-medium">QA</span>, and <span className="text-white font-medium">Launch</span>.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                {[
                                    { step: "01", title: "Product Design", desc: "User-centric AI flows" },
                                    { step: "02", title: "Strategic Planning", desc: "Roadmap & Architecture" },
                                    { step: "03", title: "Development", desc: "Agile Implementation" },
                                    { step: "04", title: "Launch & Scale", desc: "Deployment & Monitoring" },
                                ].map((item) => (
                                    <div key={item.step} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:bg-white/10 transition-colors">
                                        <div className="text-red-400 font-mono text-xl mb-2">{item.step}</div>
                                        <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                                        <div className="text-gray-400 text-sm">{item.desc}</div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/contact?subject=Dedicated%20Team"
                                className="inline-flex items-center px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                Setup Your Team
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
