import type { Document, Packer, Paragraph, TextRun } from 'docx'
// import { utils, write, read } from 'xlsx'
import type PptxGenJS from 'pptxgenjs'
import type jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import mammoth from 'mammoth'
import type JSZip from 'jszip'

// Helper to load pdfjs-dist dynamically to avoid SSR issues
async function getPdfJs() {
    const pdfjs = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
        // Use the worker from public folder
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
    return pdfjs;
}

// Dynamic import helpers
async function getDocx() { return import('docx'); }
async function getXlsx() { return import('xlsx'); }
async function getPptxGen() { return (await import('pptxgenjs')).default; }
async function getJsPDF() { return (await import('jspdf')).default; }
async function getAutoTable() { return (await import('jspdf-autotable')).default; }
async function getMammoth() { return (await import('mammoth')); }
async function getJSZip() { return (await import('jszip')).default; }


// Helper to parse text into a grid for Excel (Shared Logic)
const parseTextToGrid = (text: string): string[][] => {
    if (!text) return [[]]

    const lines = text.split('\n');



    const rows = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return [];

        if (trimmedLine.includes('|')) {
            // Markdown Table Logic
            const cells = trimmedLine.split('|').map(cell => {
                // Clean Markdown formatting (bold, italics)
                return cell.replace(/\*\*|__/g, '').trim();
            });

            // Remove empty start/end cells that result from | start | end | style
            const validCells = cells.filter((cell, index, arr) => {
                if (index === 0 && cell === '') return false;
                if (index === arr.length - 1 && cell === '') return false;
                return true;
            });

            // Check for separator line (e.g. "---", ":---", "---:")
            const isSeparator = validCells.every(cell => cell.match(/^[-:]+$/));
            if (isSeparator) return null; // Signal to filter this row out entirely

            return validCells;
        } else {
            // Fallback: Split by tabs or 2+ spaces
            return line.split(/\t|\s{2,}/).map(cell => cell.trim()).filter(cell => cell.length > 0);
        }
    });

    // Filter out null rows (separator lines) and ensure we return string[][]
    return rows.filter((row): row is string[] => row !== null && row.length > 0);
}


export const generateWord = async (text: string): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const doc = new Document({
        sections: [{
            properties: {},
            children: text.split('\n').map((line: string) => new Paragraph({
                children: [new TextRun(line)],
            })),
        }],
    });

    return await Packer.toBlob(doc);
}

export const generateMergedWord = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const children: Paragraph[] = [];

    fileStates.forEach((fs, index) => {
        const text = fs.result?.text || "";
        const lines = text.split('\n');

        lines.forEach((line: string, lineIndex: number) => {
            children.push(new Paragraph({
                children: [new TextRun(line)],
                // Add page break before the first paragraph of each file (except the first one)
                pageBreakBefore: index > 0 && lineIndex === 0
            }));
        });
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children
        }],
    });

    return await Packer.toBlob(doc);
}

export const generateExcel = async (text: string): Promise<Blob> => {
    const { utils, write } = await getXlsx();
    const wb = utils.book_new();

    const gridData = parseTextToGrid(text);
    const ws = utils.aoa_to_sheet(gridData);

    utils.book_append_sheet(wb, ws, "Sheet1");

    // Auto-width column
    const colWidths = gridData[0]?.map((_, colIndex) => ({
        wch: Math.min(50, Math.max(...gridData.map(row => (row[colIndex] || "").length)) + 2)
    })) || [{ wch: 20 }]
    ws['!cols'] = colWidths;

    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
}

export const generateMergedExcel = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const { utils, write } = await getXlsx();
    const wb = utils.book_new();

    fileStates.forEach((fs, index) => {
        const text = fs.result?.text || "";
        const gridData = parseTextToGrid(text);
        const ws = utils.aoa_to_sheet(gridData);

        // Auto-width column
        const colWidths = gridData[0]?.map((_, colIndex) => ({
            wch: Math.min(50, Math.max(...gridData.map(row => (row[colIndex] || "").length)) + 2)
        })) || [{ wch: 20 }]
        ws['!cols'] = colWidths;

        utils.book_append_sheet(wb, ws, `File ${index + 1}`);
    });

    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
}

export const generatePPT = async (text: string): Promise<Blob> => {
    const PptxGenModule = await getPptxGen();
    const pres = new PptxGenModule();
    const lines = text.split('\n');
    const linesPerSlide = 15;

    for (let i = 0; i < lines.length; i += linesPerSlide) {
        const slide = pres.addSlide();
        const slideText = lines.slice(i, i + linesPerSlide).join('\n');
        slide.addText(slideText, { x: 0.5, y: 0.5, w: '90%', h: '90%', fontSize: 14, color: '363636' });
    }

    return (await pres.write({ outputType: 'blob' })) as unknown as Blob;
}

export const generateMergedPPT = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const PptxGenModule = await getPptxGen();
    const pres = new PptxGenModule();

    for (const fs of fileStates) {
        const text = fs.result?.text || "";
        const lines = text.split('\n');
        const linesPerSlide = 15;

        for (let i = 0; i < lines.length; i += linesPerSlide) {
            const slide = pres.addSlide();
            const slideText = lines.slice(i, i + linesPerSlide).join('\n');
            slide.addText(slideText, { x: 0.5, y: 0.5, w: '90%', h: '90%', fontSize: 14, color: '363636' });
        }
    }

    return (await pres.write({ outputType: 'blob' })) as unknown as Blob;
}

