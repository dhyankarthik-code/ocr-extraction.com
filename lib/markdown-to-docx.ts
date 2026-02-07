import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    BorderStyle,
    HeadingLevel,
    AlignmentType,
    WidthType,
} from 'docx';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

// LaTeX to Unicode map for common symbols found in OCR
const LATEX_MAP: Record<string, string> = {
    '$\\rightarrow$': '→',
    '$\\leftarrow$': '←',
    '$\\leftrightarrow$': '↔',
    '$\\Rightarrow$': '⇒',
    '$\\Leftarrow$': '⇐',
    '$\\Leftrightarrow$': '⇔',
    '$\\ge$': '≥',
    '$\\le$': '≤',
    '$\\times$': '×',
    '$\\cdot$': '•',
    '$\\approx$': '≈',
    '$\\ne$': '≠',
    '$\\pm$': '±',
    '$\\infty$': '∞',
    '$\\alpha$': 'α',
    '$\\beta$': 'β',
    '$\\gamma$': 'γ',
    '$\\delta$': 'δ',
    '$\\theta$': 'θ',
    '$\\lambda$': 'λ',
    '$\\pi$': 'π',
    '$\\sigma$': 'σ',
    '$\\omega$': 'ω',
    '$\\Delta$': 'Δ',
    '\\%': '%',
};

// Helper to clean text and replace LaTeX symbols
const cleanText = (text: string): string => {
    let cleaned = text;
    for (const [latex, unicode] of Object.entries(LATEX_MAP)) {
        cleaned = cleaned.replaceAll(latex, unicode);
    }
    // Remove other common OCR markdown artifacts
    cleaned = cleaned.replace(/\\$/g, ''); // Remove trailing backslashes
    return cleaned;
};

export const markdownToDocx = async (markdown: string): Promise<Buffer> => {
    // 1. Parse Markdown AST
    const processor = remark().use(remarkGfm);
    const ast = processor.parse(markdown);

    const docChildren: any[] = [];

    // 2. Traverse AST and convert to docx objects
    const processNode = (node: any) => {
        switch (node.type) {
            case 'root':
                node.children.forEach(processNode);
                break;

            case 'heading':
                const headingText = node.children.map((c: any) => c.value).join('');
                docChildren.push(
                    new Paragraph({
                        text: cleanText(headingText),
                        heading: HeadingLevel[`HEADING_${node.depth}` as keyof typeof HeadingLevel],
                        spacing: { before: 240, after: 120 },
                    })
                );
                break;

            case 'paragraph':
                const paragraphRuns = node.children.map((c: any) => {
                    if (c.type === 'text') {
                        return new TextRun({ text: cleanText(c.value) });
                    } else if (c.type === 'strong') {
                        return new TextRun({ text: cleanText(c.children[0].value), bold: true });
                    } else if (c.type === 'emphasis') {
                        return new TextRun({ text: cleanText(c.children[0].value), italics: true });
                    } else if (c.type === 'inlineCode') {
                        return new TextRun({
                            text: cleanText(c.value),
                            font: 'Courier New',
                            color: '383a42',
                            highlight: 'e5e5e5' // Light gray background
                        });
                    }
                    else if (c.type === 'link') {
                        return new TextRun({
                            text: cleanText(c.children[0]?.value || c.url),
                            color: '0563C1',
                            underline: {},
                        });
                    }
                    return new TextRun({ text: '' });
                });
                docChildren.push(
                    new Paragraph({
                        children: paragraphRuns,
                        spacing: { before: 120, after: 120 },
                    })
                );
                break;

            case 'list':
                node.children.forEach((listItem: any, index: number) => {
                    // Simple list handling - extracting text from first paragraph of item
                    const itemText = listItem.children[0]?.children?.map((c: any) => c.value).join('') || '';
                    docChildren.push(
                        new Paragraph({
                            text: node.ordered ? `${index + 1}. ${cleanText(itemText)}` : `• ${cleanText(itemText)}`,
                            indent: { left: 720, hanging: 360 },
                            spacing: { before: 80, after: 80 },
                        })
                    );
                });
                break;

            case 'table':
                const rows = node.children.map((row: any) => {
                    const cells = row.children.map((cell: any) => {
                        const cellText = cell.children.map((c: any) => c.value).join('');
                        return new TableCell({
                            children: [new Paragraph({ text: cleanText(cellText) })],
                            width: { size: 100, type: WidthType.PERCENTAGE }, // Auto-distribute
                            padding: { top: 100, bottom: 100, left: 100, right: 100 },
                            borders: {
                                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            },
                        });
                    });
                    return new TableRow({ children: cells });
                });

                docChildren.push(
                    new Table({
                        rows: rows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
                        }
                    })
                );
                // Add spacer after table
                docChildren.push(new Paragraph({ text: "" }));
                break;

            case 'code': // Code block
                docChildren.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: node.value,
                                font: 'Courier New',
                                size: 20, // 10pt
                            })
                        ],
                        border: {
                            top: { color: "EFEFEF", space: 1, value: "single", size: 6 },
                            bottom: { color: "EFEFEF", space: 1, value: "single", size: 6 },
                            left: { color: "EFEFEF", space: 1, value: "single", size: 6 },
                            right: { color: "EFEFEF", space: 1, value: "single", size: 6 },
                        },
                        shading: {
                            fill: "F5F5F5"
                        },
                        spacing: { before: 240, after: 240 },
                    })
                );
                break;

            default:
                // console.log('Unhandled node type:', node.type);
                break;
        }
    };

    // Iterate through root children
    ast.children.forEach(processNode);

    // 3. Create Document
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri",
                        size: 22, // 11pt
                        color: "000000",
                    },
                    paragraph: {
                        spacing: { line: 276 }, // 1.15 lines
                    },
                },
            },
        },
        sections: [
            {
                properties: {},
                children: docChildren.length > 0 ? docChildren : [new Paragraph("Title could not be extracted.")],
            },
        ],
    });

    // 4. Generate Buffer
    return await Packer.toBuffer(doc);
};
