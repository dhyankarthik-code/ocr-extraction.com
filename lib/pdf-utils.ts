import { jsPDF } from "jspdf"
import "jspdf-autotable"

/**
 * Sanitizes text for PDF generation by replacing problematic Unicode characters
 * with ASCII equivalents. jsPDF's default fonts don't support many Unicode chars.
 */
const sanitizeTextForPdf = (text: string): string => {
    return text
        // Control characters (keep tab, LF, CR)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
        // Smart quotes to straight quotes
        .replaceAll(/[\u2018\u2019\u201A\u201B]/g, "'")
        .replaceAll(/[\u201C\u201D\u201E\u201F]/g, '"')
        // Dashes
        .replaceAll(/[\u2013\u2014\u2015]/g, "-")
        // Bullets and list markers
        .replaceAll(/[\u2022\u2023\u2043\u25AA\u25AB\u25CF\u25CB\u25E6\u2219]/g, "-")
        // Ellipsis
        .replaceAll(/\u2026/g, "...")
        // Arrows
        .replaceAll(/[\u2190-\u21FF]/g, "->")
        // Non-breaking space
        .replaceAll(/\u00A0/g, " ")
        // Common Currency - ensure they are represented safely if obscure
        .replaceAll(/\u20AC/g, "EUR ") // Euro
        // Other common problematic chars
        .replaceAll(/[\u2022\u00B7]/g, "-")
        // Remove any remaining non-ASCII that could cause issues
        // But preserve common accented Latin chars (keep basic extended Latin)
        .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, " ")
}

/**
 * Parses markdown text into blocks of Text and Tables
 */
interface ContentBlock {
    type: 'text' | 'table';
    content: string | string[][];
    headers?: string[];
}

const parseMarkdownToBlocks = (text: string): ContentBlock[] => {
    const lines = text.split(/\r?\n/);
    const blocks: ContentBlock[] = [];
    let currentTextBuffer: string[] = [];
    let currentTableRows: string[][] = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        // Check if line looks like a table row (starts/ends with | or contains | separators)
        // Loose check: contains '|' and has multiple segments
        const isTableRow = line.includes('|') && line.split('|').length > 1;
        const isStrictSeparator = isTableRow && line.replace(/\|/g, '').trim().match(/^[-: ]+$/);

        if (isTableRow) {
            if (!inTable) {
                // Determine if this is start of a new table
                // RELAXED LOGIC: If it looks like a table row (has pipes), check if it's worth starting a table.
                // We check if:
                // 1. It is a strict separator line (unlikely to start here but possible)
                // 2. The NEXT line is a separator
                // 3. The NEXT line is ALSO a table row (contiguous rows = table)
                // 4. This line itself has multiple columns (>2) implying structure

                const nextLine = lines[i + 1]?.trim();
                const nextIsTableRow = nextLine?.includes('|') && nextLine.split('|').length > 1;
                const nextIsSeparator = nextLine?.includes('|') && nextLine.replace(/\|/g, '').trim().match(/^[-: ]+$/);

                if (isStrictSeparator || nextIsSeparator || nextIsTableRow || line.split('|').length > 2) {
                    // Flush text buffer
                    if (currentTextBuffer.length > 0) {
                        blocks.push({ type: 'text', content: currentTextBuffer.join('\n') });
                        currentTextBuffer = [];
                    }
                    inTable = true;
                }
            }

            if (inTable) {
                if (isStrictSeparator) {
                    // Skip PURE separator lines (--- | ---)
                    // If the line contains actual text mixed with separators (OCR artifact), we treat it as data below
                } else {
                    const cells = line.split('|')
                        .map(c => c.trim().replace(/\*\*|__/g, '')) // Clean markdown styling

                    // Filter empty start/end if present
                    if (line.startsWith('|')) cells.shift();
                    if (line.endsWith('|')) cells.pop();

                    currentTableRows.push(cells);
                }
            } else {
                currentTextBuffer.push(rawLine); // Keep original indentation
            }
        } else {
            if (inTable) {
                // End of table
                if (currentTableRows.length > 0) {
                    blocks.push({
                        type: 'table',
                        content: currentTableRows.slice(1), // Body
                        headers: currentTableRows[0] // First row is header
                    });
                    currentTableRows = [];
                }
                inTable = false;
            }
            currentTextBuffer.push(rawLine);
        }
    }

    // Flush remaining
    if (inTable && currentTableRows.length > 0) {
        blocks.push({
            type: 'table',
            content: currentTableRows.slice(1),
            headers: currentTableRows[0]
        });
    }
    if (currentTextBuffer.length > 0) {
        blocks.push({ type: 'text', content: currentTextBuffer.join('\n') });
    }

    return blocks;
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
        const marginLeft = 20
        const marginRight = 20
        const marginTop = 20
        const marginBottom = 30 // Increased margin to prevent cutoff
        const maxLineWidth = pageWidth - marginLeft - marginRight
        const fontSize = 10
        const lineHeight = (fontSize * doc.getLineHeightFactor()) / doc.internal.scaleFactor

        // Set font
        doc.setFont("helvetica", "normal")
        doc.setFontSize(fontSize)

        const cleanText = sanitizeTextForPdf(text)
        const blocks = parseMarkdownToBlocks(cleanText)

        // Use autoTable type augmentation
        const docWithAutoTable = doc as any;

        let cursorY = marginTop
        let pageNumber = 1

        const addPageNumber = () => {
            doc.setFontSize(8)
            doc.setTextColor(150)
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })
            doc.setFontSize(fontSize)
            doc.setTextColor(0)
        }

        const checkNewPage = (neededSpace: number = lineHeight) => {
            // Add a buffer of 1 extra line height to be safe
            if (cursorY + neededSpace + 2 > pageHeight - marginBottom) {
                addPageNumber()
                doc.addPage()
                pageNumber++
                cursorY = marginTop
                doc.setFont("helvetica", "normal") // Reset font in case it was changed
                doc.setFontSize(fontSize)
                return true
            }
            return false
        }

        blocks.forEach((block) => {
            if (block.type === 'text') {
                const paragraphs = (block.content as string).split(/\r?\n/)

                paragraphs.forEach(paragraph => {
                    checkNewPage(lineHeight) // Check before starting paragraph

                    if (!paragraph.trim()) {
                        cursorY += lineHeight / 2
                        return
                    }

                    const lines = doc.splitTextToSize(paragraph, maxLineWidth)
                    lines.forEach((line: string) => {
                        checkNewPage(lineHeight) // Check for each line
                        doc.text(line, marginLeft, cursorY)
                        cursorY += lineHeight
                    })
                    cursorY += lineHeight / 3
                })

                cursorY += lineHeight // Gap after text block
            } else if (block.type === 'table') {
                checkNewPage(20) // Ensure some space for header

                docWithAutoTable.autoTable({
                    startY: cursorY,
                    head: [block.headers],
                    body: block.content,
                    margin: { left: marginLeft, right: marginRight, bottom: marginBottom },
                    theme: 'grid',
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [220, 53, 69] }, // Red header to match brand
                    pageBreak: 'auto',
                });

                // Robustly update cursorY using finalY from autoTable
                if (docWithAutoTable.lastAutoTable && docWithAutoTable.lastAutoTable.finalY) {
                    cursorY = docWithAutoTable.lastAutoTable.finalY + 10;
                }

                // Update pageNumber tracking
                pageNumber = doc.getNumberOfPages()
            }
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

