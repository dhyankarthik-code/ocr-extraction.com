
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { utils, write } from 'xlsx'
import PptxGenJS from 'pptxgenjs'
import jsPDF from 'jspdf'

export const generateWord = async (text: string): Promise<Blob> => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: text.split('\n').map(line => new Paragraph({
                children: [new TextRun(line)],
            })),
        }],
    });

    return await Packer.toBlob(doc);
}

export const generateExcel = (text: string): Blob => {
    const wb = utils.book_new();
    // Split by newlines for rows, maybe simple single column for now
    const rows = text.split('\n').map(line => [line]);
    const ws = utils.aoa_to_sheet(rows);
    utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
}

export const generatePPT = async (text: string): Promise<Blob> => {
    const pres = new PptxGenJS();

    // Split text into chunks to avoid overflow
    const lines = text.split('\n');
    const linesPerSlide = 15;

    for (let i = 0; i < lines.length; i += linesPerSlide) {
        const slide = pres.addSlide();
        const slideText = lines.slice(i, i + linesPerSlide).join('\n');
        slide.addText(slideText, { x: 0.5, y: 0.5, w: '90%', h: '90%', fontSize: 14, color: '363636' });
    }

    return await pres.write("blob") as Blob;
}

export const generatePDF = (text: string): Blob => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);

    let y = 10;
    const pageHeight = doc.internal.pageSize.height;

    splitText.forEach((line: string) => {
        if (y > pageHeight - 10) {
            doc.addPage();
            y = 10;
        }
        doc.text(line, 10, y);
        y += 7;
    });

    return doc.output('blob');
}

export const generatePDFFromImage = async (imageFile: File): Promise<Blob> => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Create URL from File (simpler/safer than manual base64 for browser Image)
    const url = URL.createObjectURL(imageFile);

    // Load image to get dimensions safely
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });

    // Calculate dimensions based on aspect ratio
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;

    // Detect format
    let format = 'JPEG';
    if (imageFile.type.includes('png')) format = 'PNG';
    else if (imageFile.type.includes('webp')) format = 'WEBP';

    // Pass the Image Element directly - jsPDF handles it better than data strings often
    doc.addImage(img, format, 0, 0, pdfWidth, pdfHeight);

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
    const doc = new jsPDF();

    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (i > 0) doc.addPage();

        // Create URL from File
        const url = URL.createObjectURL(imageFile);

        // Load image to get dimensions safely
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

        // Calculate dimensions based on aspect ratio
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;

        // Detect format
        let format = 'JPEG';
        if (imageFile.type.includes('png')) format = 'PNG';
        else if (imageFile.type.includes('webp')) format = 'WEBP';

        doc.addImage(img, format, 0, 0, pdfWidth, pdfHeight);
        URL.revokeObjectURL(url);
    }

    return doc.output('blob');
}

export const generateMergedPDF = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const doc = new jsPDF();
    let isFirstPage = true;

    for (const fs of fileStates) {
        const { file, result } = fs;

        // Handle image inputs
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

            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (img.height * pdfWidth) / img.width;

            let format = 'JPEG';
            if (file.type.includes('png')) format = 'PNG';
            else if (file.type.includes('webp')) format = 'WEBP';

            // Convert to canvas data URL for reliable PDF insertion
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL(`image/${format.toLowerCase()}`);
                doc.addImage(dataUrl, format, 0, 0, pdfWidth, pdfHeight);
            }

            URL.revokeObjectURL(url);
            isFirstPage = false;
        }
        // Handle text inputs
        else if (result?.text) {
            if (!isFirstPage) doc.addPage();

            const splitText = doc.splitTextToSize(result.text, 180);
            let y = 10;
            const pageHeight = doc.internal.pageSize.height;

            splitText.forEach((line: string) => {
                if (y > pageHeight - 10) {
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, 10, y);
                y += 7;
            });
            isFirstPage = false;
        }
    }

    return doc.output('blob');
}
