import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to Excel Converter - Free Galaxy OCR',
    description: 'Convert plain text to Excel spreadsheets. Free online tool to transform your text and CSV files into XLSX format.',
    alternates: {
        canonical: '/tools/text-to-excel',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Text to Excel Converter - Free Galaxy OCR',
        description: 'Convert plain text to Excel spreadsheets. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'text-to-excel',
    title: 'Text to Excel Converter',
    description: 'Convert plain text files (.txt, .csv) to Excel spreadsheets (XLSX).',
    fromFormat: 'Text',
    toFormat: 'Excel',
    type: 'client-convert',
    accept: {
        'text/plain': ['.txt', '.csv']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
