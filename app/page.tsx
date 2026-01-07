import type { Metadata } from 'next'
import HomePage from "@/components/home-page"

export const metadata: Metadata = {
  title: "Free OCR to Text | Convert Image to Text & Excel | 100% Accurate",
  description: "Best Free OCR tool to convert images, PDFs, and screenshots to editable text or Excel. Supports handwriting recognition, batch processing, and multi-language extraction.",
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  return <HomePage />
}
