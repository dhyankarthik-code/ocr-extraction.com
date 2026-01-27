import AboutPageClient from "./client"

export const metadata = {
    title: 'About Infy Galaxy | Leading AI OCR Solutions',
    description: 'Learn about Infy Galaxy, the team behind the world\'s most accurate free OCR tool. We specialize in AI, automation, and digital productivity solutions.',
    alternates: {
        canonical: '/about',
    },
}

export default function AboutPage() {
    return <AboutPageClient />
}
