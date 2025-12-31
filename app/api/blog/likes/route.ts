import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { slug, sessionId } = await req.json()
        if (!slug || !sessionId) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

        // Ensure post exists
        await prisma.blogPost.upsert({
            where: { slug },
            create: { slug },
            update: {}
        })

        // Check if already liked
        const existingLike = await prisma.blogLike.findUnique({
            where: {
                postSlug_sessionId: {
                    postSlug: slug,
                    sessionId: sessionId
                }
            }
        })

        if (existingLike) {
            // Unlike
            await prisma.blogLike.delete({
                where: { id: existingLike.id }
            })
            const count = await prisma.blogLike.count({ where: { postSlug: slug } })
            return NextResponse.json({ liked: false, count })
        } else {
            // Like
            await prisma.blogLike.create({
                data: {
                    postSlug: slug,
                    sessionId: sessionId
                }
            })
            const count = await prisma.blogLike.count({ where: { postSlug: slug } })
            return NextResponse.json({ liked: true, count })
        }

    } catch (e) {
        console.error('Like error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')
        const sessionId = searchParams.get('sessionId')

        if (!slug) return NextResponse.json({ count: 0, liked: false })

        const count = await prisma.blogLike.count({ where: { postSlug: slug } })

        let liked = false
        if (sessionId) {
            const userLike = await prisma.blogLike.findUnique({
                where: {
                    postSlug_sessionId: {
                        postSlug: slug,
                        sessionId: sessionId
                    }
                }
            })
            liked = !!userLike
        }

        return NextResponse.json({ count, liked })
    } catch (e) {
        return NextResponse.json({ count: 0, liked: false })
    }
}