export const generatePDF = async (text: string): Promise<Blob> => {
    const jsPDFModule = await getJsPDF();
    const doc = new jsPDFModule({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    const marginBottom = 20;
    const maxLineWidth = pageWidth - marginLeft - marginRight;

    const k = doc.internal.scaleFactor;
    const internal = doc.internal as any;
    const baseFontSize = typeof internal.getFontSize === "function"
        ? internal.getFontSize()
        : doc.getFontSize();
    const fontSizeInUnits = baseFontSize / k;
    const lineHeightFactor = typeof (doc as any).getLineHeightFactor === "function"
        ? (doc as any).getLineHeightFactor()
        : 1.15;
    const lineHeight = fontSizeInUnits * lineHeightFactor;

    const usableHeight = pageHeight - marginTop - marginBottom;
    const maxLinesPerPage = Math.max(1, Math.floor(usableHeight / lineHeight) - 1);

    const rawLines = text.replace(/\r\n/g, "\n").split("\n");
    let currentLine = 0;
    let y = marginTop;

    const advanceLine = (content: string | null) => {
        if (currentLine >= maxLinesPerPage) {
            doc.addPage();
            currentLine = 0;
            y = marginTop;
        }

        if (content && content.length > 0) {
            doc.text(content, marginLeft, y);
        }

        currentLine++;
        y += lineHeight;
    };

    for (const rawLine of rawLines) {
        if (!rawLine) {
            advanceLine("");
            continue;
        }

        const segments = doc.splitTextToSize(rawLine, maxLineWidth) as string[];
        for (const segment of segments) {
            advanceLine(segment);
        }
    }

    return doc.output('blob');
}

export const generatePDFFromImage = async (imageFile: File): Promise<Blob> => {
    const jsPDFModule = await getJsPDF();
    const doc = new jsPDFModule();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });

    // Calculate dimensions based on aspect ratio
    let pdfWidth = pageWidth;
    let pdfHeight = (img.height * pdfWidth) / img.width;

    if (pdfHeight > pageHeight) {
        pdfHeight = pageHeight;
        pdfWidth = (img.width * pdfHeight) / img.height;
    }

    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    let format = 'JPEG';
    if (imageFile.type.includes('png')) format = 'PNG';
    else if (imageFile.type.includes('webp')) format = 'WEBP';

    // Use canvas to get dataURL for more reliable addImage call
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(imageFile.type);
        doc.addImage(dataUrl, format, x, y, pdfWidth, pdfHeight);
    }

    URL.revokeObjectURL(url);
    return doc.output('blob');
}

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export const generateMergedPDFFromImages = async (imageFiles: File[]): Promise<Blob> => {
    const jsPDFModule = await getJsPDF();
    const doc = new jsPDFModule();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (i > 0) doc.addPage();

        const url = URL.createObjectURL(imageFile);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

        let pdfWidth = pageWidth;
        let pdfHeight = (img.height * pdfWidth) / img.width;

        if (pdfHeight > pageHeight) {
            pdfHeight = pageHeight;
            pdfWidth = (img.width * pdfHeight) / img.height;
        }

        const x = (pageWidth - pdfWidth) / 2;
        const y = (pageHeight - pdfHeight) / 2;

        let format = 'JPEG';
        if (imageFile.type.includes('png')) format = 'PNG';
        else if (imageFile.type.includes('webp')) format = 'WEBP';

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL(imageFile.type);
            doc.addImage(dataUrl, format, x, y, pdfWidth, pdfHeight);
        }
        URL.revokeObjectURL(url);
    }

    return doc.output('blob');
}

