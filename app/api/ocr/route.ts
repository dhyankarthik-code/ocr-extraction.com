import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to log detailed error information
function logError(error: any, context: string = '') {
  console.error(`[${new Date().toISOString()}] Error${context ? ' in ' + context : ''}:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    response: error.response?.data || 'No response data',
    status: error.response?.status,
    statusText: error.response?.statusText,
    headers: error.response?.headers,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers ? Object.keys(error.config.headers) : 'No headers',
      data: error.config?.data ? 'Data exists' : 'No data'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received OCR request');

    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      const error = new Error('Mistral API key not configured');
      logError(error, 'API key check');
      return NextResponse.json(
        { error: 'Mistral API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      const error = new Error('No file provided in the request');
      logError(error, 'File validation');
      return NextResponse.json(
        { error: 'No file provided. Please upload an image file.' },
        { status: 400 }
      );
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    try {
      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const imageUrl = `data:${file.type};base64,${base64}`;

      console.log('Initializing Mistral client...');
      const client = new Mistral({ apiKey });

      console.log('Sending request to Mistral OCR API...');
      const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "image_url",
          imageUrl: imageUrl,
        },
        includeImageBase64: false,
      });

      console.log('Received response from Mistral API:', JSON.stringify(ocrResponse, null, 2));

      // Extract text from the OCR response (pages[].markdown or documentAnnotation)
      let rawText = '';
      if ((ocrResponse as any)?.pages?.length) {
        try {
          rawText = (ocrResponse as any).pages
            .map((p: any) => p?.markdown || '')
            .filter((s: string) => s && s.trim().length > 0)
            .join('\n\n');
        } catch (e) {
          console.warn('Failed to concatenate OCR pages markdown:', e);
        }
      }
      if (!rawText && (ocrResponse as any)?.documentAnnotation) {
        rawText = String((ocrResponse as any).documentAnnotation);
      }

      console.log('Extracted raw text length:', rawText?.length || 0);

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('Mistral API returned an empty response. The image might not contain recognizable text.');
      }

      // Apply rule-based OCR error correction and validation
      const { validateAndCorrectOCR } = await import('@/lib/ocr-validator');
      const { correctedText, warnings } = validateAndCorrectOCR(rawText);

      console.log('Validation warnings:', warnings.length);
      console.log('Corrected text length:', correctedText.length);

      return NextResponse.json({
        success: true,
        text: correctedText,
        rawText: rawText,
        characters: correctedText.length,
        warnings: warnings.map(w => w.message),
      });

    } catch (apiError: any) {
      logError(apiError, 'Mistral API call');
      throw new Error(`Mistral API Error: ${apiError.message}`);
    }

  } catch (error: any) {
    logError(error, 'OCR processing');
    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
