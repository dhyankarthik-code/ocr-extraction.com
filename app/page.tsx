import type { Metadata } from 'next'
import HomePage from "@/components/home-page"

export const metadata: Metadata = {
  title: "Free OCR to Text | Convert Image to Text & Excel | 100% Accurate",
  description: "Image to text converter is a free online AI OCR tool that allows you to convert Image to Word, convert PDF to Word file, and extract text from PDF and image files.",
  keywords: [
    "image to text",
    "online ocr",
    "jpg to word",
    "image to text converter",
    "image to word",
    "pdf ocr",
    "pdf to word",
    "convert pdf to word",
    "pdf to excel",
    "convert pdf to excel",
    "picture to text",
    "convert image to text",
    "ocr",
    "ocr software",
    "optical character recognition",
    "text recognition",
    "convert screenshot to text",
    "scanned image to text",
    "ocr data extraction",
    "pdf to text",
    "handwritten ocr",
    "multilanguage ocr",
    "document digitization",
    "invoice to text",
    "real time ocr",
    "document processing"
  ],
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  return <HomePage />
}
