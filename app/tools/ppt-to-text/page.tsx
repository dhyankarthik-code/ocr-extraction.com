import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Text Converter - Free Galaxy OCR',
    description: 'Extract text from PowerPoint presentations instantly.',
}

const config: ToolConfig = {
    id: 'ppt-to-text',
    title: 'PPT to Text Converter',
    description: 'Extract plain text from your PowerPoint presentations.',
    fromFormat: 'PPT',
    toFormat: 'Text',
    type: 'office-to-text',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
