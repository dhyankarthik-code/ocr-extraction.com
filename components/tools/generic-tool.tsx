"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  ArrowRight,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileStack,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import UploadZone from "@/components/upload-zone";
import { toast } from "sonner";
import {
  generateWord,
  generateExcel,
  generatePPT,
  generatePDF,
  generatePDFFromImage,
  generateMergedPDF,
  downloadBlob,
  generateMergedWord,
  generateMergedExcel,
  generateMergedPPT,
  generateImageFromText,
  generatePDFFromExcel,
  generatePDFFromWord,
  generatePDFFromPPT,
  generateMergedPDFFromExcel,
  generateMergedPDFFromWord,
  generateMergedPDFFromPPT,
  generateImagesFromPDF,
  generateImagesFromWord,
  generateImagesFromExcel,
  generateImagesFromPPT,
  generateExcelFromPDF,
  generateExcelFromWord,
  generateExcelFromPPT,
  generateMergedExcelFromPDF,
  generateMergedExcelFromWord,
  generateMergedExcelFromPPT,
  generateWordFromPDF,
  generateExcelFromText,
  generateWordFromExcel,
  generateWordFromPPT,
  generateMergedWordFromPDF,
  generateMergedWordFromExcel,
  generateMergedWordFromPPT,
  generatePPTFromPDF,
  generatePPTFromWord,
  generatePPTFromExcel,
  generateMergedPPTFromPDF,
  generateMergedPPTFromWord,
  generateMergedPPTFromExcel,
  extractTextFromWord,
  extractTextFromExcel,
  extractTextFromPPT,
} from "@/lib/client-generator";
import JSZip from "jszip";

export type ToolType =
  | "ocr" // Use main OCR API
  | "client-convert" // Use client-side logic
  | "office-to-pdf" // Direct Office file to PDF conversion
  | "office-to-image" // Convert document to images (one per page)
  | "office-to-excel" // Convert document to Excel
  | "office-to-word" // Convert document to Word
  | "office-to-ppt" // Convert document to PPT
  | "office-to-text" // Convert document to Text
  | "ocr-pdf" // Use Stirling OCR (Image/PDF to Text)
  | "coming-soon";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  fromFormat: string;
  toFormat: string;
  accept: Record<string, string[]>;
  type: ToolType;
  apiEndpoint?: string;
  content?: React.ReactNode;
  faq?: { question: string; answer: string }[];
  options?: {
    id: string;
    label: string;
    type: 'checkbox';
    defaultValue: boolean;
  }[];
}

