"use client"

import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * ThirdPartyScripts
 * 
 * Centralized component for managing external scripts using Next.js 'next/script'.
 * This is the standard, production-grade way to handle third-party integrations.
 * 
 * 1. GTM Consent Mode (Strategy: beforeInteractive)
 * 2. Tawk.to Live Chat (Strategy: lazyOnload) - Only on specific high-intent pages
 */
export default function ThirdPartyScripts() {
    const pathname = usePathname()

    // Configuration: Define routes where the live chat widget should be active
    const allowedChatPaths = [
        '/services',
        '/enterprise-custom-ai-solutions',
        '/hire-expert-ai-engineers'
    ]

    // Determine if the current page should display the chat widget
    // We use startsWith to ensure it shows on sub-routes/clusters as well
    const shouldShowChat = allowedChatPaths.some(path => pathname?.startsWith(path))

    return (
        <>
            {/* 1. GTM Consent Mode */}
            <Script
                id="gtm-consent-mode"
                strategy="beforeInteractive"
            >
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'wait_for_update': 500
          });
        `}
            </Script>

            {/* 2. Tawk.to Live Chat (Conditional Visibility) */}
            {shouldShowChat && (
                <Script
                    id="tawk-to-integration"
                    src="https://embed.tawk.to/6999e1f447cf7f1c3ae16c25/1ji0hl9od"
                    strategy="lazyOnload"
                    charSet="UTF-8"
                    crossOrigin="anonymous"
                    onLoad={() => {
                        console.log('[Tawk.to] Standard Script Loaded successfully!');

                        window.Tawk_API = window.Tawk_API || {};
                        window.Tawk_API.jsKey = 'a8d1a22a8138b0504f37f4f049003bc6d9ddc7c1';

                        window.Tawk_API.onLoad = function () {
                            console.log('[Tawk.to] Widget API initialized.');
                            setTimeout(() => {
                                try {
                                    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
                                        console.log('[Tawk.to] Triggering auto-maximize...');
                                        window.Tawk_API.maximize();
                                    }
                                } catch (e) {
                                    console.warn('[Tawk.to] Auto-maximize failed:', e);
                                }
                            }, 3000);
                        };
                    }}
                    onError={(e: Error) => {
                        console.error('[Tawk.to] Script failed to load! Check network/CSP.', e);
                    }}
                />
            )}
        </>
    )
}

// Add Tawk_API to global window type for TypeScript safety
declare global {
    interface Window {
        Tawk_API: any;
        Tawk_LoadStart: Date;
        dataLayer: Object[] | undefined;
    }
}
