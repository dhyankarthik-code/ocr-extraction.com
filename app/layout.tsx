import type React from "react"
import type { Metadata, Viewport } from "next"
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { Geist } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ClientConsentWrapper from "@/components/client-consent-wrapper"
import { AnalyticsTracker } from "@/components/analytics-tracker"

const geist = Geist({ subsets: ["latin"] })

// Imports moved to top
import { SessionProvider } from "@/components/providers/session-provider"
import { ReCaptchaProvider } from "@/components/providers/recaptcha-provider"
import MainLayout from "@/components/main-layout"

export const metadata: Metadata = {
  title: {
    default: "Free OCR to Text | Convert Image to Text & Excel | 100% Accurate",
    template: "%s | Free OCR Extraction"
  },
  description: "Best Free OCR tool to convert images, PDFs, and screenshots to editable text or Excel. Supports handwriting recognition, batch processing, and multi-language extraction. No sign-up needed.",
  keywords: [
    "free ocr",
    "image to text",
    "pdf to text",
    "online ocr",
    "ai ocr",
    "extract text from image",
    "ocr to excel",
    "handwriting recognition",
    "batch image to text",
    "scanned document to text",
    "convert screenshot to text",
    "text scanner online"
  ],
  authors: [{ name: "Infy Galaxy Team" }],
  creator: "Infy Galaxy",
  publisher: "Infy Galaxy",
  metadataBase: new URL('https://www.ocr-extraction.com'),
  openGraph: {
    title: "Free OCR to Text | Convert Image/PDF to Text & Excel",
    description: "Convert images to text, PDF, and Excel for free. No limits, 100% accurate AI extraction (Mistral/VLM). Try the best OCR tool online today.",
    type: 'website',
    url: 'https://www.ocr-extraction.com/',
    images: [
      {
        url: 'https://www.ocr-extraction.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Image to Text OCR Extraction Tool Interface',
      }
    ],
    siteName: 'Free OCR Extraction',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Best Free OCR: Image to Text Converter",
    description: "Extract text from generic images, screenshots, and PDFs instantly. 100% Free & Accurate.",
    images: ['https://www.ocr-extraction.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
  verification: {
    google: 'HUTjHFqILP0UEMSzlOkJsfFSsnn8Nt8WKPKtQQ1xvS8',
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Free OCR Extraction",
        "url": "https://www.ocr-extraction.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.ocr-extraction.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "name": ["Tools", "Services", "Blog", "Contact"],
        "url": [
          "https://www.ocr-extraction.com/tools",
          "https://www.ocr-extraction.com/services",
          "https://www.ocr-extraction.com/blog",
          "https://www.ocr-extraction.com/contact"
        ]
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="gtm-consent-mode"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <GoogleAnalytics gaId="G-230FBSCTMJ" />
        <GoogleTagManager gtmId="GTM-K9SH3TBW" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://blog.ocr-extraction.com" />
      </head>
      <body className={`${geist.className} font-sans antialiased bg-white text-gray-900`} suppressHydrationWarning>
        <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
          <SessionProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <ClientConsentWrapper />
            <AnalyticsTracker />
          </SessionProvider>
        </ReCaptchaProvider>
        <Analytics />
        <SpeedInsights />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // ...
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Free OCR Extraction",
                  "url": "https://www.ocr-extraction.com"
                },
                {
                  "@type": "Organization",
                  "name": "Infy Galaxy",
                  "url": "https://www.ocr-extraction.com",
                  "logo": "https://www.ocr-extraction.com/logo.png",
                  "sameAs": [
                    "https://twitter.com/infygalaxy",
                    "https://facebook.com/infygalaxy"
                  ]
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": ["Tools", "Services", "Blog", "Contact"],
                  "url": [
                    "https://www.ocr-extraction.com/tools",
                    "https://www.ocr-extraction.com/services",
                    "https://www.ocr-extraction.com/blog",
                    "https://www.ocr-extraction.com/contact"
                  ]
                }
              ]
            })
          }}
        />

      </body>
    </html>
  )
}