export default function GenericTool({ config }: { config: ToolConfig }) {
  // State for multiple files
  const [files, setFiles] = useState<File[]>([]);

  type FileState = {
    file: File;
    id: string;
    batchId: string;
    status: "idle" | "processing" | "success" | "error";
    progress: number;
    result: any | null; // { text: string } or { image: true }
    error: string | null;
    previewUrl: string | null;
  };

  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [optionValues, setOptionValues] = useState<Record<string, boolean>>({});

  // Initialize default options
  useEffect(() => {
    if (config.options) {
      const defaults: Record<string, boolean> = {};
      config.options.forEach((opt) => {
        defaults[opt.id] = opt.defaultValue;
      });
      setOptionValues(defaults);
    }
  }, [config.options]);

  const batchCounterRef = useRef(0);
  const notifiedBatchesRef = useRef<Set<string>>(new Set());

  const updateFileState = (id: string, updates: Partial<FileState>) => {
    setFileStates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  // Validate file type based on expected format
  const validateFileType = (file: File, expectedFormat: string): boolean => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    switch (expectedFormat) {
      case "Image":
        return type.startsWith("image/");
      case "PDF":
        return type === "application/pdf" || name.endsWith(".pdf");
      case "Text":
        return type.startsWith("text/") || name.endsWith(".txt");
      case "Word":
        return (
          type.includes("word") ||
          name.endsWith(".doc") ||
          name.endsWith(".docx")
        );
      case "Excel":
        return (
          type.includes("sheet") ||
          type.includes("excel") ||
          name.endsWith(".xls") ||
          name.endsWith(".xlsx") ||
          name.endsWith(".csv")
        );
      case "PPT":
        return (
          type.includes("presentation") ||
          type.includes("powerpoint") ||
          name.endsWith(".ppt") ||
          name.endsWith(".pptx")
        );
      case "SVG":
        return type === "image/svg+xml" || name.endsWith(".svg");
      default:
        return true; // Allow if format not recognized
    }
  };

  const processFileItem = async (fileState: FileState) => {
    const { file, id } = fileState;
    updateFileState(id, { status: "processing", progress: 10 });

    try {
      // Validate file type based on expected input format
      const isValidType = validateFileType(file, config.fromFormat);
      if (!isValidType) {
        updateFileState(id, {
          status: "error",
          progress: 100,
          error: `Invalid file type. Expected ${config.fromFormat} file.`,
        });
        toast.error(`${file.name}: Invalid file type`);
        return;
      }

      if (config.type === "ocr") {
        const formData = new FormData();
        formData.append("file", file);

        const interval = setInterval(() => {
          setFileStates((current) => {
            return current.map((s) => {
              if (s.id === id && s.progress < 80)
                return { ...s, progress: s.progress + 5 };
              return s;
            });
          });
        }, 500);

        const response = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Conversion failed");
        }

        const data = await response.json();
        let extractedText = "";
        if (data.pages) {
          extractedText = data.pages.map((p: any) => p.text).join("\n\n");
        } else if (data.text) {
          extractedText = data.text;
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { text: extractedText },
        });
      } else if (config.type === "ocr-pdf") {
        const formData = new FormData();
        formData.append("file", file);
        // Default to English for now, could add language selector later
        formData.append("languages", "eng");

        const interval = setInterval(() => {
          setFileStates((current) => {
            return current.map((s) => {
              if (s.id === id && s.progress < 80)
                return { ...s, progress: s.progress + 5 };
              return s;
            });
          });
        }, 500);

        const response = await fetch("/api/tools/ocr-pdf", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "OCR failed");
        }

        const text = await response.text();

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { text },
        });
      } else if (config.type === "office-to-pdf") {
        // Server-side conversion via Stirling PDF API
        updateFileState(id, { progress: 30 });
        let pdfBlob: Blob;

        const formData = new FormData();
        formData.append('file', file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFileStates(prev => prev.map(s =>
            s.id === id && s.progress < 90 ? { ...s, progress: s.progress + 5 } : s
          ));
        }, 500);

        try {
          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          pdfBlob = await response.blob();
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { pdfBlob, officeFile: true },
        });

        // Generate preview for PDF
        try {
          const tempFile = new File([pdfBlob], "temp.pdf", {
            type: "application/pdf",
          });
          generateImagesFromPDF(tempFile)
            .then((images) => {
              if (images.length > 0) {
                const previewUrl = URL.createObjectURL(images[0]);
                updateFileState(id, { previewUrl });
              }
            })
            .catch((err) => console.error("Preview generation failed", err));
        } catch (e) {
          console.error("Failed to initiate preview", e);
        }
      } else if (config.type === "office-to-image") {
        // Document to Image conversion
        updateFileState(id, { progress: 50 });

        let images: Blob[];

        if (config.fromFormat === "PDF") {
          // Use Backend API for PDF to Image
          const formData = new FormData();
          formData.append('file', file);
          formData.append('format', 'png');

          const response = await fetch('/api/tools/pdf-to-image', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          const zipBlob = await response.blob();
          // We need to unzip this to get images for preview/individual download
          // Or GenericTool expects an array of blobs.
          // Let's unzip client side for consistency with existing structure
          const zip = new JSZip();
          const unzipped = await zip.loadAsync(zipBlob);
          images = [];

          // Sort files to ensure order
          const filenames = Object.keys(unzipped.files).sort();
          for (const filename of filenames) {
            if (!unzipped.files[filename].dir) {
              const blob = await unzipped.files[filename].async('blob');
              images.push(blob);
            }
          }
        } else if (config.fromFormat === "Word") {
          // Use Server-side Stirling PDF for high fidelity
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          const pdfBlob = await response.blob();
          // Convert the server-generated high-fidelity PDF to images client-side
          // We use a file object to reuse existing logic
          const pdfFile = new File([pdfBlob], "temp.pdf", { type: "application/pdf" });
          images = await generateImagesFromPDF(pdfFile);

        } else if (config.fromFormat === "Excel") {
          // Use Server-side Stirling PDF for high fidelity
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          const pdfBlob = await response.blob();
          const pdfFile = new File([pdfBlob], "temp.pdf", { type: "application/pdf" });
          images = await generateImagesFromPDF(pdfFile);
        } else if (config.fromFormat === "PPT") {
          // Use Server-side Stirling PDF for high fidelity
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          const pdfBlob = await response.blob();
          const pdfFile = new File([pdfBlob], "temp.pdf", { type: "application/pdf" });
          images = await generateImagesFromPDF(pdfFile);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        // Create preview URL from the first image
        let previewUrl = null;
        if (images.length > 0) {
          previewUrl = URL.createObjectURL(images[0]);
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { images },
          previewUrl: previewUrl || fileState.previewUrl,
        });
      } else if (config.type === "office-to-excel") {
        // Document to Excel conversion
        updateFileState(id, { progress: 50 });

        let excelBlob: Blob;
        if (config.fromFormat === "PDF") {
          excelBlob = await generateExcelFromPDF(file);
        } else if (config.fromFormat === "Word") {
          excelBlob = await generateExcelFromWord(file);
        } else if (config.fromFormat === "PPT") {
          excelBlob = await generateExcelFromPPT(file);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { excelBlob, officeFile: true },
        });
      } else if (config.type === "office-to-word") {
        // Document to Word conversion
        updateFileState(id, { progress: 50 });

        let wordBlob: Blob;
        if (config.fromFormat === "PDF") {
          // Use Backend API for PDF to Word
          const formData = new FormData();
          formData.append('file', file);

          // Pass AI/Smart Mode option if selected
          if (optionValues['smart']) {
            formData.append('mode', 'smart');
          }

          const response = await fetch('/api/tools/pdf-to-word', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          wordBlob = await response.blob();
        } else if (config.fromFormat === "Excel") {
          wordBlob = await generateWordFromExcel(file);
        } else if (config.fromFormat === "PPT") {
          wordBlob = await generateWordFromPPT(file);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { wordBlob, officeFile: true },
        });
      } else if (config.type === "office-to-ppt") {
        // Document to PPT conversion
        updateFileState(id, { progress: 50 });

        let pptBlob: Blob;
        if (config.fromFormat === "PDF") {
          updateFileState(id, { progress: 30 });
          const formData = new FormData();
          formData.append('file', file);
          // Stirling uses 'ppt' or 'presentation' format target
          formData.append('format', 'ppt');

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          pptBlob = await response.blob();
        } else if (config.fromFormat === "Word") {
          pptBlob = await generatePPTFromWord(file);
        } else if (config.fromFormat === "Excel") {
          pptBlob = await generatePPTFromExcel(file);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { pptBlob, officeFile: true },
        });
      } else if (config.type === "office-to-text") {
        // Document to Text conversion
        updateFileState(id, { progress: 50 });

        let text = "";

        if (config.fromFormat === "PDF") {
          // Use Backend API for PDF to Text
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/tools/pdf-to-text', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Conversion failed');
          }

          text = await response.text();

        } else if (config.fromFormat === "Word") {
          text = await extractTextFromWord(file);
        } else if (config.fromFormat === "Excel") {
          text = await extractTextFromExcel(file);
        } else if (config.fromFormat === "PPT") {
          text = await extractTextFromPPT(file);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { text },
        });
      } else if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "Image") {
        // Text to Image conversion
        updateFileState(id, { progress: 50 });

        const text = await file.text();
        const imageBlob = await generateImageFromText(text);

        // Create preview URL
        const previewUrl = URL.createObjectURL(imageBlob);

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { images: [imageBlob] }, // Standardize result format for images
          previewUrl
        });
      } else if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "Excel") {
        // Text to Excel conversion
        updateFileState(id, { progress: 50 });

        const excelBlob = await generateExcelFromText(file);

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { excelBlob }
        });
      } else if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "PPT") {
        // Text to PPT conversion
        updateFileState(id, { progress: 50 });

        const text = await file.text();
        const pptBlob = await generatePPT(text);

        updateFileState(id, {
          status: "success",
          progress: 100,
          result: { pptBlob }
        });
      } else {
        updateFileState(id, {
          status: "error",
          progress: 100,
          error: "This feature is coming soon",
        });
      }
    } catch (err: any) {
      console.error(err);
      updateFileState(id, { status: "error", error: err.message });
      toast.error(`Failed to process ${file.name}`);
    }
  };



  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      if (droppedFiles.length === 0) return;

      const batchId = `${Date.now()}-${batchCounterRef.current++}`;

      // Initialize states for new files
      const newStates: FileState[] = droppedFiles.map((f) => ({
        file: f,
        id: Math.random().toString(36).substring(7),
        batchId,
        status: "idle",
        progress: 0,
        result: null,
        error: null,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      }));

      setFiles((prev) => [...prev, ...droppedFiles]);
      setFileStates((prev) => [...prev, ...newStates]);

      // Process each new file
      newStates.forEach((state) => processFileItem(state));
    },
    [config, processFileItem, optionValues] // Added dependencies
  );

  // Sync preview URLs clean up
  useEffect(() => {
    return () => {
      fileStates.forEach((fs) => {
        if (fs.previewUrl) URL.revokeObjectURL(fs.previewUrl);
      });
    };
  }, []); // Cleanup on unmount, or we could track diffs if needed but unmount is safer for now



  const loading = fileStates.some((fs) => fs.status === "processing");



  useEffect(() => {
    const batches = new Map<string, FileState[]>();
    for (const fs of fileStates) {
      batches.set(fs.batchId, [...(batches.get(fs.batchId) ?? []), fs]);
    }

    for (const [batchId, batchFiles] of batches.entries()) {
      if (notifiedBatchesRef.current.has(batchId)) continue;

      const allSuccess = batchFiles.length > 0 && batchFiles.every((f) => f.status === "success");
      if (!allSuccess) continue;

      notifiedBatchesRef.current.add(batchId);

      const isBatch = batchFiles.length > 1;
      const subject = isBatch ? "files" : batchFiles[0]?.file.name ?? "file";
      const verb = isBatch ? "have" : "has";
      toast.success(`The ${subject} ${verb} been converted successfully, scroll down to download`, {
        duration: 8000,
        icon: <CheckCircle className="h-5 w-5 text-red-600" />,
        className:
          "border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 text-base font-semibold shadow-lg",
      });
    }
  }, [fileStates]);

  const handleDownload = async (fileState: FileState) => {
    if (!fileState.result) return;

    try {
      const { file, result } = fileState;
      let blob: Blob | null = null;

      // Helper to get correct extension
      const getExt = (format: string) => {
        switch (format) {
          case "Image":
            return "png";
          case "PDF":
            return "pdf";
          case "Word":
            return "docx";
          case "Excel":
            return "xlsx";
          case "PPT":
            return "pptx";
          case "Text":
            return "txt";
          default:
            return format.toLowerCase();
        }
      };

      const ext = getExt(config.toFormat);
      const filenameBase = file.name.split(".")[0];
      const filename = `${filenameBase}_converted.${ext}`;

      // Handle office-to-pdf conversion result
      if (result.officeFile && result.pdfBlob) {
        downloadBlob(result.pdfBlob, `${filenameBase}_converted.pdf`);
        return;
      }

      // Handle office-to-excel conversion result (and client-convert Text-to-Excel)
      if (result.excelBlob) {
        downloadBlob(result.excelBlob, `${filenameBase}_converted.xlsx`);
        return;
      }

      // Handle office-to-word conversion result
      if (result.officeFile && result.wordBlob) {
        downloadBlob(result.wordBlob, `${filenameBase}_converted.docx`);
        return;
      }

      // Handle office-to-ppt conversion result (and client-convert Text-to-PPT)
      if (result.pptBlob) {
        downloadBlob(result.pptBlob, `${filenameBase}_converted.pptx`);
        return;
      }

      // Handle office-to-image conversion result
      if (result.images && Array.isArray(result.images)) {
        if (result.images.length === 1) {
          downloadBlob(result.images[0], `${filenameBase}_page_1.png`);
        } else {
          const zip = new JSZip();
          result.images.forEach((blob: Blob, index: number) => {
            zip.file(`page_${index + 1}.png`, blob);
          });
          const content = await zip.generateAsync({ type: "blob" });
          downloadBlob(content, `${filenameBase}_images.zip`);
        }
        return;
      }

      if (result.image && config.toFormat === "PDF") {
        blob = await generatePDFFromImage(file);
        downloadBlob(blob, `${filenameBase}_converted.pdf`);
        return;
      }

      if (!result.text) {
        return;
      }

      switch (config.toFormat) {
        case "Word":
          blob = await generateWord(result.text);
          downloadBlob(blob, `${filenameBase}_converted.docx`);
          break;
        case "Excel":
          blob = await generateExcel(result.text);
          downloadBlob(blob, `${filenameBase}_converted.xlsx`);
          break;
        case "PPT":
          blob = await generatePPT(result.text);
          downloadBlob(blob, `${filenameBase}_converted.pptx`);
          break;
        case "PDF":
          blob = await generatePDF(result.text);
          downloadBlob(blob, `${filenameBase}_converted.pdf`);
          break;
        case "Text":
          blob = new Blob([result.text], { type: "text/plain" });
          downloadBlob(blob, `${filenameBase}_converted.txt`);
          break;
        case "Image":
          blob = await generateImageFromText(result.text);
          downloadBlob(blob, `${filenameBase}_converted.png`);
          break;
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to generate file");
    }
  };

  const handleDownloadAll = async () => {
    const successfulFiles = fileStates.filter(
      (fs) => fs.status === "success" && fs.result,
    );
    if (successfulFiles.length === 0) return;

    try {
      // Office-to-PDF merged mode - use specialized merge functions
      if (config.type === "office-to-pdf" && config.toFormat === "PDF") {
        const files = successfulFiles.map((fs) => fs.file);
        let blob: Blob;

        if (config.fromFormat === "Excel") {
          blob = await generateMergedPDFFromExcel(files);
        } else if (config.fromFormat === "Word") {
          blob = await generateMergedPDFFromWord(files);
        } else if (config.fromFormat === "PPT") {
          blob = await generateMergedPDFFromPPT(files);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.pdf`,
        );
        toast.success("Merged PDF Downloaded!");
        return;
      }

      // Office-to-Excel merged mode
      if (config.type === "office-to-excel" && config.toFormat === "Excel") {
        const files = successfulFiles.map((fs) => fs.file);
        let blob: Blob;

        if (config.fromFormat === "PDF") {
          blob = await generateMergedExcelFromPDF(files);
        } else if (config.fromFormat === "Word") {
          blob = await generateMergedExcelFromWord(files);
        } else if (config.fromFormat === "PPT") {
          blob = await generateMergedExcelFromPPT(files);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.xlsx`,
        );
        toast.success("Merged Excel Downloaded!");
        return;
      }

      // Office-to-Word merged mode
      if (config.type === "office-to-word" && config.toFormat === "Word") {
        const files = successfulFiles.map((fs) => fs.file);
        let blob: Blob;

        if (config.fromFormat === "PDF") {
          blob = await generateMergedWordFromPDF(files);
        } else if (config.fromFormat === "Excel") {
          blob = await generateMergedWordFromExcel(files);
        } else if (config.fromFormat === "PPT") {
          blob = await generateMergedWordFromPPT(files);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.docx`,
        );
        toast.success("Merged Word Downloaded!");
        return;
      }

      // Office-to-PPT merged mode
      if (config.type === "office-to-ppt" && config.toFormat === "PPT") {
        const files = successfulFiles.map((fs) => fs.file);
        let blob: Blob;

        if (config.fromFormat === "PDF") {
          blob = await generateMergedPPTFromPDF(files);
        } else if (config.fromFormat === "Word") {
          blob = await generateMergedPPTFromWord(files);
        } else if (config.fromFormat === "Excel") {
          blob = await generateMergedPPTFromExcel(files);
        } else {
          throw new Error(`Unsupported format: ${config.fromFormat}`);
        }

        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.pptx`,
        );
        toast.success("Merged PPT Downloaded!");
        return;
      }

      // Office-to-Image merged mode (ZIP)
      if (config.type === "office-to-image") {
        const zip = new JSZip();

        successfulFiles.forEach((fs) => {
          const filenameBase = fs.file.name.split(".")[0];
          if (Array.isArray(fs.result.images)) {
            fs.result.images.forEach((blob: Blob, index: number) => {
              zip.file(`${filenameBase}_page_${index + 1}.png`, blob);
            });
          }
        });

        const validFiles = Object.keys(zip.files).length > 0;
        if (!validFiles) {
          toast.error("No valid files to zip.");
          return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(
          content,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_images.zip`,
        );
        toast.success("All Images Downloaded!");
        return;
      }

      // Client-convert Text-to-Image merged mode (ZIP)
      if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "Image") {
        const zip = new JSZip();

        successfulFiles.forEach((fs) => {
          const filenameBase = fs.file.name.split(".")[0];
          if (Array.isArray(fs.result.images)) {
            fs.result.images.forEach((blob: Blob, index: number) => {
              // If there's only 1 image (common for text), no need for page number suffix if user prefers, but keeping it for consistency
              if (fs.result.images.length === 1) {
                zip.file(`${filenameBase}.png`, blob);
              } else {
                zip.file(`${filenameBase}_page_${index + 1}.png`, blob);
              }
            });
          }
        });

        const validFiles = Object.keys(zip.files).length > 0;
        if (!validFiles) {
          toast.error("No valid files to zip.");
          return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(
          content,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_images.zip`,
        );
        toast.success("All Images Downloaded!");
        return;

      }

      // Client-convert Text-to-Excel merged mode (ZIP)
      if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "Excel") {
        const zip = new JSZip();

        successfulFiles.forEach((fs) => {
          const filenameBase = fs.file.name.split(".")[0];
          if (fs.result.excelBlob) {
            zip.file(`${filenameBase}.xlsx`, fs.result.excelBlob);
          }
        });

        const validFiles = Object.keys(zip.files).length > 0;
        if (!validFiles) {
          toast.error("No valid files to zip.");
          return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(
          content,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_converted.zip`,
        );
        toast.success("All Excel Files Downloaded!");
        return;
      }



      // Client-convert Text-to-PPT merged mode (ZIP)
      if (config.type === "client-convert" && config.fromFormat === "Text" && config.toFormat === "PPT") {
        const zip = new JSZip();

        successfulFiles.forEach((fs) => {
          const filenameBase = fs.file.name.split(".")[0];
          if (fs.result.pptBlob) {
            zip.file(`${filenameBase}.pptx`, fs.result.pptBlob);
          }
        });

        const validFiles = Object.keys(zip.files).length > 0;
        if (!validFiles) {
          toast.error("No valid files to zip.");
          return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(
          content,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_converted.zip`,
        );
        toast.success("All PPT Files Downloaded!");
        return;
      }

      // Merged PDF Mode - for image/text to PDF outputs
      if (config.toFormat === "PDF") {
        const blob = await generateMergedPDF(successfulFiles);
        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.pdf`,
        );
        toast.success("Merged PDF Downloaded!");
        return;
      }

      // Merged Word Mode
      if (config.toFormat === "Word") {
        const blob = await generateMergedWord(successfulFiles);
        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.docx`,
        );
        toast.success("Merged Word Document Downloaded!");
        return;
      }

      // Merged Excel Mode
      if (config.toFormat === "Excel") {
        const blob = await generateMergedExcel(successfulFiles);
        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.xlsx`,
        );
        toast.success("Merged Excel Spreadsheet Downloaded!");
        return;
      }

      // Merged PPT Mode
      if (config.toFormat === "PPT") {
        const blob = await generateMergedPPT(successfulFiles);
        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.pptx`,
        );
        toast.success("Merged Presentation Downloaded!");
        return;
      }

      // Merged Text Mode
      if (config.toFormat === "Text") {
        const mergedText = successfulFiles
          .map((fs) => `--- ${fs.file.name} ---\n\n${fs.result.text}`)
          .join("\n\n\n");
        const blob = new Blob([mergedText], { type: "text/plain" });
        downloadBlob(
          blob,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_merged.txt`,
        );
        toast.success("Merged Text File Downloaded!");
        return;
      }

      // Standard ZIP Mode for non-document outputs (e.g. Image output)
      const zip = new JSZip();
      let count = 0;

      for (const fs of successfulFiles) {
        const { file, result } = fs;
        const filenameBase = file.name.split(".")[0];
        const ext =
          config.toFormat === "Image" ? "png" : config.toFormat.toLowerCase();
        const filename = `${filenameBase}_converted.${ext}`;
        let blob: Blob | null = null;

        if (result.text) {
          switch (config.toFormat) {
            case "Image":
              blob = await generateImageFromText(result.text);
              break;
          }
        }

        // Handle client-convert with 'image: true' (image-to-pdf converted flow)
        // This seems to be handled by generateMergedPDF above if format is PDF
        // But if they want ZIP of single PDFs? Unlikely.

        if (blob) {
          zip.file(filename, blob);
          count++;
        }
      }

      if (count > 0) {
        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(
          content,
          `${config.title.toLowerCase().replace(/\s+/g, "_")}_batch.zip`,
        );
        toast.success("Batch download started!");
      } else {
        toast.error("No valid files to zip.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create download");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 pb-2">
          {config.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {config.description}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
        <UploadZone
          onDrop={onDrop}
          uploading={false}
          progress={0}
          accept={config.accept}
        />

        {/* File List */}
        {fileStates.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h3 className="font-bold text-gray-900">
                Your Files ({fileStates.length})
              </h3>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setFileStates([])}
                  disabled={loading}
                >
                  Clear All
                </Button>

                {/* Download All / Merged Button */}
                {fileStates.some((fs) => fs.status === "success") && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleDownloadAll}
                  >
                    {config.toFormat === "PDF" ? (
                      <>
                        <FileStack className="mr-2 h-4 w-4" /> Download Merged
                      </>
                    ) : (
                      <>
                        <Archive className="mr-2 h-4 w-4" /> Download All
                      </>
                    )}
                  </Button>
                )}


              </div>
            </div>

            {fileStates.map((fs) => (
              <div
                key={fs.id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                {/* Header / Status */}
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      {fs.previewUrl ? (
                        <img
                          src={fs.previewUrl}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {fs.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fs.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {fs.status === "processing" && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {fs.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {fs.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {fs.status === "processing" && (
                  <div className="h-1 w-full bg-gray-100">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${fs.progress}%` }}
                    ></div>
                  </div>
                )}

                {/* Content / Actions */}
                {fs.status === "success" && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {/* Text Preview Snippet */}
                    {fs.result?.text && (
                      <div className="mb-2 p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 max-h-24 overflow-hidden relative">
                        {fs.result.text.slice(0, 300)}...
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent"></div>
                      </div>
                    )}

                    {/* Individual download button for each file */}
                    <button
                      onClick={() => handleDownload(fs)}
                      className="w-full py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download {config.toFormat}
                    </button>
                  </div>
                )}

                {fs.status === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm">
                    {fs.error || "Unknown error occurred"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 space-y-20">
        {/* How to Guide */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            How to Convert {config.fromFormat} to {config.toFormat}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                1
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Upload {config.fromFormat} File
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Select your {config.fromFormat} file from your device or drag
                and drop it into the upload box.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                2
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Automatic Conversion
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered tool automatically processes your file with high
                accuracy and preserves formatting.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                3
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Download {config.toFormat}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get your converted {config.toFormat} file instantly. No email or
                registration required.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Key Features of {config.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Exceptional Accuracy
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our advanced engine ensures unmatched detail, clarity, and
                precision.{" "}
                {config.fromFormat === "Image" || config.fromFormat === "PDF"
                  ? "Complex documents and scanned images are processed with ease."
                  : "Formatting and layout are preserved during conversion."}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Instant Results
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload your file and watch it convert within seconds. We
                optimize processing for speed so your workflow stays smooth.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                100% Free & Secure
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No hidden fees, no limits, no sign-ups. Your files are processed
                {config.type.includes("client") ||
                  config.type.includes("office")
                  ? " locally in your browser for maximum privacy."
                  : " securely and deleted automatically."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* SEO Content Section */}
      {config.content && (
        <section className="mt-20 prose prose-lg max-w-4xl mx-auto text-gray-600">
          {config.content}
        </section>
      )}

      {/* FAQ Section */}
      {config.faq && config.faq.length > 0 && (
        <section className="mt-16 w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {config.faq.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
