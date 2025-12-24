import LocalResultPageClient from "./client"

export const metadata = {
    title: 'OCR Analysis Results',
    robots: {
        index: false,
        follow: false,
    },
}

export default function LocalResultPage() {
    return <LocalResultPageClient />
}
