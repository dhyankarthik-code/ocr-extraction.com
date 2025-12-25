import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to Text Converter - Free Galaxy OCR',
    description: 'Extract Text from Images.',
}

const config: ToolConfig = {
    id: 'image-to-text',
    title: 'Image to Text Converter',
    description: 'Extract plain text from images (JPG, PNG, WebP) instantly.',
    fromFormat: 'Image',
    toFormat: 'Text',
    type: 'ocr',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
