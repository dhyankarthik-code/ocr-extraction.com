import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ocr-extraction.com'

    // Define static routes
    const staticRoutes = [
        '',
        '/about',
        '/about-ocr',
        '/blog',
        '/contact',
        '/mission',
        '/privacy',
        '/terms',
        '/company-profile',
        '/faqs',
        '/services',
    ]

    const staticPages = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Fetch all blog posts dynamically
    try {
        const posts = await getPosts()
        const blogPages = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))

        return [...staticPages, ...blogPages]
    } catch (error) {
        console.error('Failed to fetch blog posts for sitemap:', error)
        // Return static pages only if blog fetch fails
        return staticPages
    }
}
