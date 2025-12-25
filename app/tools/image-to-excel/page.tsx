import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to Excel Converter - Free Galaxy OCR',
    description: 'Convert Images to Excel spreadsheets.',
}

const config: ToolConfig = {
    id: 'image-to-excel',
    title: 'Image to Excel Converter',
    description: 'Convert image data (tables, invoices) to Excel (XLSX) spreadsheets.',
    fromFormat: 'Image',
    toFormat: 'Excel',
    type: 'coming-soon',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
