import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to Word Converter - Free Galaxy OCR',
    description: 'Convert plain text to Word documents.',
}

const config: ToolConfig = {
    id: 'text-to-word',
    title: 'Text to Word Converter',
    description: 'Convert plain text files (.txt) to editable Word documents (DOCX).',
    fromFormat: 'Text',
    toFormat: 'Word',
    type: 'client-convert',
    accept: {
        'text/plain': ['.txt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
