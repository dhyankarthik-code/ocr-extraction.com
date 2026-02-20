import CompanyProfilePageClient from "./client"

export const metadata = {
    title: 'Company Profile - InfyGalaxy | AI Engineering, AI Talent & Emerging Tech Leaders',
    description: 'InfyGalaxy is a global AI company providing AI-powered tools, hire expert AI engineers, and lead innovation in MLOps, LLMs, Generative AI, Agentic AI, QCNN, AGI, and Quantum Computing.',
    alternates: {
        canonical: '/company-profile',
    },
}

export default function CompanyProfilePage() {
    return <CompanyProfilePageClient />
}
