import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Image Converter - Free Galaxy OCR',
    description: 'Convert Excel to Image.',
}

const config: ToolConfig = {
    id: 'excel-to-image',
    title: 'Excel to Image Converter',
    description: 'Convert Excel spreadsheets to Image (PNG/JPG).',
    fromFormat: 'Excel',
    toFormat: 'Image',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
