import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to Image Converter - Free Galaxy OCR',
    description: 'Convert Word to Image.',
}

const config: ToolConfig = {
    id: 'word-to-image',
    title: 'Word to Image Converter',
    description: 'Convert Word pages to Images.',
    fromFormat: 'Word',
    toFormat: 'Image',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
