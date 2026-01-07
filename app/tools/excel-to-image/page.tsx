import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Image Converter - Free Galaxy OCR',
    description: 'Convert Excel spreadsheets (.xlsx, .xls) to high-quality PNG images. Each sheet becomes a separate image. Free online tool, no signup.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/excel-to-image',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Excel to Image Converter - Free Galaxy OCR',
        description: 'Convert Excel sheets to images instantly. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'excel-to-image',
    title: 'Excel to Image Converter',
    description: 'Convert Excel spreadsheets into high-quality PNG images. Each sheet will be converted.',
    fromFormat: 'Excel',
    toFormat: 'Image',
    type: 'office-to-image',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
