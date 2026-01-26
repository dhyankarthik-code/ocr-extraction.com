import { jsPDF } from "jspdf"

/**
 * Sanitizes text for PDF generation by replacing problematic Unicode characters
 * with ASCII equivalents. jsPDF's default fonts don't support many Unicode chars.
 */
const sanitizeTextForPdf = (text: string): string => {
    return text
        // Control characters (keep tab, LF, CR)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
        // Smart quotes to straight quotes
        .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
        .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
        // Dashes
        .replace(/[\u2013\u2014\u2015]/g, "-")
        // Bullets and list markers
        .replace(/[\u2022\u2023\u2043\u25AA\u25AB\u25CF\u25CB\u25E6\u2219]/g, "-")
        // Ellipsis
        .replace(/\u2026/g, "...")
        // Arrows
        .replace(/[\u2190-\u21FF]/g, "->")
        // Non-breaking space
        .replace(/\u00A0/g, " ")
        // Other common problematic chars
        .replace(/[\u2022\u00B7]/g, "-")
        // Remove any remaining non-ASCII that could cause issues
        // But preserve common accented Latin chars (keep basic extended Latin)
        .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, " ")
}

/**
 * Generates a PDF from the provided text and triggers a download.
 * Handles pagination automatically to prevent content cutoff.
 * 
 * @param text The full text content to include in the PDF
 * @param fileName The desired filename (without extension)
 */
export const generatePdfFromText = (text: string, fileName: string): boolean => {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        })

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const marginLeft = 15
        const marginRight = 15
        const marginTop = 20
        const marginBottom = 20
        const maxLineWidth = pageWidth - marginLeft - marginRight
        const fontSize = 10
        const lineHeight = 5

        // Set font
        doc.setFont("helvetica", "normal")
        doc.setFontSize(fontSize)

        // Sanitize and clean text
        const cleanText = sanitizeTextForPdf(text)

        // Split text by line breaks first to preserve paragraph structure
        const paragraphs = cleanText.split(/\r?\n/)

        let cursorY = marginTop
        let pageNumber = 1

        // Add page number footer
        const addPageNumber = () => {
            doc.setFontSize(8)
            doc.setTextColor(150)
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })
            doc.setFontSize(fontSize)
            doc.setTextColor(0)
        }

        paragraphs.forEach((paragraph) => {
            // Skip empty paragraphs but add spacing
            if (!paragraph.trim()) {
                cursorY += lineHeight / 2
                return
            }

            // Split paragraph into lines that fit the page width
            const lines = doc.splitTextToSize(paragraph, maxLineWidth)

            lines.forEach((line: string) => {
                // Check if we need a new page (with margin buffer)
                if (cursorY > pageHeight - marginBottom - lineHeight) {
                    addPageNumber()
                    doc.addPage()
                    pageNumber++
                    cursorY = marginTop
                }

                // Draw the line
                doc.text(line, marginLeft, cursorY)
                cursorY += lineHeight
            })

            // Add small spacing between paragraphs
            cursorY += lineHeight / 3
        })

        // Add page number to the last page
        addPageNumber()

        // Save the PDF
        doc.save(`${fileName}.pdf`)
        return true
    } catch (error) {
        console.error("PDF generation failed:", error)
        return false
    }
}

