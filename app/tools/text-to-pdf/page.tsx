import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to PDF Converter - Free Galaxy OCR',
    description: 'Convert plain text to PDF documents.',
}

const config: ToolConfig = {
    id: 'text-to-pdf',
    title: 'Text to PDF Converter',
    description: 'Convert plain text files (.txt) to PDF documents.',
    fromFormat: 'Text',
    toFormat: 'PDF',
    type: 'client-convert',
    accept: {
        'text/plain': ['.txt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
