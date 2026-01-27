import MissionPageClient from "./client"

export const metadata = {
    title: 'Our Mission | Making AI OCR Accessible to Everyone',
    description: 'Our mission is to provide free, high-accuracy OCR tools to students, professionals, and businesses worldwide without hidden costs.',
    alternates: {
        canonical: '/mission',
    },
}

export default function MissionPage() {
    return <MissionPageClient />
}
