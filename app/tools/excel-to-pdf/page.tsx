import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to PDF Converter - Free Galaxy OCR',
    description: 'Convert Excel to PDF.',
}

const config: ToolConfig = {
    id: 'excel-to-pdf',
    title: 'Excel to PDF Converter',
    description: 'Convert Excel spreadsheets to PDF documents.',
    fromFormat: 'Excel',
    toFormat: 'PDF',
    type: 'coming-soon', // Requires layout engine
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
