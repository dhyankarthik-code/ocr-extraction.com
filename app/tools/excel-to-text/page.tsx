import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Excel to Text Converter',
    description: 'Extract text from Excel spreadsheets (.xlsx, .xls) instantly. Free online tool converts cells and data to plain text. No signup required.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/excel-to-text',
    },
}

const config: ToolConfig = {
    id: 'excel-to-text',
    title: 'Excel to Text Converter',
    description: 'Extract plain text from your Excel spreadsheets.',
    fromFormat: 'Excel',
    toFormat: 'Text',
    type: 'office-to-text',
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    },
    content: (
        <>
            <p>
                Our <strong>Excel to Text Converter</strong> allows you to extract data from spreadsheets into a simple text format.
                This is useful for processing data, programming, or simply reading spreadsheet content without Excel installed.
            </p>
            <h3>Why Conversion Matters:</h3>
            <ul>
                <li><strong>Universal Access:</strong> Text files can be opened on any device.</li>
                <li><strong>Data Processing:</strong> Easier to parse for developers.</li>
                <li><strong>Secure & Free:</strong> Browser-based conversion ensures your data stays private.</li>
            </ul>
        </>
    ),
    faq: [
        {
            question: "Does it convert all sheets?",
            answer: "Currently, it extracts values from the active sheet or lets you choose. For complex multi-sheet workbooks, converting individually is recommended."
        },
        {
            question: "What happens to formulas?",
            answer: "Only the calculated values are extracted, not the underlying formulas."
        }
    ]
}

export default function Page() {
    return <GenericTool config={config} />
}
