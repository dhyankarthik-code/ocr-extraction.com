import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to Text Converter - Free Galaxy OCR',
    description: 'Convert Word to Text.',
}

const config: ToolConfig = {
    id: 'word-to-text',
    title: 'Word to Text Converter',
    description: 'Extract text from Word documents.',
    fromFormat: 'Word',
    toFormat: 'Text',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
