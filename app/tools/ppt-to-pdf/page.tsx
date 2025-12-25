import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to PDF Converter - Free Galaxy OCR',
    description: 'Convert PPT to PDF.',
}

const config: ToolConfig = {
    id: 'ppt-to-pdf',
    title: 'PPT to PDF Converter',
    description: 'Convert PowerPoint presentations to PDF documents.',
    fromFormat: 'PPT',
    toFormat: 'PDF',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
