"use client"

import { useState } from "react"
import ToolShell from "@/components/tools/ToolShell"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

// Extend jsPDF type to include autoTable
interface AutoTableJsPDF extends jsPDF {
    lastAutoTable?: { finalY: number };
}

export default function ExcelToPdfClient() {
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
    const [previewData, setPreviewData] = useState<string[][]>([])
    const [originalName, setOriginalName] = useState<string>("")

    const handleProcess = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        setOriginalName(file.name.replace(/\.[^/.]+$/, ""))

        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)

        // Use first sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

        // Filter out empty rows
        const jsonData = rawData.filter(row => row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== ""))

        if (jsonData.length === 0) {
            // Handle empty sheet case
            return
        }

        // Set Preview (limit to 20 rows)
        setPreviewData(jsonData.slice(0, 20))

        // Generate PDF
        const doc = new jsPDF() as AutoTableJsPDF

        doc.text(`File: ${file.name}`, 14, 15)
        doc.text(`Sheet: ${sheetName}`, 14, 22)

        autoTable(doc, {
            startY: 30,
            head: [jsonData[0]],
            body: jsonData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38] }, // Red header
            // Prevent empty pages by ensuring we don't page break aggressively?
            // autoTable defaults should handle this if data is clean.
        })

        const blob = doc.output("blob")
        setPdfBlob(blob)
    }

    const downloadPdf = () => {
        if (!pdfBlob) return
        saveAs(pdfBlob, `${originalName}-converted.pdf`)
    }

    return (
        <ToolShell
            title="Excel to PDF Converter"
            description="Convert Excel spreadsheets (XLSX, XLS) into professional PDF tables."
            acceptedFileTypes={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                "application/vnd.ms-excel": [".xls"],
                "text/csv": [".csv"]
            }}
            onProcess={handleProcess}
            renderResult={() => (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 w-full">
                    <h3 className="text-2xl font-bold">Conversion Successful!</h3>
                    <p className="text-muted-foreground">Your PDF is ready.</p>

                    {previewData.length > 0 && (
                        <div className="w-full text-left space-y-2 max-w-4xl mx-auto overflow-hidden">
                            <h4 className="text-sm font-semibold text-gray-500">Preview (First 20 Rows)</h4>
                            <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-96 shadow-sm">
                                <table className="w-full text-sm text-left relative border-collapse">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {previewData[0].map((cell, idx) => (
                                                <th key={idx} className="px-4 py-3 border-b border-r border-gray-200 min-w-[100px] whitespace-nowrap bg-gray-50">
                                                    {cell || `Col ${idx + 1}`}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.slice(1).map((row, rIdx) => (
                                            <tr key={rIdx} className="bg-white border-b hover:bg-gray-50 last:border-0">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="px-4 py-2 border-r border-gray-100 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button size="lg" onClick={downloadPdf} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}
