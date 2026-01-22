import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/result/', '/_next/'],
        },
        sitemap: 'https://www.ocr-extraction.com/sitemap.xml',
    }
}
