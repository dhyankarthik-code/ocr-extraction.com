"use client"

import { useState, useEffect } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

export default function PdfToExcelClient() {
    const [wb, setWb] = useState<XLSX.WorkBook | null>(null)
    const [previewData, setPreviewData] = useState<string[][]>([])

    useEffect(() => {
        const initPdfJs = async () => {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
        }
        initPdfJs()
    }, [])

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]

        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = await import('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const workbook = XLSX.utils.book_new()
        let firstPageData: string[][] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 });

            // --- 1. Basic Extraction ---
            interface TextItem {
                str: string;
                x: number;
                y: number; // Top Y (visual)
                w: number;
                h: number;
                right: number;
                bottom: number;
                center: number;
            }

            const items: TextItem[] = textContent.items
                .map((item: any) => {
                    const h = item.height > 0 ? item.height : 10;
                    const top = viewport.height - item.transform[5] - h;
                    return {
                        str: item.str,
                        x: item.transform[4],
                        y: top,
                        w: item.width,
                        h: h,
                        right: item.transform[4] + item.width,
                        bottom: top + h,
                        center: item.transform[4] + (item.width / 2),
                    };
                })
                .filter((it: TextItem) => it.str.trim().length > 0);

            if (items.length === 0) continue;

            // --- 2. Row Grouping ---
            items.sort((a, b) => a.y - b.y);

            const rows: TextItem[][] = [];
            if (items.length > 0) {
                let currentRow = [items[0]];
                let rowY = items[0].y;
                let rowBottom = items[0].bottom;

                for (let k = 1; k < items.length; k++) {
                    const item = items[k];
                    const overlap = Math.min(rowBottom, item.bottom) - Math.max(rowY, item.y);
                    const minH = Math.min(rowBottom - rowY, item.h);

                    if (overlap > (minH * 0.5)) {
                        currentRow.push(item);
                        rowY = Math.min(rowY, item.y);
                        rowBottom = Math.max(rowBottom, item.bottom);
                    } else {
                        rows.push(currentRow);
                        currentRow = [item];
                        rowY = item.y;
                        rowBottom = item.bottom;
                    }
                }
                rows.push(currentRow);
            }

            // --- 3. Column Detection (High-Res Weighted Voting) ---
            // Scale everything by 10 to detect sub-pixel gaps (e.g. 0.5px between "4" and "5")
            const SCALE = 10;
            const maxX = Math.ceil(Math.max(...items.map(i => i.right))) * SCALE + 200;
            const gapVotes = new Float32Array(maxX + 1);

            rows.forEach(row => {
                if (row.length < 2) return;

                // Heavy weight for multi-item rows
                const weight = Math.pow(row.length, 2);

                row.sort((a, b) => a.x - b.x);

                for (let k = 0; k < row.length - 1; k++) {
                    const curr = row[k];
                    const next = row[k + 1];

                    // Gap in scaled coordinates
                    const startGap = Math.floor(curr.right * SCALE);
                    const endGap = Math.ceil(next.x * SCALE);

                    if (endGap > startGap) {
                        for (let x = startGap; x < endGap; x++) {
                            gapVotes[x] += weight;
                        }
                    }
                }
            });

            let maxVote = 0;
            for (let v of gapVotes) maxVote = Math.max(maxVote, v);

            // Lower threshold to 5% to be very sensitive to header splits
            const voteThreshold = maxVote * 0.05;

            const separators: number[] = [];
            let inSep = false;
            let sepStart = 0;

            for (let x = 0; x <= maxX; x++) {
                if (gapVotes[x] > voteThreshold) {
                    if (!inSep) {
                        inSep = true;
                        sepStart = x;
                    }
                } else {
                    if (inSep) {
                        inSep = false;
                        const sepEnd = x;
                        // Min gap width: 2 scaled units = 0.2px (basically any positive gap)
                        if ((sepEnd - sepStart) >= 2) {
                            separators.push((sepStart + sepEnd) / 2 / SCALE);
                        }
                    }
                }
            }

            separators.unshift(0);
            separators.push(Infinity);

            // --- 4. Map to Columns ---
            const sheetData: string[][] = [];

            rows.forEach(row => {
                const rowData: string[] = new Array(separators.length - 1).fill("");
                row.forEach(item => {
                    let bestCol = -1;
                    let maxOverlap = 0;

                    for (let c = 0; c < separators.length - 1; c++) {
                        const colStart = separators[c];
                        // Infinity handling
                        const colEnd = separators[c + 1] === Infinity ? 100000 : separators[c + 1];

                        const overlapStart = Math.max(item.x, colStart);
                        const overlapEnd = Math.min(item.right, colEnd);
                        const overlapLen = Math.max(0, overlapEnd - overlapStart);

                        if (overlapLen > maxOverlap) {
                            maxOverlap = overlapLen;
                            bestCol = c;
                        }
                    }

                    // Fallback to center if tiny overlap
                    if (bestCol === -1) {
                        const cx = item.center;
                        for (let c = 0; c < separators.length - 1; c++) {
                            const colEnd = separators[c + 1] === Infinity ? 100000 : separators[c + 1];
                            if (cx >= separators[c] && cx < colEnd) {
                                bestCol = c;
                                break;
                            }
                        }
                    }

                    if (bestCol !== -1) {
                        rowData[bestCol] = rowData[bestCol] ? rowData[bestCol] + " " + item.str : item.str;
                    }
                });
                sheetData.push(rowData);
            });

            // Clean empty columns
            if (sheetData.length > 0) {
                const numCols = sheetData[0].length;
                const keepCol = new Array(numCols).fill(false);
                for (let r = 0; r < sheetData.length; r++) {
                    for (let c = 0; c < numCols; c++) {
                        if (sheetData[r][c].trim()) keepCol[c] = true;
                    }
                }

                const finalData = [];
                for (let r = 0; r < sheetData.length; r++) {
                    const newRow = [];
                    for (let c = 0; c < numCols; c++) {
                        if (keepCol[c]) newRow.push(sheetData[r][c]);
                    }
                    finalData.push(newRow);
                }

                if (i === 1) {
                    setPreviewData(finalData);
                }

                const worksheet = XLSX.utils.aoa_to_sheet(finalData);
                XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
            }
        }

        setWb(workbook)
    }

    const downloadExcel = () => {
        if (!wb) return
        XLSX.writeFile(wb, "converted-data.xlsx")
    }

    return (
        <ToolShell
            title="PDF to Excel Converter"
            description="Convert PDF tables into editable Excel spreadsheets. Uses high-resolution projection testing for maximum accuracy."
            acceptedFileTypes={{
                "application/pdf": [".pdf"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full max-w-4xl mx-auto">
                    {previewData.length > 0 && (
                        <div className="w-full text-left space-y-2">
                            <h4 className="text-sm font-semibold text-gray-500">Preview (First Page)</h4>
                            <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-96 shadow-sm">
                                <table className="w-full text-sm text-left relative border-collapse">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {previewData[0].map((_, idx) => (
                                                <th key={idx} className="px-4 py-3 border-b border-r border-gray-200 min-w-[100px] last:border-r-0 whitespace-nowrap bg-gray-50">
                                                    Col {idx + 1}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, rIdx) => (
                                            <tr key={rIdx} className="bg-white border-b hover:bg-gray-50 last:border-0">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="px-4 py-2 border-r border-gray-100 last:border-r-0 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap" title={cell}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {previewData.length > 20 && <p className="text-xs text-gray-400 text-center">...plus {previewData.length - 20} more rows...</p>}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                        <p className="text-muted-foreground">Your Excel workbook is ready for download.</p>
                    </div>

                    <div className="flex gap-4">
                        <Button size="lg" onClick={downloadExcel} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <Download className="w-4 h-4" /> Download Excel
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}
