
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { utils, write } from 'xlsx'
import PptxGenJS from 'pptxgenjs'
import jsPDF from 'jspdf'

export const generateWord = async (text: string): Promise<Blob> => {
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

export const generateExcel = (text: string): Blob => {
    const wb = utils.book_new();
    const rows = text.split('\n').map((line: string) => [line]);
    const ws = utils.aoa_to_sheet(rows);
    utils.book_append_sheet(wb, ws, "Sheet1");
    // Auto-width column
    ws['!cols'] = [{ wch: 100 }];
    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
}

export const generateMergedExcel = (fileStates: Array<{ file: File, result: any }>): Blob => {
    const wb = utils.book_new();

    fileStates.forEach((fs, index) => {
        const text = fs.result?.text || "";
        const rows = text.split('\n').map((line: string) => [line]);
        const ws = utils.aoa_to_sheet(rows);
        ws['!cols'] = [{ wch: 100 }];
        utils.book_append_sheet(wb, ws, `File ${index + 1}`);
    });

    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/octet-stream' });
}

export const generatePPT = async (text: string): Promise<Blob> => {
    const pres = new PptxGenJS();
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
    const pres = new PptxGenJS();

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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });

    // Calculate dimensions based on aspect ratio, ensuring it fits on the page
    let pdfWidth = pageWidth;
    let pdfHeight = (img.height * pdfWidth) / img.width;

    if (pdfHeight > pageHeight) {
        pdfHeight = pageHeight;
        pdfWidth = (img.width * pdfHeight) / img.height;
    }

    // Center the image
    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    let format = 'JPEG';
    if (imageFile.type.includes('png')) format = 'PNG';
    else if (imageFile.type.includes('webp')) format = 'WEBP';

    doc.addImage(img, format, x, y, pdfWidth, pdfHeight);

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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (i > 0) doc.addPage();

        const url = URL.createObjectURL(imageFile);
        const img = new Image();
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

        doc.addImage(img, format, x, y, pdfWidth, pdfHeight);
        URL.revokeObjectURL(url);
    }

    return doc.output('blob');
}

export const generateMergedPDF = async (fileStates: Array<{ file: File, result: any }>): Promise<Blob> => {
    const doc = new jsPDF();
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
