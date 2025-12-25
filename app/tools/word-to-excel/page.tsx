import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Word to Excel Converter - Free Galaxy OCR',
    description: 'Convert Word to Excel.',
}

const config: ToolConfig = {
    id: 'word-to-excel',
    title: 'Word to Excel Converter',
    description: 'Convert Word document tables to Excel spreadsheets.',
    fromFormat: 'Word',
    toFormat: 'Excel',
    type: 'coming-soon',
    accept: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