export const generateMergedPDF = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const jsPDFModule = await getJsPDF();
    const doc = new jsPDFModule({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    let isFirstPage = true;

    for (const fs of fileStates) {
        const { file, result } = fs;

        if (file.type.startsWith('image/')) {
            if (!isFirstPage) doc.addPage();

            const url = URL.createObjectURL(file);
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = (e) => {
                    console.error('Image load error:', e);
                    reject(new Error('Failed to load image'));
                };
                img.src = url;
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            let pdfWidth = pageWidth;
            let pdfHeight = (img.height * pdfWidth) / img.width;

            if (pdfHeight > pageHeight) {
                pdfHeight = pageHeight;
                pdfWidth = (img.width * pdfHeight) / img.height;
            }

            const x = (pageWidth - pdfWidth) / 2;
            const y = (pageHeight - pdfHeight) / 2;

            let format = 'JPEG';
            if (file.type.includes('png')) format = 'PNG';
            else if (file.type.includes('webp')) format = 'WEBP';

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL(`image/${file.type.split('/')[1]}`);
                doc.addImage(dataUrl, format, x, y, pdfWidth, pdfHeight);
            }

            URL.revokeObjectURL(url);
            isFirstPage = false;
        }
        else if (result?.text) {
            if (!isFirstPage) {
                doc.addPage();
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const marginLeft = 15;
            const marginRight = 15;
            const marginTop = 15;
            const marginBottom = 20;
            const maxLineWidth = pageWidth - marginLeft - marginRight;

            const k = doc.internal.scaleFactor;
            const internal = doc.internal as any;
            const baseFontSize = typeof internal.getFontSize === "function"
                ? internal.getFontSize()
                : doc.getFontSize();
            const fontSizeInUnits = baseFontSize / k;
            const lineHeightFactor = typeof (doc as any).getLineHeightFactor === "function"
                ? (doc as any).getLineHeightFactor()
                : 1.15;
            const lineHeight = fontSizeInUnits * lineHeightFactor;

            const usableHeight = pageHeight - marginTop - marginBottom;
            const maxLinesPerPage = Math.max(1, Math.floor(usableHeight / lineHeight) - 1);

            const rawLines = result.text.replace(/\r\n/g, "\n").split("\n");
            let currentLine = 0;
            let y = marginTop;

            const advanceLine = (content: string | null) => {
                if (currentLine >= maxLinesPerPage) {
                    doc.addPage();
                    currentLine = 0;
                    y = marginTop;
                }

                if (content && content.length > 0) {
                    doc.text(content, marginLeft, y);
                }

                currentLine++;
                y += lineHeight;
            };

            for (const rawLine of rawLines) {
                if (!rawLine) {
                    advanceLine("");
                    continue;
                }

                const segments = doc.splitTextToSize(rawLine, maxLineWidth) as string[];
                for (const segment of segments) {
                    advanceLine(segment);
                }
            }
            isFirstPage = false;
        }
    }

    return doc.output('blob');
}

export const generateImageFromText = (text: string): Promise<Blob> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(new Blob());
            return;
        }

        const lines = text.split('\n');
        const fontSize = 16;
        const lineHeight = 20;
        const padding = 40;

        ctx.font = `${fontSize}px Arial`;
        let maxWidth = 400;
        lines.forEach((line: string) => {
            const metrics = ctx.measureText(line);
            if (metrics.width > maxWidth) maxWidth = metrics.width;
        });

        canvas.width = Math.min(maxWidth + padding * 2, 2000); // Reasonably max width
        canvas.height = lines.length * lineHeight + padding * 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px Arial`;
        lines.forEach((line: string, i: number) => {
            ctx.fillText(line, padding, padding + (i + 1) * lineHeight);
        });

        canvas.toBlob((blob) => {
            resolve(blob || new Blob());
        }, 'image/png');
    });
}

/**
 * Convert Excel file to PDF
 * Uses xlsx to parse and jspdf-autotable for table rendering
 */
export const generatePDFFromExcel = async (file: File): Promise<Blob> => {
    const { utils, read } = await getXlsx();
    const jsPDFModule = await getJsPDF();
    const autoTable = await getAutoTable();

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);
    const doc = new jsPDFModule();

    let isFirstSheet = true;

    for (const sheetName of workbook.SheetNames) {
        if (!isFirstSheet) {
            doc.addPage();
        }
        isFirstSheet = false;

        const worksheet = workbook.Sheets[sheetName];
        let jsonData = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        // Filter out completely empty rows
        jsonData = jsonData.filter(row =>
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
        );

        if (jsonData.length === 0) continue;

        // Add sheet name as title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(sheetName, 14, 15);

        // Extract headers and body
        const headers = jsonData[0] || [];
        const body = jsonData.slice(1);

        // Use autoTable for nice table rendering
        autoTable(doc, {
            head: [headers.map(h => String(h || ''))],
            body: body.map(row =>
                Array.isArray(row)
                    ? row.map(cell => String(cell ?? ''))
                    : [String(row ?? '')]
            ),
            startY: 22,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [220, 53, 69], // Brand red color
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250],
            },
            margin: { top: 22 },
        });
    }

    return doc.output('blob');
};

/**
 * Convert Word document to PDF
 * Uses mammoth to extract HTML and jsPDF for rendering with formatting
 */
export const generatePDFFromWord = async (file: File): Promise<Blob> => {
    const mammoth = await getMammoth();
    const jsPDFModule = await getJsPDF();

    const buffer = await file.arrayBuffer();

    // Extract HTML with formatting preserved
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = result.value;

    const doc = new jsPDFModule();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    let y = margin;
    let listCounter = 0;
    let listDepth = 0;

    // Helper to check and add new page if needed
    const checkPage = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Parse HTML and render to PDF
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const container = htmlDoc.body.firstChild as HTMLElement;

    const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                const lines = doc.splitTextToSize(text, maxWidth - (listDepth * 15) - 5);
                for (const line of lines) {
                    checkPage(7);
                    doc.text(line, margin + (listDepth * 15), y);
                    y += 7;
                }
            }
            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        switch (tag) {
            case 'h1':
                checkPage(12);
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                const h1Text = el.textContent?.trim() || '';
                const h1Lines = doc.splitTextToSize(h1Text, maxWidth - 5);
                for (const line of h1Lines) {
                    checkPage(10);
                    doc.text(line, margin, y);
                    y += 10;
                }
                y += 4;
                break;

            case 'h2':
                checkPage(10);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                const h2Text = el.textContent?.trim() || '';
                const h2Lines = doc.splitTextToSize(h2Text, maxWidth - 5);
                for (const line of h2Lines) {
                    checkPage(8);
                    doc.text(line, margin, y);
                    y += 8;
                }
                y += 3;
                break;

            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                checkPage(9);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                const hText = el.textContent?.trim() || '';
                const hLines = doc.splitTextToSize(hText, maxWidth - 5);
                for (const line of hLines) {
                    checkPage(7);
                    doc.text(line, margin, y);
                    y += 7;
                }
                y += 2;
                break;

            case 'p':
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                // Process children to handle bold/italic
                for (const child of Array.from(el.childNodes)) {
                    processNode(child);
                }
                y += 4; // Paragraph spacing
                break;

            case 'ul':
                listDepth++;
                for (const child of Array.from(el.children)) {
                    processNode(child);
                }
                listDepth--;
                y += 2;
                break;

            case 'ol':
                listDepth++;
                listCounter = 0;
                for (const child of Array.from(el.children)) {
                    processNode(child);
                }
                listDepth--;
                y += 2;
                break;

            case 'li':
                checkPage(7);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                const indent = margin + (listDepth * 15);
                const bulletWidth = 10;
                const liMaxWidth = maxWidth - (listDepth * 15) - bulletWidth;

                // Determine bullet/number
                const parentTag = el.parentElement?.tagName.toLowerCase();
                if (parentTag === 'ol') {
                    listCounter++;
                    doc.text(`${listCounter}.`, indent - 5, y);
                } else {
                    doc.text('•', indent - 3, y);
                }

                const liText = el.textContent?.trim() || '';
                // Reduce width slightly (-5) to prevent right-edge clipping
                const liLines = doc.splitTextToSize(liText, liMaxWidth - 5);
                for (let i = 0; i < liLines.length; i++) {
                    if (i > 0) checkPage(7);
                    doc.text(liLines[i], indent + bulletWidth - 5, i === 0 ? y : y);
                    if (i < liLines.length - 1) y += 7;
                }
                y += 7;
                break;

            case 'strong':
            case 'b':
                doc.setFont('helvetica', 'bold');
                const boldText = el.textContent?.trim() || '';
                if (boldText) {
                    const boldLines = doc.splitTextToSize(boldText, maxWidth - (listDepth * 15) - 5);
                    for (const line of boldLines) {
                        checkPage(7);
                        doc.text(line, margin + (listDepth * 15), y);
                        y += 7;
                    }
                }
                doc.setFont('helvetica', 'normal');
                break;

            case 'em':
            case 'i':
                doc.setFont('helvetica', 'italic');
                const italicText = el.textContent?.trim() || '';
                if (italicText) {
                    const italicLines = doc.splitTextToSize(italicText, maxWidth - (listDepth * 15) - 5);
                    for (const line of italicLines) {
                        checkPage(7);
                        doc.text(line, margin + (listDepth * 15), y);
                        y += 7;
                    }
                }
                doc.setFont('helvetica', 'normal');
                break;

            case 'br':
                y += 7;
                break;

            case 'table':
                // Render table as text for now
                checkPage(7);
                for (const row of Array.from(el.querySelectorAll('tr'))) {
                    const cells = Array.from(row.querySelectorAll('td, th'));
                    const rowText = cells.map(c => c.textContent?.trim()).join(' | ');
                    if (rowText) {
                        const tableLines = doc.splitTextToSize(rowText, maxWidth - 5);
                        for (const line of tableLines) {
                            checkPage(7);
                            doc.text(line, margin, y);
                            y += 7;
                        }
                    }
                }
                y += 4;
                break;

            default:
                // Process children for unknown elements
                for (const child of Array.from(el.childNodes)) {
                    processNode(child);
                }
        }
    };

    // Process all children
    if (container) {
        for (const child of Array.from(container.childNodes)) {
            processNode(child);
        }
    }

    return doc.output('blob');
};

/**
 * Convert PowerPoint to PDF
 * Uses JSZip to parse PPTX and extract slide content
 */
export const generatePDFFromPPT = async (file: File): Promise<Blob> => {
    const JSZipClass = await getJSZip();
    const jsPDFModule = await getJsPDF();

    const buffer = await file.arrayBuffer();
    const zip = await JSZipClass.loadAsync(buffer);

    const doc = new jsPDFModule('landscape'); // PPT is usually landscape
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Find all slide XML files
    const slideFiles: string[] = [];
    zip.forEach((relativePath) => {
        if (relativePath.match(/ppt\/slides\/slide\d+\.xml$/)) {
            slideFiles.push(relativePath);
        }
    });

    // Sort slides numerically
    slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0');
        const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0');
        return numA - numB;
    });

    let isFirstSlide = true;
    let slideNumber = 1;

    for (const slidePath of slideFiles) {
        if (!isFirstSlide) {
            doc.addPage('landscape');
        }
        isFirstSlide = false;

        const slideFile = zip.file(slidePath);
        if (!slideFile) continue;

        const slideXml = await slideFile.async('text');

        // Parse XML to extract text content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(slideXml, 'text/xml');

        // Extract all text elements (a:t tags contain text in PPTX)
        const textElements = xmlDoc.getElementsByTagName('a:t');
        const texts: string[] = [];

        for (let i = 0; i < textElements.length; i++) {
            const text = textElements[i].textContent?.trim();
            if (text) texts.push(text);
        }

        // Draw slide background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Draw slide border
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

        // Add slide number
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Slide ${slideNumber}`, pageWidth - 25, pageHeight - 8);

        // Render text content
        doc.setTextColor(0, 0, 0);
        let y = 25;
        let isTitle = true;

        for (const text of texts) {
            if (isTitle) {
                // First text is usually the title
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                const titleLines = doc.splitTextToSize(text, pageWidth - 40);
                doc.text(titleLines, 20, y);
                y += titleLines.length * 12 + 15;
                isTitle = false;
            } else {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal');
                const contentLines = doc.splitTextToSize(text, pageWidth - 40);

                if (y + contentLines.length * 8 > pageHeight - 20) {
                    // Text overflow - just stop for this slide
                    break;
                }

                doc.text(contentLines, 20, y);
                y += contentLines.length * 8 + 5;
            }
        }

        slideNumber++;
    }

    return doc.output('blob');
};

