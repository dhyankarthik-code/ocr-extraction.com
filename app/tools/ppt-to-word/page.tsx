import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Word Converter - Free Galaxy OCR',
    description: 'Convert PPT to Word.',
}

const config: ToolConfig = {
    id: 'ppt-to-word',
    title: 'PPT to Word Converter',
    description: 'Convert PowerPoint slides to Word documents.',
    fromFormat: 'PPT',
    toFormat: 'Word',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
