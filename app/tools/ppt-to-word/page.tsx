import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Word Converter - Free Galaxy OCR',
    description: 'Convert PowerPoint presentations to Word documents. Extract slide text into paragraphs.',
    alternates: {
        canonical: '/tools/ppt-to-word',
    },
}

const config: ToolConfig = {
    id: 'ppt-to-word',
    title: 'PPT to Word Converter',
    description: 'Extract text from PowerPoint slides and save as Word documents.',
    fromFormat: 'PPT',
    toFormat: 'Word',
    type: 'office-to-word',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
