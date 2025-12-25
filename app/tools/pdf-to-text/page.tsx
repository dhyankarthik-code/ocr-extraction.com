import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Text Converter - Free Galaxy OCR',
    description: 'Extract text from PDF files instantly.',
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
