import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to Image Converter - Free Galaxy OCR',
    description: 'Convert Word documents (.docx, .doc) to images. Each page becomes a separate PNG file. Free and secure.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/word-to-image',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Word to Image Converter - Free Galaxy OCR',
        description: 'Convert Word documents to images instantly. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'word-to-image',
    title: 'Word to Image Converter',
    description: 'Convert Word documents (.docx) into high-quality PNG images.',
    fromFormat: 'Word',
    toFormat: 'Image',
    type: 'office-to-image',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
