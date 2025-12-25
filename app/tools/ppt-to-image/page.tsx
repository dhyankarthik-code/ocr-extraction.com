import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Image Converter - Free Galaxy OCR',
    description: 'Convert PPT to Image.',
}

const config: ToolConfig = {
    id: 'ppt-to-image',
    title: 'PPT to Image Converter',
    description: 'Convert PowerPoint slides to Images.',
    fromFormat: 'PPT',
    toFormat: 'Image',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
