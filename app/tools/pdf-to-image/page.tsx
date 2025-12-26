import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Image Converter - Free Galaxy OCR',
    description: 'Convert PDF files to high-quality images (PNG). Extract every page as a separate image. Client-side processing for privacy.',
    alternates: {
        canonical: '/tools/pdf-to-image',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PDF to Image Converter - Free Galaxy OCR',
        description: 'Convert PDF files to images instantly. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    description: 'Convert each page of your PDF into initialized high-quality PNG images.',
    fromFormat: 'PDF',
    toFormat: 'Image',
    type: 'office-to-image',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
