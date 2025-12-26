import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to PPT Converter - Free Galaxy OCR',
    description: 'Convert Images to PowerPoint using OCR text extraction.',
    alternates: { canonical: '/tools/image-to-ppt' },
}

const config: ToolConfig = {
    id: 'image-to-ppt',
    title: 'Image to PPT Converter',
    description: 'Extract text from images using OCR and create PowerPoint slides.',
    fromFormat: 'Image',
    toFormat: 'PPT',
    type: 'ocr',
    accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
