import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to PPT Converter - Free Galaxy OCR',
    description: 'Convert Word to PowerPoint.',
}

const config: ToolConfig = {
    id: 'word-to-ppt',
    title: 'Word to PPT Converter',
    description: 'Convert Word documents to PowerPoint slides.',
    fromFormat: 'Word',
    toFormat: 'PPT',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
