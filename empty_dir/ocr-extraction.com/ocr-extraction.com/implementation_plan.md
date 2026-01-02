# Implementation Plan - PDF Fixes & Document Merging

## Goal
Resolve issues with image trimming in PDF conversion, implement merging of multiple results into a single document for downloads (instead of ZIP files), and enable the "Text to Image" conversion feature.

## Proposed Changes

### Library: Client-side Generators
#### [MODIFY] [client-generator.ts](file:///d:/Projects/Free%20OCR%20Website%20prj/free-ocr-app/lib/client-generator.ts)
- **Fix PDF Trimming**: Update `generatePDFFromImage` and `generateMergedPDF` to scale images proportionally so they fit within the PDF page boundaries (centering them if smaller).
- **Implement Merging**:
    - Add `generateMergedWord`: Concatenate text from all files with page breaks.
    - Add `generateMergedExcel`: Combine all text into a single sheet (one row per line) or multiple sheets.
    - Add `generateMergedPPT`: One slide per source file.
    - Add `generateMergedText`: Single string with separators.
- **Implement Text-to-Image**:
    - Add `generateImageFromText`: Render text onto a canvas and return as a Blob (PNG/JPEG).

### Component: Generic Tool
#### [MODIFY] [generic-tool.tsx](file:///d:/Projects/Free%20OCR%20Website%20prj/free-ocr-app/components/tools/generic-tool.tsx)
- **Update Download All**:
    - If `toFormat` is Word, Excel, PPT, or Text, call the respective `merged` generator.
    - Keep ZIP functionality only for `Image` output (as requested: "except any * to image tools").
- **Fix Individual Image Download**: Enable the download action for the "Text to Image" tool.

## Verification Plan

### Manual Verification
1.  **PDF Trimming**: Upload a tall image (e.g., a long receipt) and convert to PDF. Verify the entire image is visible and not cut off.
2.  **Merging**: Upload 3 text files to "Text to Word". Click "Download All". Verify a single `.docx` file is downloaded containing text from all 3 files.
3.  **Text to Image**: Upload a text file to "Text to Image". Verify the "Download Image" button works and produces a readable image.
