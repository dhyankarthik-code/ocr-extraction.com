"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState, useEffect } from "react"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { useParams } from "next/navigation"

interface BlogPost {
    ID: number
    title: string
    content: string
    date: string
    author: {
        name: string
    }
}

export default function BlogPostPage() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const slug = params.slug

    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                // Fetch single post by slug
                const res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/ocr-extraction.com/posts/slug:${slug}`)
                const data = await res.json()
                setPost(data)
            } catch (error) {
                console.error("Failed to fetch post:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
                <Navbar
                    session={session}
                    onLogout={logout}
                    onLoginClick={() => setShowAuthModal(true)}
                />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
                <Navbar
                    session={session}
                    onLogout={logout}
                    onLoginClick={() => setShowAuthModal(true)}
                />
                <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <Link href="/blog" className="text-red-500 hover:text-red-600 font-medium">← Back to Blog</Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/blog" className="text-gray-500 hover:text-red-500 text-sm mb-8 inline-block">
                    ← Back to Blog
                </Link>

                <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <header className="mb-8 border-b border-gray-100 pb-8">
                        <div className="text-sm text-gray-500 mb-2">
                            {new Date(post.date).toLocaleDateString()} • {post.author.name}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-0" dangerouslySetInnerHTML={{ __html: post.title }} />
                    </header>

                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>

            <Footer />

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    )
}
