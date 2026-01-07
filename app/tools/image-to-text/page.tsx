import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Image to Text Converter - OCR Extraction',
    description: 'Convert images (JPG, PNG, WebP) to editable text instantly with AI-powered OCR. Free online tool with 99% accuracy. No signup required.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/image-to-text',
    },
}

const config: ToolConfig = {
    id: 'image-to-text',
    title: 'Image to Text Converter',
    description: 'Extract plain text from images (JPG, PNG, WebP) instantly.',
    fromFormat: 'Image',
    toFormat: 'Text',
    type: 'ocr',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
