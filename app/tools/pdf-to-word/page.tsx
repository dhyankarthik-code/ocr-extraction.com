import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Word Converter - Free Galaxy OCR',
    description: 'Convert PDF files to editable Word documents instantly.',
}

const config: ToolConfig = {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter',
    description: 'Convert your PDF documents to editable Word (DOCX) files with high accuracy.',
    fromFormat: 'PDF',
    toFormat: 'Word',
    type: 'coming-soon',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