/**
 * Generate merged PDF from multiple Excel files
 */
export const generateMergedPDFFromExcel = async (files: File[]): Promise<Blob> => {
    const { utils, read } = await getXlsx();
    const jsPDFModule = await getJsPDF();
    const autoTable = await getAutoTable();

    const doc = new jsPDFModule();
    let isFirstPage = true;

    for (const file of files) {
        const buffer = await file.arrayBuffer();
        const workbook = read(buffer);

        for (const sheetName of workbook.SheetNames) {
            if (!isFirstPage) {
                doc.addPage();
            }
            isFirstPage = false;

            const worksheet = workbook.Sheets[sheetName];
            let jsonData = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

            // Filter out completely empty rows
            jsonData = jsonData.filter(row =>
                Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
            );

            if (jsonData.length === 0) continue;

            // Add file and sheet name as title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${file.name} - ${sheetName}`, 14, 15);

            const headers = jsonData[0] || [];
            const body = jsonData.slice(1);

            autoTable(doc, {
                head: [headers.map(h => String(h || ''))],
                body: body.map(row =>
                    Array.isArray(row)
                        ? row.map(cell => String(cell ?? ''))
                        : [String(row ?? '')]
                ),
                startY: 22,
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [220, 53, 69], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 249, 250] },
                margin: { top: 22 },
            });
        }
    }

    return doc.output('blob');
};

/**
 * Generate merged PDF from multiple Word files
 */
export const generateMergedPDFFromWord = async (files: File[]): Promise<Blob> => {
    const mammoth = await getMammoth();
    const jsPDFModule = await getJsPDF();
    const doc = new jsPDFModule();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pageWidth - margin * 2;
    let isFirstPage = true;

    for (const file of files) {
        if (!isFirstPage) {
            doc.addPage();
        }
        isFirstPage = false;

        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        const text = result.value;

        // Add file name as header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(file.name, margin, margin);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const paragraphs = text.split(/\n\n+/);
        let y = margin + 12;

        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) continue;

            const lines = doc.splitTextToSize(paragraph.trim(), maxWidth);

            for (const line of lines) {
                if (y + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineHeight;
            }
            y += 4;
        }
    }

    return doc.output('blob');
};

/**
 * Generate merged PDF from multiple PPT files
 */
export const generateMergedPDFFromPPT = async (files: File[]): Promise<Blob> => {
    const JSZipClass = await getJSZip();
    const jsPDFModule = await getJsPDF();

    const doc = new jsPDFModule('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let isFirstSlide = true;
    let slideNumber = 1;

    for (const file of files) {
        const buffer = await file.arrayBuffer();
        const zip = await JSZipClass.loadAsync(buffer);

        const slideFiles: string[] = [];
        zip.forEach((relativePath) => {
            if (relativePath.match(/ppt\/slides\/slide\d+\.xml$/)) {
                slideFiles.push(relativePath);
            }
        });

        slideFiles.sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0');
            const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0');
            return numA - numB;
        });

        for (const slidePath of slideFiles) {
            if (!isFirstSlide) {
                doc.addPage('landscape');
            }
            isFirstSlide = false;

            const slideFile = zip.file(slidePath);
            if (!slideFile) continue;

            const slideXml = await slideFile.async('text');
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(slideXml, 'text/xml');
            const textElements = xmlDoc.getElementsByTagName('a:t');
            const texts: string[] = [];

            for (let i = 0; i < textElements.length; i++) {
                const text = textElements[i].textContent?.trim();
                if (text) texts.push(text);
            }

            // Draw slide
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

            // File indicator
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(file.name, 10, pageHeight - 8);
            doc.text(`Slide ${slideNumber}`, pageWidth - 25, pageHeight - 8);

            doc.setTextColor(0, 0, 0);
            let y = 25;
            let isTitle = true;

            for (const text of texts) {
                if (isTitle) {
                    doc.setFontSize(24);
                    doc.setFont('helvetica', 'bold');
                    const titleLines = doc.splitTextToSize(text, pageWidth - 40);
                    doc.text(titleLines, 20, y);
                    y += titleLines.length * 12 + 15;
                    isTitle = false;
                } else {
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'normal');
                    const contentLines = doc.splitTextToSize(text, pageWidth - 40);
                    if (y + contentLines.length * 8 > pageHeight - 20) break;
                    doc.text(contentLines, 20, y);
                    y += contentLines.length * 8 + 5;
                }
            }

            slideNumber++;
        }
    }

    return doc.output('blob');
};

/**
 * Convert PDF to Images (PNG)
 * Uses pdfjs-dist to render each page to canvas
 */
export const generateImagesFromPDF = async (file: File): Promise<Blob[]> => {
    const pdfjs = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const images: Blob[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
        }).promise;

        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
        });

        images.push(blob);
    }

    return images;
};


/**
 * Clean cloned container to bypass Tailwind 4's lab/oklch colors that crash html2canvas
 * Based on fix from document-chat.tsx
 */
