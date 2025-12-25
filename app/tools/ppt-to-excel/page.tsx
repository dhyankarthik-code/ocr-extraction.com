import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Excel Converter - Free Galaxy OCR',
    description: 'Convert PPT to Excel.',
}

const config: ToolConfig = {
    id: 'ppt-to-excel',
    title: 'PPT to Excel Converter',
    description: 'Convert PowerPoint data to Excel spreadsheets.',
    fromFormat: 'PPT',
    toFormat: 'Excel',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
