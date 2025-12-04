/**
 * Rule-based OCR error correction and validation
 * Fixes common OCR mistakes without using AI APIs
 */

export interface ValidationWarning {
    type: 'character' | 'structure' | 'outlier';
    message: string;
    line?: number;
    suggestion?: string;
}

/**
 * Fix common OCR character confusion errors
 */
export function fixCommonOCRErrors(text: string): string {
    let fixed = text;

    // Split into lines for context-aware processing
    const lines = fixed.split('\n');
    const processedLines = lines.map(line => {
        let processedLine = line;

        // 1. O ↔ 0 corrections based on context
        // Fix O to 0 when surrounded by numbers
        processedLine = processedLine.replace(/(\d+)[O](\d+)/g, '$10$2');
        processedLine = processedLine.replace(/(\d+)[O](?=\s|$|[^\w])/g, '$10');
        processedLine = processedLine.replace(/(?<=\s|^|[^\w])[O](\d+)/g, '0$1');

        // Fix 0 to O when surrounded by letters (stock symbols)
        processedLine = processedLine.replace(/([A-Z]{2,})[0]([A-Z]+)/g, '$1O$2');

        // 2. l/I ↔ 1 corrections in numeric contexts
        processedLine = processedLine.replace(/(\d+)[lI](\d+)/g, '$11$2');
        processedLine = processedLine.replace(/(\d+)[lI](?=\s|$|[^\w])/g, '$11');
        processedLine = processedLine.replace(/(?<=\s|^|[^\w])[lI](\d+)/g, '1$1');

        // 3. S ↔ 5 corrections
        processedLine = processedLine.replace(/(\d+)[S](\d+)/g, '$15$2');
        processedLine = processedLine.replace(/(?<=\s|^|[^\d])[S](?=\d)/g, '5');

        // 4. Z ↔ 2 corrections
        processedLine = processedLine.replace(/(\d+)[Z](\d+)/g, '$12$2');

        // 5. B ↔ 8 corrections
        processedLine = processedLine.replace(/(\d+)[B](\d+)/g, '$18$2');

        // 6. Clean up common decimal issues
        processedLine = processedLine.replace(/(\d),(\d{3})/g, '$1$2'); // Remove thousands separators
        processedLine = processedLine.replace(/\.{2,}/g, '.'); // Multiple dots to single

        return processedLine;
    });

    return processedLines.join('\n');
}

/**
 * Parse table structure from text
 */
export function parseTableStructure(text: string): string[][] {
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    return lines.map(line => {
        // Split by pipe, comma, tab, or multiple spaces
        return line
            .split(/\s*\|\s*|\s{2,}|\t/)
            .map(cell => cell.trim())
            .filter(cell => cell.length > 0);
    });
}

/**
 * Validate table structure and return warnings
 */
export function validateTableStructure(rows: string[][]): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    if (rows.length === 0) {
        return warnings;
    }

    // Check column consistency
    const columnCounts = rows.map(row => row.length);
    const avgColumns = columnCounts.reduce((a, b) => a + b, 0) / columnCounts.length;
    const maxColumns = Math.max(...columnCounts);
    const minColumns = Math.min(...columnCounts);

    if (maxColumns - minColumns > 2) {
        warnings.push({
            type: 'structure',
            message: `Inconsistent column count detected (${minColumns}-${maxColumns} columns). Table structure may be malformed.`,
        });
    }

    // Check for empty cells
    rows.forEach((row, index) => {
        const emptyCells = row.filter(cell => !cell || cell.trim() === '').length;
        if (emptyCells > row.length / 2) {
            warnings.push({
                type: 'structure',
                message: `Row ${index + 1} has too many empty cells (${emptyCells}/${row.length})`,
                line: index + 1,
            });
        }
    });

    return warnings;
}

/**
 * Detect numerical outliers in a column
 */
export function detectOutliers(numbers: number[]): number[] {
    if (numbers.length < 4) return [];

    // Calculate mean and standard deviation
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);

    // Values beyond 3 standard deviations are outliers
    return numbers.filter(num => Math.abs(num - mean) > 3 * stdDev);
}

/**
 * Validate numerical data in table
 */
export function validateNumericalData(rows: string[][]): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    if (rows.length === 0) return warnings;

    // Analyze each column
    const columnCount = Math.max(...rows.map(row => row.length));

    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        const columnValues = rows
            .map(row => row[colIndex])
            .filter(cell => cell && cell.trim());

        // Try to parse as numbers
        const numbers = columnValues
            .map(val => parseFloat(val.replace(/[^\d.-]/g, '')))
            .filter(num => !isNaN(num));

        if (numbers.length > 3) {
            const outliers = detectOutliers(numbers);
            if (outliers.length > 0) {
                warnings.push({
                    type: 'outlier',
                    message: `Column ${colIndex + 1} contains ${outliers.length} potential outlier(s): ${outliers.join(', ')}`,
                    suggestion: 'Verify these values for OCR errors',
                });
            }
        }
    }

    return warnings;
}

/**
 * Main validation function - returns corrected text and warnings
 */
export function validateAndCorrectOCR(rawText: string): {
    correctedText: string;
    warnings: ValidationWarning[];
} {
    // Step 1: Fix common character errors
    const correctedText = fixCommonOCRErrors(rawText);

    // Step 2: Parse and validate structure
    const tableRows = parseTableStructure(correctedText);
    const structureWarnings = validateTableStructure(tableRows);
    const numericalWarnings = validateNumericalData(tableRows);

    return {
        correctedText,
        warnings: [...structureWarnings, ...numericalWarnings],
    };
}
