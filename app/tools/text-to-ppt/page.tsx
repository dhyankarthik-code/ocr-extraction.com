import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Text to PPT Converter - Free Galaxy OCR',
    description: 'Convert plain text to PowerPoint slides.',
}

const config: ToolConfig = {
    id: 'text-to-ppt',
    title: 'Text to PPT Converter',
    description: 'Convert plain text files (.txt) to PowerPoint presentations (PPTX).',
    fromFormat: 'Text',
    toFormat: 'PPT',
    type: 'client-convert',
    accept: {
        'text/plain': ['.txt']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
