import MissionPageClient from "./client"

export const metadata = {
    title: 'Our Mission | Democratizing AI Technology & Talent Globally',
    description: 'Our mission is to make world-class AI technology and AI talent accessible to every business — from free AI-powered tools to hiring expert AI engineers for enterprise-scale workflows.',
    alternates: {
        canonical: '/mission',
    },
}

export default function MissionPage() {
    return <MissionPageClient />
}
