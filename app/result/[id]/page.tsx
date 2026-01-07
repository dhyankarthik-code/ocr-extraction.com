import { Metadata } from "next"
import ResultPageClient from "./client"

export const metadata: Metadata = {
    title: 'OCR Result',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ResultPage() {
    return <ResultPageClient />
}
