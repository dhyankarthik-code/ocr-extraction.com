import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to PPT Converter - Free Galaxy OCR',
    description: 'Convert Excel spreadsheets to PowerPoint presentations. Transform data into slides automatically. Free online tool with client-side processing.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/excel-to-ppt',
    },
}

const config: ToolConfig = {
    id: 'excel-to-ppt',
    title: 'Excel to PPT Converter',
    description: 'Convert Excel spreadsheet data into PowerPoint slides.',
    fromFormat: 'Excel',
    toFormat: 'PPT',
    type: 'office-to-ppt',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
