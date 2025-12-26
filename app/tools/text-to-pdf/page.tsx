import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to PDF Converter - Free Galaxy OCR',
    description: 'Convert plain text to PDF documents. Free online tool to transform your text files into PDF format.',
    alternates: {
        canonical: '/tools/text-to-pdf',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text to PDF Converter - Free Galaxy OCR',
        description: 'Convert plain text to PDF documents. Free online tool.',
    },
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
