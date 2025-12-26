import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to Text Converter - Free Galaxy OCR',
    description: 'Extract text from Word documents instantly.',
}

const config: ToolConfig = {
    id: 'word-to-text',
    title: 'Word to Text Converter',
    description: 'Extract plain text from your Word documents.',
    fromFormat: 'Word',
    toFormat: 'Text',
    type: 'office-to-text',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
