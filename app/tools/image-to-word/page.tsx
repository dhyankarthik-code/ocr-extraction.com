import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to Word Converter - Free Galaxy OCR',
    description: 'Convert Images (JPG, PNG) to editable Word documents.',
}

const config: ToolConfig = {
    id: 'image-to-word',
    title: 'Image to Word Converter',
    description: 'Convert your images to editable Word (DOCX) files using advanced OCR.',
    fromFormat: 'Image',
    toFormat: 'Word',
    type: 'coming-soon',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
