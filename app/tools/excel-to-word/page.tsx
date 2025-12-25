import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Word Converter - Free Galaxy OCR',
    description: 'Convert Excel spreadsheets to Word documents.',
}

const config: ToolConfig = {
    id: 'excel-to-word',
    title: 'Excel to Word Converter',
    description: 'Convert Excel spreadsheet data into a Word document (DOCX).',
    fromFormat: 'Excel',
    toFormat: 'Word',
    type: 'ocr', // Uses text extraction
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'],
        'text/csv': ['.csv']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
