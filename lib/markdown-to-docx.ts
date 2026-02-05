import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export async function markdownToDocx(markdown: string): Promise<Buffer> {
    const lines = markdown.split('\n');
    const children: (Paragraph)[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            children.push(new Paragraph({})); // Empty line
            continue;
        }

        if (trimmed.startsWith('# ')) {
            children.push(new Paragraph({
                text: trimmed.substring(2),
                heading: HeadingLevel.HEADING_1,
            }));
        } else if (trimmed.startsWith('## ')) {
            children.push(new Paragraph({
                text: trimmed.substring(3),
                heading: HeadingLevel.HEADING_2,
            }));
        } else if (trimmed.startsWith('### ')) {
            children.push(new Paragraph({
                text: trimmed.substring(4),
                heading: HeadingLevel.HEADING_3,
            }));
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            children.push(new Paragraph({
                text: trimmed.substring(2),
                bullet: { level: 0 }
            }));
        } else {
            // Basic Bold/Italic parsing could go here, but for now simple text
            // extending to handle bold **text**
            const parts = trimmed.split(/(\*\*.*?\*\*)/g);
            const textRuns = parts.map(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return new TextRun({
                        text: part.substring(2, part.length - 2),
                        bold: true,
                    });
                }
                return new TextRun(part);
            });

            children.push(new Paragraph({
                children: textRuns
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    return await Packer.toBuffer(doc);
}
