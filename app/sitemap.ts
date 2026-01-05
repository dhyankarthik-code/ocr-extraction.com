import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/wordpress'
import fs from 'fs'
import path from 'path'

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

    // Dynamically get tool routes from app/tools directory
    const toolsDirectory = path.join(process.cwd(), 'app', 'tools')
    let toolRoutes: string[] = []

    try {
        const toolFolders = fs.readdirSync(toolsDirectory)
        toolRoutes = toolFolders
            .filter(folder => {
                const fullPath = path.join(toolsDirectory, folder)
                return fs.statSync(fullPath).isDirectory() && !folder.startsWith('.')
            })
            .map(folder => `/tools/${folder}`)
    } catch (error) {
        console.error('Failed to read tools directory for sitemap:', error)
    }

    const allStaticRoutes = [...staticRoutes, ...toolRoutes]

    const staticPages = allStaticRoutes.map((route) => ({
        url: `${baseUrl}${route}`, // Ensure no trailing slash
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Fetch all blog posts dynamically
    try {
        const posts = await getPosts()
        const blogPages = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`, // Ensure no trailing slash
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
