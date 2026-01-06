import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to Image Converter - Free Galaxy OCR',
    description: 'Convert plain text to images. Free online tool to transform your text files into PNG images.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/text-to-image',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text to Image Converter - Free Galaxy OCR',
        description: 'Convert plain text to images. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'text-to-image',
    title: 'Text to Image Converter',
    description: 'Convert plain text into image files (PNG).',
    fromFormat: 'Text',
    toFormat: 'Image',
    type: 'client-convert',
    accept: {
        'text/plain': ['.txt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
