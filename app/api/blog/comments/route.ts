import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const { slug, name, email, content, recaptchaToken } = await req.json()

        if (!slug || !name || !email || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Verify ReCaptcha if token provided
        if (recaptchaToken) {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' })
            const recaptchaData = await recaptchaRes.json()

            // Note: If secret key is not set, this might fail or we might skip. 
            // For now, if secret is missing we proceed (dev mode) or fail? 
            // The user provided site key, I assume secret is in env. 
            // If verification fails:
            if (!recaptchaData.success && process.env.RECAPTCHA_SECRET_KEY) {
                return NextResponse.json({ error: 'ReCaptcha verification failed' }, { status: 400 })
            }
        }

        // Ensure post exists
        await prisma.blogPost.upsert({
            where: { slug },
            create: { slug },
            update: {}
        })

        const comment = await prisma.blogComment.create({
            data: {
                postSlug: slug,
                name,
                email,
                content,
                approved: true // Default auto-approve
            }
        })

        return NextResponse.json({ success: true, comment })

    } catch (e) {
        console.error('Comment error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')

        if (!slug) return NextResponse.json({ comments: [] })

        const comments = await prisma.blogComment.findMany({
            where: {
                postSlug: slug,
                approved: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ comments })
    } catch (e) {
        return NextResponse.json({ comments: [] })
    }
}
