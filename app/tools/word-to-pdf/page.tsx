import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to PDF Converter - Free Galaxy OCR',
    description: 'Convert Word to PDF.',
}

const config: ToolConfig = {
    id: 'word-to-pdf',
    title: 'Word to PDF Converter',
    description: 'Convert Word documents to PDF.',
    fromFormat: 'Word',
    toFormat: 'PDF',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
