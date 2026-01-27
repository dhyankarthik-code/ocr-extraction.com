import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Text Converter',
    description: 'Extract raw text from PDF files instantly. Best for analyzing content, coding, or editing without formatting. Free and secure.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/pdf-to-text',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-text',
    title: 'PDF to Text Converter',
    description: 'Extract raw text from PDF files for editing or analysis.',
    fromFormat: 'PDF',
    toFormat: 'Text',
    type: 'office-to-text',
    accept: {
        'application/pdf': ['.pdf']
    },
    content: (
        <>
            <p>
                Need to grab the text from a PDF without the messy formatting? Our <strong>PDF to Text Converter</strong> creates a clean, plain text file (.txt)
                from your documents. This is ideal for developers, data analysts, or anyone who just needs the words.
            </p>
            <h3>Features:</h3>
            <ul>
                <li><strong>Clean Output:</strong> Strips away images and styling, leaving only text.</li>
                <li><strong>Batch Processing:</strong> Upload multiple PDFs to extract text from all of them.</li>
                <li><strong>100% Free:</strong> Unlimited usage for all your text extraction needs.</li>
            </ul>
        </>
    ),
    faq: [
        {
            question: "Does this work with scanned PDFs?",
            answer: "For scanned PDFs (images), please use our 'Image to Text' tool. This tool works best with native digitally created PDFs."
        },
        {
            question: "Can I copy the text directly?",
            answer: "Yes, once converted, you can download the text file or copy the content directly from our interface."
        }
    ]
}

export default function Page() {
    return <GenericTool config={config} />
}
