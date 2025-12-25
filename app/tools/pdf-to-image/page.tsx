import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Image Converter - Free Galaxy OCR',
    description: 'Convert PDF pages to Images.',
}

const config: ToolConfig = {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    description: 'Convert each page of your PDF into high-quality images (JPG/PNG).',
    fromFormat: 'PDF',
    toFormat: 'Image',
    type: 'coming-soon', // PDF to Image needs specific handling not in generic OCR yet
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
