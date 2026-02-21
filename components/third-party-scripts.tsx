"use client"

import Script from 'next/script'

/**
 * ThirdPartyScripts
 * 
 * Centralized component for managing external scripts using Next.js 'next/script'.
 * This is the standard, production-grade way to handle third-party integrations.
 * 
 * 1. GTM Consent Mode (Strategy: beforeInteractive)
 * 2. Tawk.to Live Chat (Strategy: lazyOnload)
 */
export default function ThirdPartyScripts() {
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

            {/* 2. Tawk.to Live Chat */}
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
                                console.log('[Tawk.to] Triggering auto-maximize...');
                                window.Tawk_API.maximize();
                            } catch (e) {
                                console.warn('[Tawk.to] Auto-maximize failed:', e);
                            }
                        }, 3000);
                    };
                }}
                onError={(e) => {
                    console.error('[Tawk.to] Script failed to load! Check network/CSP.', e);
                }}
            />
        </>
    )
}

// Add Tawk_API to global window type for TypeScript safety
declare global {
    interface Window {
        Tawk_API: any;
        Tawk_LoadStart: Date;
        dataLayer: any[];
    }
}
