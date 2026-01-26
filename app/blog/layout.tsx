"use client"

import { ReCaptchaProvider } from "@/components/providers/recaptcha-provider"

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            {children}
        </ReCaptchaProvider>
    )
}
