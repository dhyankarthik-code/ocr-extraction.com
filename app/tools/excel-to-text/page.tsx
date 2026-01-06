import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Text Converter - Free Galaxy OCR',
    description: 'Extract text from Excel spreadsheets (.xlsx, .xls) instantly. Free online tool converts cells and data to plain text. No signup required.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/excel-to-text',
    },
}

const config: ToolConfig = {
    id: 'excel-to-text',
    title: 'Excel to Text Converter',
    description: 'Extract plain text from your Excel spreadsheets.',
    fromFormat: 'Excel',
    toFormat: 'Text',
    type: 'office-to-text',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