function cleanContainerForHtml2Canvas(container: HTMLElement): void {
    container.removeAttribute('class');
    const allElements = container.querySelectorAll('*');
    allElements.forEach((el) => {
        el.removeAttribute('class');
        if (el instanceof HTMLElement) {
            el.style.boxShadow = 'none';
            el.style.backgroundImage = 'none';
            el.style.borderColor = 'transparent';

            if (el.tagName === 'STRONG' || el.tagName === 'B') {
                el.style.fontWeight = 'bold';
                el.style.color = '#1e40af';
            }
            if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
                el.style.fontWeight = 'bold';
                el.style.marginTop = '16px';
                el.style.marginBottom = '12px';
            }
            if (el.tagName === 'P') {
                el.style.marginBottom = '12px';
                el.style.lineHeight = '1.6';
            }
            if (el.tagName === 'TABLE') {
                el.style.borderCollapse = 'collapse';
                el.style.width = '100%';
            }
            if (el.tagName === 'TD' || el.tagName === 'TH') {
                el.style.border = '1px solid #d1d5db';
                el.style.padding = '8px';
            }
            if (el.tagName === 'TH') {
                el.style.backgroundColor = '#f3f4f6';
                el.style.fontWeight = 'bold';
            }
        }
    });
}

/**
 * Convert Word document to Images
 * Uses PDF as intermediate format for reliable rendering
 */
export const generateImagesFromWord = async (file: File): Promise<Blob[]> => {
    const pdfBlob = await generatePDFFromWord(file);
    const pdfFile = new File([pdfBlob], 'temp.pdf', { type: 'application/pdf' });
    return await generateImagesFromPDF(pdfFile);
};



/**
 * Convert Excel spreadsheet to Images
 * Converts to PDF first, then to images
 */
export const generateImagesFromExcel = async (file: File): Promise<Blob[]> => {
    const pdfBlob = await generatePDFFromExcel(file);
    const pdfFile = new File([pdfBlob], 'temp.pdf', { type: 'application/pdf' });
    return await generateImagesFromPDF(pdfFile);
};

/**
 * Convert PowerPoint to Images
 * Converts to PDF first, then to images
 */
export const generateImagesFromPPT = async (file: File): Promise<Blob[]> => {
    const pdfBlob = await generatePDFFromPPT(file);
    const pdfFile = new File([pdfBlob], 'temp.pdf', { type: 'application/pdf' });
    return await generateImagesFromPDF(pdfFile);
};

/**
 * Convert PDF to Excel
 * Extracts text from PDF and creates Excel rows preserving column structure
 */
export const generateExcelFromPDF = async (file: File): Promise<Blob> => {
    const pdfjs = await getPdfJs();
    const { utils, write } = await getXlsx();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const allRows: string[][] = [];

    const parseMarkdownPipeRow = (line: string): string[] | null => {
        const trimmed = line.trim();
        if (!trimmed.includes('|')) return null;
        if (!trimmed.startsWith('|') && !trimmed.endsWith('|')) return null;

        const parts = trimmed
            .split('|')
            .map((p) => p.trim())
            .filter((p, idx, arr) => {
                if (idx === 0 && p === '') return false;
                if (idx === arr.length - 1 && p === '') return false;
                return true;
            });

        if (parts.length === 0) return null;

        const isSeparator = parts.every((p) => /^[-:]+$/.test(p.replaceAll(' ', '')));
        if (isSeparator) return null;

        return parts.filter((p) => p.length > 0);
    };

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Group text items by Y coordinate (rows) with a tolerance for slight misalignments
        const rowTolerance = 5; // pixels
        const rowsMap = new Map<number, Array<{ x: number; str: string }>>();

        for (const item of textContent.items) {
            // Only process TextItem types that have transform and str properties
            if (!('transform' in item && 'str' in item)) continue;

            const y = Math.round(item.transform[5]); // Get Y coordinate
            const x = item.transform[4]; // Get X coordinate
            const str = item.str;

            // Find or create a row group
            let foundRowKey: number | null = null;
            for (const existingY of rowsMap.keys()) {
                if (Math.abs(existingY - y) <= rowTolerance) {
                    foundRowKey = existingY;
                    break;
                }
            }

            if (foundRowKey === null) {
                rowsMap.set(y, [{ x, str }]);
            } else {
                rowsMap.get(foundRowKey)!.push({ x, str });
            }
        }

        // Sort rows by Y coordinate (top to bottom)
        const sortedRowKeys = Array.from(rowsMap.keys()).sort((a, b) => b - a);

        for (const rowKey of sortedRowKeys) {
            const rowItems = rowsMap.get(rowKey)!;

            // Sort items within row by X coordinate (left to right)
            rowItems.sort((a, b) => a.x - b.x);

            // Determine column positions by clustering items that are close together
            const columnTolerance = 15; // pixels - items within this distance belong to same column
            const columns: Array<Array<{ x: number; str: string }>> = [];

            for (const item of rowItems) {
                let placed = false;
                for (const col of columns) {
                    const lastItem = col[col.length - 1];
                    if (Math.abs(lastItem.x - item.x) <= columnTolerance) {
                        // Merge with previous item (likely same column value split across items)
                        col[col.length - 1].str += ' ' + item.str;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    columns.push([{ x: item.x, str: item.str }]);
                }
            }

            // Build the row with values in column order
            let row = columns.map((col) => col[0].str.trim()).filter((val) => val.length > 0);

            if (row.length === 1) {
                const parsed = parseMarkdownPipeRow(row[0]);
                if (parsed && parsed.length > 0) {
                    row = parsed;
                }
            }

            if (row.length > 0) {
                allRows.push(row);
            }
        }
    }

    // Create Excel workbook
    const safeRows = allRows.length > 0 ? allRows : [['(No extracted text)']];
    const worksheet = utils.aoa_to_sheet(safeRows);

    const maxCols = safeRows.reduce((m, r) => Math.max(m, r.length), 0);
    if (maxCols > 0) {
        worksheet['!cols'] = Array.from({ length: maxCols }, (_, colIndex) => {
            const maxLen = safeRows.reduce((mx, r) => Math.max(mx, (r[colIndex] ?? '').length), 0);
            return { wch: Math.min(60, Math.max(10, maxLen + 2)) };
        });
    }

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Extracted Text');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Convert Word to Excel
 * Extracts text from Word and creates Excel rows
 */
export const generateExcelFromWord = async (file: File): Promise<Blob> => {
    const mammoth = await getMammoth();
    const { utils, write } = await getXlsx();

    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    const text = result.value;

    // Split into rows and filter empty lines
    const rows = parseTextToGrid(text);

    // Create Excel workbook
    const worksheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Extracted Text');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Convert PPT to Excel
 * Extracts text from PowerPoint slides and creates Excel rows
 */
export const generateExcelFromPPT = async (file: File): Promise<Blob> => {
    const JSZipClass = await getJSZip();
    const { utils, write } = await getXlsx();

    const buffer = await file.arrayBuffer();
    const zip = new JSZipClass();
    const zipContent = await zip.loadAsync(buffer);

    const slideFiles = Object.keys(zipContent.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
        .sort();

    const rows: string[][] = [];

    for (const slideFile of slideFiles) {
        const slideXml = await zipContent.files[slideFile].async('text');
        const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
        const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join('\n');

        if (slideText.trim()) {
            rows.push(...parseTextToGrid(slideText));
        }
    }

    // Create Excel workbook
    const worksheet = utils.aoa_to_sheet(rows.length > 0 ? rows : [['No text found']]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Extracted Text');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Generate merged Excel from multiple PDFs
 */
export const generateMergedExcelFromPDF = async (files: File[]): Promise<Blob> => {
    const pdfjs = await getPdfJs();
    const { utils, write } = await getXlsx();

    const rows: string[][] = [];

    for (const file of files) {
        rows.push([`--- ${file.name} ---`]);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            let fileText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fileText += pageText + '\n';
            }

            if (fileText.trim()) {
                const lines = fileText.split('\n').filter(l => l.trim()).map(l => [l]);
                rows.push(...lines);
            } else {
                rows.push(['(No extracted text)']);
            }
        } catch (e) {
            console.error(e);
            rows.push([`Error processing ${file.name}`]);
        }
        rows.push([]);
    }

    const worksheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Merged Data');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Generate merged Excel from multiple Word files
 */
export const generateMergedExcelFromWord = async (files: File[]): Promise<Blob> => {
    const mammoth = await getMammoth();
    const { utils, write } = await getXlsx();

    const rows: string[][] = [];

    for (const file of files) {
        rows.push([`--- ${file.name} ---`]);
        try {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            const text = result.value;

            if (text.trim()) {
                const lines = text.split('\n').filter(l => l.trim()).map(l => [l]);
                rows.push(...lines);
            } else {
                rows.push(['(No extracted text)']);
            }
        } catch (e) {
            console.error(e);
            rows.push([`Error processing ${file.name}`]);
        }
        rows.push([]);
    }

    const worksheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Merged Data');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Generate merged Excel from multiple PPT files
 */
export const generateMergedExcelFromPPT = async (files: File[]): Promise<Blob> => {
    const JSZipClass = await getJSZip();
    const { utils, write } = await getXlsx();

    const rows: string[][] = [];

    for (const file of files) {
        rows.push([`--- ${file.name} ---`]);
        try {
            const buffer = await file.arrayBuffer();
            const zip = new JSZipClass();
            const zipContent = await zip.loadAsync(buffer);

            const slideFiles = Object.keys(zipContent.files)
                .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
                .sort();

            let fileHasText = false;
            for (const slideFile of slideFiles) {
                const slideXml = await zipContent.files[slideFile].async('text');
                const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
                const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join(' ');

                if (slideText.trim()) {
                    rows.push([slideText]);
                    fileHasText = true;
                }
            }

            if (!fileHasText) {
                rows.push(['(No text found)']);
            }
        } catch (e) {
            console.error(e);
            rows.push([`Error processing ${file.name}`]);
        }
        rows.push([]);
    }

    const worksheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Merged Data');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

/**
 * Convert PDF to Word
 */
export const generateWordFromPDF = async (file: File): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const pdfjs = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const paragraphs: Paragraph[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');

        if (pageText.trim()) {
            paragraphs.push(new Paragraph({ children: [new TextRun(pageText)] }));
        }
    }

    if (paragraphs.length === 0) {
        paragraphs.push(new Paragraph({ children: [new TextRun('(No text extracted)')] }));
    }

    const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
    });

    return await Packer.toBlob(doc);
};

/**
 * Convert Text/CSV to Excel
 */
export const generateExcelFromText = async (file: File): Promise<Blob> => {
    const { utils, write } = await getXlsx();
    const text = await file.text();

    // Use shared parsing logic
    const rows = parseTextToGrid(text);

    // Filter empty rows if strictly empty? Maybe better to keep them for fidelity
    // rows = rows.filter(r => r.length > 0 && r.some(c => c.trim().length > 0));

    const worksheet = utils.aoa_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Imported Text');

    return new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};


/**
 * Convert Excel to Word
 */
export const generateWordFromExcel = async (file: File): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const { read, utils } = await getXlsx();

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);

    const paragraphs: Paragraph[] = [];

    for (const sheetName of workbook.SheetNames) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `Sheet: ${sheetName}`, bold: true })]
        }));

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        for (const row of jsonData) {
            if (Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined)) {
                const rowText = row.map(cell => String(cell ?? '')).join(' | ');
                paragraphs.push(new Paragraph({ children: [new TextRun(rowText)] }));
            }
        }
        paragraphs.push(new Paragraph({ children: [] })); // Empty line
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    return await Packer.toBlob(doc);
};

