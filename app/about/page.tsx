import AboutPageClient from "./client"

export const metadata = {
    title: 'About InfyGalaxy | AI Platform, AI Tools & Expert AI Talent Provider',
    description: 'InfyGalaxy is a global AI technology company specializing in AI-powered tools, AI workflow orchestration, and providing pre-vetted AI engineers for hire. Leaders in MLOps, LLMs, Generative AI, Agentic AI, QCNN, and Quantum Computing.',
    alternates: {
        canonical: '/about',
    },
}

export default function AboutPage() {
    return <AboutPageClient />
}
