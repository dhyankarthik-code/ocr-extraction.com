import GenericTool, { ToolConfig } from "@/components/tools/generic-tool"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Image to Text Converter',
    description: 'Convert images (JPG, PNG, WebP) to editable text instantly with AI-powered OCR. Free online tool with 99% accuracy. No signup required.',
    alternates: {
        canonical: 'https://www.ocr-extraction.com/tools/image-to-text',
    },
}

const config: ToolConfig = {
    id: 'image-to-text',
    title: 'Image to Text Converter',
    description: 'Extract plain text from images (JPG, PNG, WebP) instantly.',
    fromFormat: 'Image',
    toFormat: 'Text',
    type: 'ocr',
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    content: (
        <>
            <p>
                Our <strong>Free Image to Text Converter</strong> allows you to extract text from images instantly.
                Whether you have a scanned document, a screenshot, or a photo of notes, our OCR technology
                recognizes characters with high accuracy and converts them into editable text.
            </p>
            <h3>Key Features:</h3>
            <ul>
                <li><strong>100% Free:</strong> No daily limits or hidden costs.</li>
                <li><strong>No Signup Required:</strong> Start converting immediately.</li>
                <li><strong>Multiple Formats:</strong> Supports JPG, PNG, and WebP.</li>
                <li><strong>Privacy Focused:</strong> Files are processed securely.</li>
            </ul>
        </>
    ),
    faq: [
        {
            question: "Is this Image to Text tool really free?",
            answer: "Yes, it is completely free to use directly in your browser. There are no limits on the number of files you can process."
        },
        {
            question: "How accurate is the OCR extraction?",
            answer: "We use advanced OCR models (including Mistral/VLM) to ensure high accuracy, even with handwritten text or low-quality images."
        },
        {
            question: "Do I need to install any software?",
            answer: "No, this is a web-based tool. You can access it from any device (PC, Mobile, Tablet) without installing anything."
        }
    ]
}

export default function Page() {
    return <GenericTool config={config} />
}
