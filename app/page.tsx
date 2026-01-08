import type { Metadata } from 'next'
import HomePage from "@/components/home-page"

export const metadata: Metadata = {
  title: "Free OCR to Text | Convert Image to Text & Excel | 100% Accurate",
  description: "Image to text converter is a free online AI OCR tool that allows you to convert Image to Word, convert PDF to Word file, and extract text from PDF and image files.",
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  return <HomePage />
}