/**
 * Convert PPT to Word
 */
export const generateWordFromPPT = async (file: File): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const JSZipClass = await getJSZip();

    const buffer = await file.arrayBuffer();
    const zip = new JSZipClass();
    const zipContent = await zip.loadAsync(buffer);

    const slideFiles = Object.keys(zipContent.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
        .sort();

    const paragraphs: Paragraph[] = [];
    let slideNum = 1;

    for (const slideFile of slideFiles) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `Slide ${slideNum}`, bold: true })]
        }));

        const slideXml = await zipContent.files[slideFile].async('text');
        const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
        const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join(' ');

        if (slideText.trim()) {
            paragraphs.push(new Paragraph({ children: [new TextRun(slideText)] }));
        }
        paragraphs.push(new Paragraph({ children: [] }));
        slideNum++;
    }

    if (paragraphs.length === 0) {
        paragraphs.push(new Paragraph({ children: [new TextRun('(No text found)')] }));
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    return await Packer.toBlob(doc);
};

/**
 * Generate merged Word from multiple PDFs
 */
export const generateMergedWordFromPDF = async (files: File[]): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const pdfjs = await getPdfJs();
    const paragraphs: Paragraph[] = [];

    for (const file of files) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `--- ${file.name} ---`, bold: true })]
        }));

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                if (pageText.trim()) {
                    paragraphs.push(new Paragraph({ children: [new TextRun(pageText)] }));
                }
            }
        } catch (e) {
            paragraphs.push(new Paragraph({ children: [new TextRun(`Error: ${e}`)] }));
        }
        paragraphs.push(new Paragraph({ children: [] }));
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    return await Packer.toBlob(doc);
};

/**
 * Generate merged Word from multiple Excel files
 */
