export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-230FBSCTMJ";

// https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag
export const pageview = (url: string) => {
    if (typeof window.gtag !== "undefined") {
        window.gtag("config", GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

type GTagEvent = {
    action: string;
    category: string;
    label?: string;
    value?: number;
    [key: string]: any;
};

// https://developers.google.com/analytics/devguides/collection/ga4/events?client_type=gtag
export const sendGAEvent = ({ action, category, label, value, ...props }: GTagEvent) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
            ...props,
        });
    }
};

export const updateConsent = (granted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        const state = granted ? 'granted' : 'denied';
        (window as any).gtag('consent', 'update', {
            'analytics_storage': state,
            'ad_storage': state,
            'ad_user_data': state,
            'ad_personalization': state,
        });
    }
};
