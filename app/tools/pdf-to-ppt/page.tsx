import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to PPT Converter - Free Galaxy OCR',
    description: 'Convert PDF files to PowerPoint presentations instantly.',
}

const config: ToolConfig = {
    id: 'pdf-to-ppt',
    title: 'PDF to PPT Converter',
    description: 'Convert your PDF documents to editable PowerPoint (PPTX) slides.',
    fromFormat: 'PDF',
    toFormat: 'PPT',
    type: 'ocr',
    accept: {
        'application/pdf': ['.pdf']
    }
}

export default function Page() {
    return <GenericTool config={config} />
}
