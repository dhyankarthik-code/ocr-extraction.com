"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import type React from "react"

interface ReCaptchaProviderProps {
    reCaptchaKey: string | undefined
    children: React.ReactNode
}

export const ReCaptchaProvider = ({
    reCaptchaKey,
    children,
}: ReCaptchaProviderProps) => {
    if (!reCaptchaKey) {
        console.warn("reCAPTCHA key not provided. Bot protection logic checks will be skipped on client.")
        return <>{children}</>
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaKey}
            scriptProps={{
                async: false,
                defer: false,
                appendTo: "head",
                nonce: undefined,
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    )
}
