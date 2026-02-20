import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/llms
 * Serves llms.txt content as plain text with permissive CORS headers.
 * This bypasses any static file bot-protection (Vercel Firewall, WAF)
 * so AI crawlers like Perplexity, ChatGPT, etc. can access the content.
 */
export async function GET() {
    try {
        const filePath = join(process.cwd(), 'public', 'llms.txt')
        const content = await readFile(filePath, 'utf-8')

        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
                'X-Robots-Tag': 'all',
            },
        })
    } catch {
        return NextResponse.json(
            { error: 'llms.txt not found' },
            { status: 404 }
        )
    }
}

/** Handle CORS preflight */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
    })
}