export const generateMergedWordFromExcel = async (files: File[]): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const { read, utils } = await getXlsx();

    const paragraphs: Paragraph[] = [];

    for (const file of files) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `--- ${file.name} ---`, bold: true })]
        }));

        try {
            const buffer = await file.arrayBuffer();
            const workbook = read(buffer);

            for (const sheetName of workbook.SheetNames) {
                paragraphs.push(new Paragraph({
                    children: [new TextRun({ text: `Sheet: ${sheetName}`, italics: true })]
                }));

                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[][] = utils.sheet_to_json(worksheet, { header: 1 });

                for (const row of jsonData) {
                    if (Array.isArray(row) && row.some(cell => cell != null)) {
                        const rowText = row.map(cell => String(cell ?? '')).join(' | ');
                        paragraphs.push(new Paragraph({ children: [new TextRun(rowText)] }));
                    }
                }
            }
        } catch (e) {
            paragraphs.push(new Paragraph({ children: [new TextRun(`Error: ${e}`)] }));
        }
        paragraphs.push(new Paragraph({ children: [] }));
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    return await Packer.toBlob(doc);
};

/**
 * Generate merged Word from multiple PPT files
 */
export const generateMergedWordFromPPT = async (files: File[]): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun } = await getDocx();
    const JSZipClass = await getJSZip();

    const paragraphs: Paragraph[] = [];

    for (const file of files) {
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `--- ${file.name} ---`, bold: true })]
        }));

        try {
            const buffer = await file.arrayBuffer();
            const zip = new JSZipClass();
            const zipContent = await zip.loadAsync(buffer);

            const slideFiles = Object.keys(zipContent.files)
                .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
                .sort();

            let slideNum = 1;
            for (const slideFile of slideFiles) {
                const slideXml = await zipContent.files[slideFile].async('text');
                const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
                const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join(' ');

                if (slideText.trim()) {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: `Slide ${slideNum}: `, bold: true }), new TextRun(slideText)]
                    }));
                }
                slideNum++;
            }
        } catch (e) {
            paragraphs.push(new Paragraph({ children: [new TextRun(`Error: ${e}`)] }));
        }
        paragraphs.push(new Paragraph({ children: [] }));
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    return await Packer.toBlob(doc);
};

/**
 * Convert PDF to PPT
 */
export const generatePPTFromPDF = async (file: File): Promise<Blob> => {
    const pdfjs = await getPdfJs();
    const PptxGenModule = await getPptxGen();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const pptx = new PptxGenModule();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');

        const slide = pptx.addSlide();
        slide.addText(`Page ${pageNum}`, { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: '363636' });
        if (pageText.trim()) {
            slide.addText(pageText.substring(0, 2000), { x: 0.5, y: 1, w: 9, fontSize: 14, color: '666666', valign: 'top' });
        }
    }

    return await pptx.write({ outputType: 'blob' }) as Blob;
};

/**
 * Convert Word to PPT
 */
export const generatePPTFromWord = async (file: File): Promise<Blob> => {
    const mammoth = await getMammoth();
    const PptxGenModule = await getPptxGen();

    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    const text = result.value;

    const pptx = new PptxGenModule();
    const paragraphs = text.split('\n').filter(p => p.trim());

    // Group paragraphs into slides (approx 5 per slide)
    const slideParagraphs: string[][] = [];
    for (let i = 0; i < paragraphs.length; i += 5) {
        slideParagraphs.push(paragraphs.slice(i, i + 5));
    }

    slideParagraphs.forEach((group, idx) => {
        const slide = pptx.addSlide();
        slide.addText(`Slide ${idx + 1}`, { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: '363636' });
        slide.addText(group.join('\n\n'), { x: 0.5, y: 1, w: 9, fontSize: 14, color: '666666', valign: 'top' });
    });

    if (slideParagraphs.length === 0) {
        const slide = pptx.addSlide();
        slide.addText('(No text extracted)', { x: 0.5, y: 1, fontSize: 14, color: '999999' });
    }

    return await pptx.write({ outputType: 'blob' }) as Blob;
};

/**
 * Convert Excel to PPT
 */
export const generatePPTFromExcel = async (file: File): Promise<Blob> => {
    console.log('generatePPTFromExcel: Starting conversion');
    const { read, utils } = await getXlsx();
    console.log('generatePPTFromExcel: Loaded xlsx');
    const PptxGenModule = await getPptxGen();
    console.log('generatePPTFromExcel: Loaded PptxGenModule');

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);
    console.log('generatePPTFromExcel: Workbook read, sheets:', workbook.SheetNames);

    const pptx = new PptxGenModule();

    for (const sheetName of workbook.SheetNames) {
        console.log(`generatePPTFromExcel: Processing sheet ${sheetName}`);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = utils.sheet_to_json(worksheet, { header: 1 });
        console.log(`generatePPTFromExcel: Sheet data length: ${jsonData.length}`);

        const slide = pptx.addSlide();
        console.log('generatePPTFromExcel: Added slide');

        try {
            slide.addText(`Sheet: ${sheetName}`, { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: '363636' });
            console.log('generatePPTFromExcel: Added title text');
        } catch (e) {
            console.error('generatePPTFromExcel: Error adding title text', e);
        }

        if (jsonData.length > 0) {
            // Prepare table data for PptxGenJS (rows must be strings/numbers)
            console.log('generatePPTFromExcel: Normalizing table data');
            const tableData = jsonData.map(row =>
                (Array.isArray(row) ? row : [row]).map(cell => (cell !== undefined && cell !== null) ? String(cell) : "")
            );

            // 1. Calculate Max Columns across ALL rows (not just the first)
            const maxCols = tableData.reduce((max, row) => Math.max(max, row.length), 0);
            const safeMaxCols = Math.max(1, maxCols);

            // 2. Normalize Data: Ensure every row has exactly `maxCols` cells
            // PptxGenJS can crash if row lengths vary or are less than colW length
            // Explicitly convert to objects to avoid internal pptxgenjs errors reading .text
            const normalizedData = tableData.map(row => {
                const newRow = [...row];
                while (newRow.length < safeMaxCols) {
                    newRow.push("");
                }
                return newRow.map(cell => ({ text: cell }));
            });
            console.log(`generatePPTFromExcel: Normalized data prepared. Rows: ${normalizedData.length}, Cols: ${safeMaxCols}`);

            // 3. Calculate column widths
            // Force exactly `safeMaxCols` widths to fit within 9.0 inches
            const totalWidth = 9.0;
            const colWidth = totalWidth / safeMaxCols;
            const colWidths = Array(safeMaxCols).fill(colWidth);

            // Calculate font size based on column count to prevent text overlap
            const dynamicFontSize = safeMaxCols > 10 ? 7 : (safeMaxCols > 6 ? 9 : 10);

            // Add Table with styling
            try {
                console.log('generatePPTFromExcel: Adding table to slide...');
                slide.addTable(normalizedData as any[], {
                    x: 0.5,
                    y: 0.8,
                    w: totalWidth,
                    colW: colWidths,
                    fontSize: dynamicFontSize,
                    border: { pt: 1, color: "e5e7eb" },
                    autoPage: true, // Auto-paginate if table is too long
                    rowH: 0.3,
                    valign: 'middle',
                    align: 'left',
                    // Header styling (first row)
                    fill: { color: "ffffff" },
                    color: "363636",
                });
                console.log('generatePPTFromExcel: Table added successfully');
            } catch (e: any) {
                console.error('generatePPTFromExcel: Error adding table', e);
                // Log more details to help debugging
                if (e.message?.includes('text')) {
                    console.error('generatePPTFromExcel: Text property error detected. inspect normalizedData:', JSON.stringify(normalizedData.slice(0, 2)));
                }
                throw e; // Rethrow to show in UI
            }
        }
    }

    console.log('generatePPTFromExcel: Finished processing sheets, writing file');
    try {
        const blob = await pptx.write({ outputType: 'blob' }) as Blob;
        console.log('generatePPTFromExcel: Blob created');
        return blob;
    } catch (e) {
        console.error('generatePPTFromExcel: Error writing pptx', e);
        throw e;
    }
};

