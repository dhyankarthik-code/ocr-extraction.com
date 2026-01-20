import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token is missing' }, { status: 400 })
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY

        if (!secretKey) {
            console.error("RECAPTCHA_SECRET_KEY is not defined")
            // Fail open or closed depending on policy? Failing closed (safe)
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
        }

        // Verify the token with Google
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
        )

        const { success, score } = response.data

        console.log("reCAPTCHA verification:", success, score)

        if (!success || score < 0.5) {
            return NextResponse.json({ success: false, message: 'Bot detected' }, { status: 403 })
        }

        return NextResponse.json({ success: true, score })
    } catch (error) {
        console.error('reCAPTCHA verification error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
