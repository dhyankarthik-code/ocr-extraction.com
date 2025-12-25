import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to PPT Converter - Free Galaxy OCR',
    description: 'Convert Excel to PowerPoint.',
}

const config: ToolConfig = {
    id: 'excel-to-ppt',
    title: 'Excel to PPT Converter',
    description: 'Convert Excel data to PowerPoint slides.',
    fromFormat: 'Excel',
    toFormat: 'PPT',
    type: 'ocr', // Uses text extraction
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
