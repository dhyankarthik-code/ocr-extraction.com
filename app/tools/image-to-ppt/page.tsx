import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Image to PPT Converter - Free Galaxy OCR',
    description: 'Convert Images to PowerPoint slides.',
}

const config: ToolConfig = {
    id: 'image-to-ppt',
    title: 'Image to PPT Converter',
    description: 'Convert images to PowerPoint (PPTX) presentations.',
    fromFormat: 'Image',
    toFormat: 'PPT',
    type: 'ocr',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
