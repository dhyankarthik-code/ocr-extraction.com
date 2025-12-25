import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to PDF Converter - Free Galaxy OCR',
    description: 'Convert Images to PDF documents.',
}

const config: ToolConfig = {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    description: 'Convert your images into a single PDF document.',
    fromFormat: 'Image',
    toFormat: 'PDF',
    type: 'client-convert', // Can simply wrap image in PDF client side
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
