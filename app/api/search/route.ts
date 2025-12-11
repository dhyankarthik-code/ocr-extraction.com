import { Mistral } from '@mistralai/mistralai';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Split text into chunks for better search results
 */
function chunkText(text: string, maxChunkLength: number = 500): string[] {
    const sentences = text.split(/[.!?]\s+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks.filter(chunk => chunk.length > 20); // Filter out very small chunks
}

export async function POST(request: NextRequest) {
    try {
        console.log('[Search API] Received request')
        const { query, text } = await request.json();

        if (!query || !text) {
            console.log('[Search API] Missing query or text')
            return NextResponse.json(
                { error: 'Query and text are required' },
                { status: 400 }
            );
        }

        console.log('[Search API] Query:', query)
        console.log('[Search API] Text length:', text.length)

        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            console.log('[Search API] Mistral API key not found')
            return NextResponse.json(
                { error: 'Mistral API key not configured' },
                { status: 500 }
            );
        }

        const client = new Mistral({ apiKey: mistralKey });

        // Split text into chunks
        console.log('[Search API] Chunking text...')
        const chunks = chunkText(text);
        console.log('[Search API] Created', chunks.length, 'chunks')

        // Generate embeddings for query and all chunks using Mistral
        console.log('[Search API] Generating embeddings...')

        // Mistral batch embedding
        // We need to embed the query AND the chunks.
        // Let's do them in parallel or batch.

        const [queryEmbeddingResponse, chunkEmbeddingsResponse] = await Promise.all([
            client.embeddings.create({
                model: 'mistral-embed',
                inputs: [query],
            }),
            client.embeddings.create({
                model: 'mistral-embed',
                inputs: chunks,
            }),
        ]);

        console.log('[Search API] Embeddings generated successfully')

        const queryEmbedding = queryEmbeddingResponse.data[0].embedding;
        const chunkEmbeddings = chunkEmbeddingsResponse.data.map(d => d.embedding);

        // Calculate similarities
        const results = chunks.map((chunk, index) => {
            const chunkEmbedding = chunkEmbeddings[index];
            const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);

            return {
                text: chunk,
                similarity,
            };
        });

        // Sort by similarity (highest first) and return top 5
        const topResults = results
            .filter(r => r.similarity > 0.5) // Only return results with >50% similarity
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        console.log('[Search API] Found', topResults.length, 'relevant results')

        return NextResponse.json({
            results: topResults,
            totalChunks: chunks.length,
        });
    } catch (error: any) {
        console.error('[Search API] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to perform semantic search' },
            { status: 500 }
        );
    }
}
