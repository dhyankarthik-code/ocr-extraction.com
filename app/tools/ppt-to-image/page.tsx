import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PPT to Image Converter - Free Galaxy OCR',
    description: 'Convert PowerPoint presentations (.pptx, .ppt) to images. Extract every slide as a separate PNG image. Free online tool.',
    alternates: {
        canonical: '/tools/ppt-to-image',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PPT to Image Converter - Free Galaxy OCR',
        description: 'Convert PowerPoint slides to images instantly. Free online tool.',
    },
}

const config: ToolConfig = {
    id: 'ppt-to-image',
    title: 'PPT to Image Converter',
    description: 'Convert PowerPoint presentation slides into high-quality PNG images.',
    fromFormat: 'PPT',
    toFormat: 'Image',
    type: 'office-to-image',
    accept: {
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
