import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to Word Converter - Free Galaxy OCR',
    description: 'Convert images to Word documents using OCR. Extract text from photos and scans into editable Word files.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/image-to-word',
    },
}

const config: ToolConfig = {
    id: 'image-to-word',
    title: 'Image to Word Converter',
    description: 'Extract text from images using OCR and save as Word documents.',
    fromFormat: 'Image',
    toFormat: 'Word',
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
