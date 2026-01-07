import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free PDF to Text Converter - OCR Extraction',
    description: 'Extract text from PDF documents instantly. Free online OCR tool for scanned PDFs and digital files. No signup or download required.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/pdf-to-text',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-text',
    title: 'PDF to Text Converter',
    description: 'Extract plain text from your PDF documents.',
    fromFormat: 'PDF',
    toFormat: 'Text',
    type: 'ocr',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
