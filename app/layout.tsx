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
  google: 'HUTjHFqILP0UEMSzlOkJsfFSsnn8Nt8WKPKtQQ1xvS8', // Previous verification code
  other: {
    'google-site-verification': 'google4302c34707f6874e.html', // Add if user provided file name, but they provided TXT record error.
    // Actually, looking at the user screenshot, it failed to find the TOKEN in TXT records.
    // The user likely wants to use the HTML tag method if DNS fails or takes time.
    // Wait, the error message in screenshot is: "We couldn't find your verification token in your domain's TXT records."
    // I should ASK the user for the specific HTML tag content if I want to use that method, OR just use the code from the screenshot if it's visible. 
    // The screenshot shows: `google-site-verification: ...` or similar? No, it usually gives a meta tag like `<meta name="google-site-verification" content="..." />`.
    // The `verification: { google: '...' }` in `layout.tsx` ALREADY has a code 'HUTjHFqILP0UEMSzlOkJsfFSsnn8Nt8WKPKtQQ1xvS8'.
    // This suggests the code might be WRONG or the method is failing. 
    // User showed a screenshot of a *failed* DNS verification. 
    // Often, switching to the meta tag method is instant.
    // I will keep the existing one but maybe I should check if it matches what they *expect*.
    // Actually, the error says: "Found these DNS TXT records instead: ... vc-domain-verify=...".
    // This looks like Vercel domain verification, not Google.
    // Wait, the user might be confusing things or I need to see if `proxy.ts` is unrelated.
    // Let's first look at `proxy.ts`.
  }
},
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

import { SessionProvider } from "@/components/providers/session-provider"
import MainLayout from "@/components/main-layout"

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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <GoogleAnalytics gaId="G-230FBSCTMJ" />
        <GoogleTagManager gtmId="GTM-K9SH3TBW" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://blog.ocr-extraction.com" />
      </head>
      <body className={`${geist.className} font-sans antialiased bg-white text-gray-900`} suppressHydrationWarning>
        <SessionProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <ClientConsentWrapper />
          <AnalyticsTracker />
        </SessionProvider>
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
