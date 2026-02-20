import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // AI crawlers — explicitly allow /api/llms and /llms.txt
            {
                userAgent: [
                    'PerplexityBot',
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'Googlebot',
                    'anthropic-ai',
                    'ClaudeBot',
                    'Bytespider',
                    'CCBot',
                    'cohere-ai',
                ],
                allow: ['/', '/llms.txt', '/api/llms'],
                disallow: ['/admin/', '/result/', '/_next/'],
            },
            // All other bots — standard rules
            {
                userAgent: '*',
                allow: ['/', '/llms.txt'],
                disallow: ['/api/', '/admin/', '/result/', '/_next/'],
            },
        ],
        sitemap: 'https://www.ocr-extraction.com/sitemap.xml',
    }
}
