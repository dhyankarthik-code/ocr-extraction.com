import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PDF to Word Converter',
    description: 'Convert PDF files to editable Word documents. Extract text and paragraphs. Client-side processing for privacy.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/pdf-to-word',
    },
}

const config: ToolConfig = {
    id: 'pdf-to-word',
    title: 'PDF to Word Converter',
    description: 'Convert PDF text content into editable Word documents.',
    fromFormat: 'PDF',
    toFormat: 'Word',
    type: 'office-to-word',
    accept: {
        'application/pdf': ['.pdf']
    },
    content: (
        <>
            <p>
                The <strong>PDF to Word Converter</strong> is the easiest way to turn non-editable PDF documents back into Microsoft Word files.
                Whether it's a resume, a contract, or a school assignment, our tool extracts paragraphs and headings, preserving as much structure as possible.
            </p>
            <h3>Why Use Our PDF to Word Tool?</h3>
            <ul>
                <li><strong>Privacy First:</strong> Files are processed locally in your browser when possible.</li>
                <li><strong>Fast Conversion:</strong> Get your editable .docx file in seconds.</li>
                <li><strong>No Watermarks:</strong> Professional quality output without branding.</li>
            </ul>
        </>
    ),
    faq: [
        {
            question: "Will my document formatting be preserved?",
            answer: "We strive to keep paragraphs and basic structure intact. Complex tables or layouts might need some adjustment in Word."
        },
        {
            question: "Is it safe to upload confidential PDFs?",
            answer: "Yes. For many operations, we use client-side processing, meaning your file doesn't leave your computer. For OCR-heavy tasks, we use secure processing."
        }
    ]
}

export default function Page() {
    return <GenericTool config={config} />
}
