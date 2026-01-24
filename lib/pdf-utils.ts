import { jsPDF } from "jspdf"

/**
 * Generates a PDF from the provided text and triggers a download.
 * Handles pagination automatically to prevent content cutoff.
 * 
 * @param text The full text content to include in the PDF
 * @param fileName The desired filename (without extension)
 */
export const generatePdfFromText = (text: string, fileName: string) => {
    try {
        const doc = new jsPDF()

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 15
        const maxLineWidth = pageWidth - (margin * 2)
        const fontSize = 11
        const lineHeight = 7

        // Set font
        doc.setFont("helvetica", "normal")
        doc.setFontSize(fontSize)

        // Clean text to remove characters that might cause issues (basic sanitization)
        // jsPDF handles most things, but let's be safe against control chars
        // Preserving newlines/tabs is important, so we only strip obscure control chars
        // Range: 0-8, 11-12, 14-31 (allowing 9=tab, 10=LF, 13=CR)
        const cleanText = text.replaceAll(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")

        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(cleanText, maxLineWidth)

        let cursorY = 20

        // Add content page by page
        lines.forEach((line: string) => {
            // Check if we need a new page
            // We buffer by 'margin' at the bottom to ensure clean breaks
            if (cursorY > pageHeight - margin) {
                doc.addPage()
                cursorY = 20
            }
            doc.text(line, margin, cursorY)
            cursorY += lineHeight
        })

        doc.save(`${fileName}.pdf`)
        return true
    } catch (error) {
        console.error("PDF generation failed:", error)
        return false
    }
}
