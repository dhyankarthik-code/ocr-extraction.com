import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Text Converter - Free Galaxy OCR',
    description: 'Convert Excel spreadsheets to plain text.',
}

const config: ToolConfig = {
    id: 'excel-to-text',
    title: 'Excel to Text Converter',
    description: 'Extract text data from Excel spreadsheets (.xlsx, .xls, .csv).',
    fromFormat: 'Excel',
    toFormat: 'Text',
    type: 'ocr',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'],
        'text/csv': ['.csv']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
