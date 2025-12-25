import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Text Converter - Free Galaxy OCR',
    description: 'Convert PPT to Text.',
}

const config: ToolConfig = {
    id: 'ppt-to-text',
    title: 'PPT to Text Converter',
    description: 'Extract text from PowerPoint presentations.',
    fromFormat: 'PPT',
    toFormat: 'Text',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
