import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { slug } = await req.json()
        if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 })

        const post = await prisma.blogPost.upsert({
            where: { slug },
            create: { slug, viewCount: 1 },
            update: { viewCount: { increment: 1 } }
        })

        return NextResponse.json({ views: post.viewCount })
    } catch (e) {
        console.error('View increment error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')
        if (!slug) return NextResponse.json({ views: 0 })

        const post = await prisma.blogPost.findUnique({ where: { slug } })
        return NextResponse.json({ views: post?.viewCount || 0 })
    } catch (e) {
        return NextResponse.json({ views: 0 })
    }
}
