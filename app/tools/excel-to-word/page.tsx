import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Word Converter - Free Galaxy OCR',
    description: 'Convert Excel spreadsheets to Word documents. Transform rows and cells into paragraphs.',
    alternates: {
        canonical: '/tools/excel-to-word',
    },
}

const config: ToolConfig = {
    id: 'excel-to-word',
    title: 'Excel to Word Converter',
    description: 'Convert Excel spreadsheet content into Word paragraphs.',
    fromFormat: 'Excel',
    toFormat: 'Word',
    type: 'office-to-word',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
