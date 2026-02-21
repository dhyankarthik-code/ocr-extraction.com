import type React from "react"
import type { Metadata, Viewport } from "next"
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { Geist } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ClientConsentWrapper from "@/components/client-consent-wrapper"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Toaster } from "sonner"
import { SessionProvider } from "@/components/providers/session-provider"
import { ReCaptchaProvider } from "@/components/providers/recaptcha-provider"
import MainLayout from "@/components/main-layout"
import TawkToChat from "@/components/tawk-to-chat"

const geist = Geist({ subsets: ["latin"] })

// Imports moved to top


export const metadata: Metadata = {
  title: {
    default: "InfyGalaxy — AI Platform, AI Tools & Hire Expert AI Engineers | OCR-Extraction.com",
    template: "%s | InfyGalaxy AI Platform"
  },
  description: "InfyGalaxy is a global AI platform specializing in AI tools, AI workflow orchestration, and hiring top 1% AI engineers. Full AI tech stack expertise: Foundation Models, RAG Layer, Vector DB, Fine-tuning Strategy, Prompt Engineering, Agent Orchestration, Observability, MLOps, and Security Layer. Leaders in LLMs, Generative AI, Agentic AI, QCNN, and Quantum Computing.",
  keywords: [
    "ai platform",
    "hire ai engineers",
    "ai tools",
    "ai workflow orchestration",
    "foundation model",
    "rag layer",
    "vector database",
    "fine tuning strategy",
    "prompt engineering",
    "agent orchestration",
    "ai observability",
    "mlops",
    "ai security layer",
    "generative ai",
    "agentic ai",
    "llm fine tuning",
    "ai talent provider",
    "pytorch",
    "tensorflow",
    "langchain",
    "openai api",
    "hugging face",
    "aws sagemaker",
    "azure ml",
    "gcp vertex ai",
    "kubernetes",
    "apache spark",
    "rag pipeline",
    "fastapi",
    "docker",
    "mlflow",
    "scikit learn",
    "opencv",
    "computer vision",
    "stable diffusion",
    "quantum computing ai",
    "nlp engineers",
    "free ocr",
    "image to text",
    "pdf to text"
  ],
  authors: [{ name: "InfyGalaxy Team" }],
  creator: "InfyGalaxy",
  publisher: "InfyGalaxy",
  metadataBase: new URL('https://www.ocr-extraction.com'),
  openGraph: {
    title: "InfyGalaxy — AI Platform, AI Tools & Hire Expert AI Engineers",
    description: "Global AI platform specializing in AI workflow orchestration, AI-powered tools, and hiring top 1% AI engineers. Leaders in MLOps, LLMs, GenAI, Agentic AI, and Quantum Computing.",
    type: 'website',
    url: 'https://www.ocr-extraction.com/',
    images: [
      {
        url: 'https://www.ocr-extraction.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InfyGalaxy AI Platform — AI Tools, AI Engineers & Emerging Tech',
      }
    ],
    siteName: 'InfyGalaxy AI Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: "InfyGalaxy — AI Platform & Hire Expert AI Engineers",
    description: "Global AI platform: AI tools, AI workflow orchestration, MLOps, Generative AI, Agentic AI. Hire pre-vetted AI engineers in 48 hours.",
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
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://blog.ocr-extraction.com" />
      </head>
      <body className={`${geist.className} font-sans antialiased bg-white text-gray-900`} suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-K9SH3TBW" />
        <GoogleAnalytics gaId="G-230FBSCTMJ" />
        <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
          <SessionProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <ClientConsentWrapper />
            <AnalyticsTracker />
            <Toaster position="top-center" />
            <TawkToChat />
          </SessionProvider>
        </ReCaptchaProvider>
        <Analytics />
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
