import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Enterprise AI Solutions & Custom AI Development | InfyGalaxy',
    description: 'Accelerate your business with bespoke AI solutions. From LLM integration to autonomous agents and predictive modeling, we build high-load, secure AI systems for global enterprises.',
    keywords: [
        'AI Solutions',
        'Custom AI Development',
        'Enterprise AI Automation',
        'Generative AI Services',
        'AI Consulting',
        'LLM Integration',
        'Autonomous Agents',
        'AI for Legal and Healthcare',
        'Predictive Analytics'
    ],
    alternates: {
        canonical: 'https://ocr-extraction.com/ai-solutions',
    },
    openGraph: {
        title: 'Enterprise AI Solutions & Custom AI Development | InfyGalaxy',
        description: 'Scalable, secure, and intelligent AI systems designed for modern enterprise workflows.',
        url: 'https://ocr-extraction.com/ai-solutions',
        siteName: 'InfyGalaxy',
        type: 'website',
    },
}

export default function AISolutionsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
