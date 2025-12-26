import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to PPT Converter - Free Galaxy OCR',
    description: 'Convert Word documents to PowerPoint presentations.',
    alternates: { canonical: '/tools/word-to-ppt' },
}

const config: ToolConfig = {
    id: 'word-to-ppt',
    title: 'Word to PPT Converter',
    description: 'Convert Word document paragraphs into PowerPoint slides.',
    fromFormat: 'Word',
    toFormat: 'PPT',
    type: 'office-to-ppt',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
