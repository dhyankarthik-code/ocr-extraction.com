import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to PPT Converter - Free Galaxy OCR',
    description: 'Convert PDF documents to PowerPoint presentations. Extract text and create editable slides. Free online tool with client-side processing for privacy.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/pdf-to-ppt',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-ppt',
    title: 'PDF to PPT Converter',
    description: 'Convert PDF text content into PowerPoint slides.',
    fromFormat: 'PDF',
    toFormat: 'PPT',
    type: 'office-to-ppt',
    accept: { 'application/pdf': ['.pdf'] }
}

export default function Page() {
    return <GenericTool config={config} />
}