/**
 * Generate merged PPT from multiple PDFs
 */
export const generateMergedPPTFromPDF = async (files: File[]): Promise<Blob> => {
    const pdfjs = await getPdfJs();
    const PptxGenModule = await getPptxGen();
    const pptx = new PptxGenModule();

    for (const file of files) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            // Title slide for each file
            const titleSlide = pptx.addSlide();
            titleSlide.addText(file.name, { x: 0.5, y: 2, fontSize: 28, bold: true, color: '363636' });

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');

                const slide = pptx.addSlide();
                slide.addText(`Page ${pageNum}`, { x: 0.5, y: 0.3, fontSize: 18, bold: true, color: '363636' });
                if (pageText.trim()) {
                    slide.addText(pageText.substring(0, 2000), { x: 0.5, y: 0.8, w: 9, fontSize: 12, color: '666666', valign: 'top' });
                }
            }
        } catch (e) {
            const errorSlide = pptx.addSlide();
            errorSlide.addText(`Error: ${file.name}`, { x: 0.5, y: 2, fontSize: 14, color: 'FF0000' });
        }
    }

    return await pptx.write({ outputType: 'blob' }) as Blob;
};

/**
 * Generate merged PPT from multiple Word files
 */
export const generateMergedPPTFromWord = async (files: File[]): Promise<Blob> => {
    const mammoth = await getMammoth();
    const PptxGenModule = await getPptxGen();
    const pptx = new PptxGenModule();

    for (const file of files) {
        try {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            const text = result.value;

            // Title slide
            const titleSlide = pptx.addSlide();
            titleSlide.addText(file.name, { x: 0.5, y: 2, fontSize: 28, bold: true, color: '363636' });

            const paragraphs = text.split('\n').filter(p => p.trim());
            const slideParagraphs: string[][] = [];
            for (let i = 0; i < paragraphs.length; i += 5) {
                slideParagraphs.push(paragraphs.slice(i, i + 5));
            }

            slideParagraphs.forEach((group, idx) => {
                const slide = pptx.addSlide();
                slide.addText(`Slide ${idx + 1}`, { x: 0.5, y: 0.3, fontSize: 18, bold: true, color: '363636' });
                slide.addText(group.join('\n\n'), { x: 0.5, y: 0.8, w: 9, fontSize: 12, color: '666666', valign: 'top' });
            });
        } catch (e) {
            const errorSlide = pptx.addSlide();
            errorSlide.addText(`Error: ${file.name}`, { x: 0.5, y: 2, fontSize: 14, color: 'FF0000' });
        }
    }

    return await pptx.write({ outputType: 'blob' }) as Blob;
};

/**
 * Generate merged PPT from multiple Excel files
 */
export const generateMergedPPTFromExcel = async (files: File[]): Promise<Blob> => {
    const { read, utils } = await getXlsx();
    const PptxGenModule = await getPptxGen();
    const pptx = new PptxGenModule();

    for (const file of files) {
        try {
            const buffer = await file.arrayBuffer();
            const workbook = read(buffer);

            // Title slide
            const titleSlide = pptx.addSlide();
            titleSlide.addText(file.name, { x: 0.5, y: 2, fontSize: 28, bold: true, color: '363636' });

            for (const sheetName of workbook.SheetNames) {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[][] = utils.sheet_to_json(worksheet, { header: 1 });

                const slide = pptx.addSlide();
                slide.addText(`Sheet: ${sheetName}`, { x: 0.5, y: 0.3, fontSize: 18, bold: true, color: '363636' });

                const rows = jsonData.slice(0, 15).map(row =>
                    Array.isArray(row) ? row.map(cell => String(cell ?? '')).join(' | ') : ''
                ).filter(r => r.trim());

                if (rows.length > 0) {
                    slide.addText(rows.join('\n'), { x: 0.5, y: 0.8, w: 9, fontSize: 10, color: '666666', valign: 'top' });
                }
            }
        } catch (e) {
            const errorSlide = pptx.addSlide();
            errorSlide.addText(`Error: ${file.name}`, { x: 0.5, y: 2, fontSize: 14, color: 'FF0000' });
        }
    }

    return await pptx.write({ outputType: 'blob' }) as Blob;
};

/**
 * Extract text from Word document
 */
export const extractTextFromWord = async (file: File): Promise<string> => {
    const mammoth = await getMammoth();
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value || '';
};

/**
 * Extract text from Excel spreadsheet
 */
export const extractTextFromExcel = async (file: File): Promise<string> => {
    const { read, utils } = await getXlsx();
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);

    let text = '';
    for (const sheetName of workbook.SheetNames) {
        text += `--- Sheet: ${sheetName} ---\n\n`;
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        for (const row of jsonData) {
            if (Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined)) {
                text += row.map(cell => String(cell ?? '')).join('\t') + '\n';
            }
        }
        text += '\n';
    }
    return text || '(No text found)';
};

/**
 * Extract text from PowerPoint presentation
 */
export const extractTextFromPPT = async (file: File): Promise<string> => {
    const JSZipClass = await getJSZip();
    const buffer = await file.arrayBuffer();
    const zip = new JSZipClass();
    const zipContent = await zip.loadAsync(buffer);

    const slideFiles = Object.keys(zipContent.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
        .sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, '') || '0');
            const numB = parseInt(b.replace(/\D/g, '') || '0');
            return numA - numB;
        });

    let text = '';
    let slideIndex = 1;

    for (const slideFile of slideFiles) {
        text += `--- Slide ${slideIndex} ---\n\n`;
        const slideXml = await zipContent.files[slideFile].async('text');
        const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
        const slideText = textMatches.map(match => match.replace(/<\/?a:t>/g, '')).join(' ');

        if (slideText.trim()) {
            text += slideText + '\n\n';
        } else {
            text += '(No text found)\n\n';
        }
        slideIndex++;
    }
    return text || '(No text found)';
};
