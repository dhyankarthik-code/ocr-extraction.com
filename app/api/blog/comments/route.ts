import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const { slug, content, recaptchaToken } = await req.json()

        if (!slug || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Verify ReCaptcha v3 if token provided
        if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`
            const recaptchaRes = await fetch(verifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
            })
            const recaptchaData = await recaptchaRes.json()

            // v3 returns success + score (0.0 to 1.0, higher = more likely human)
            // Also verify the action matches what we expect
            if (!recaptchaData.success) {
                console.error('reCAPTCHA verification failed:', recaptchaData['error-codes'])
                return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
            }

            // Check score threshold (0.5 is recommended default)
            if (recaptchaData.score !== undefined && recaptchaData.score < 0.5) {
                console.warn('reCAPTCHA score too low:', recaptchaData.score)
                return NextResponse.json({ error: 'Suspicious activity detected' }, { status: 400 })
            }

            // Optionally verify action
            if (recaptchaData.action && recaptchaData.action !== 'comment_submit') {
                console.warn('reCAPTCHA action mismatch:', recaptchaData.action)
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
