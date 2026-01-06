import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Word Converter - Free Galaxy OCR',
    description: 'Convert PDF files to editable Word documents. Extract text and paragraphs. Client-side processing for privacy.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/pdf-to-word',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter',
    description: 'Convert PDF text content into editable Word documents.',
    fromFormat: 'PDF',
    toFormat: 'Word',
    type: 'office-to-word',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
