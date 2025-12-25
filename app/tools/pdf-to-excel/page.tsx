import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Excel Converter - Free Galaxy OCR',
    description: 'Convert PDF files to Excel spreadsheets instantly.',
}

const config: ToolConfig = {
    id: 'pdf-to-excel',
    title: 'PDF to Excel Converter',
    description: 'Convert your PDF tables to editable Excel (XLSX) spreadsheets.',
    fromFormat: 'PDF',
    toFormat: 'Excel',
    type: 'coming-soon',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
