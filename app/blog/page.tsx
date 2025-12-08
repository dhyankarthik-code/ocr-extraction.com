"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useState, useEffect } from "react"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"

interface BlogPost {
    ID: number
    title: string
    excerpt: string
    date: string
    slug: string
    author: {
        name: string
    }
}

export default function BlogPage() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/ocr-extraction.com/posts')
                const data = await res.json()
                setPosts(data.posts || [])
            } catch (error) {
                console.error("Failed to fetch posts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
                    <p className="text-lg text-gray-600">Latest updates, guides, and news from the Infy Galaxy team.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2">
                        {posts.map((post) => (
                            <article key={post.ID} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="mb-4 text-sm text-gray-500">
                                    {new Date(post.date).toLocaleDateString()} • {post.author.name}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-red-500 transition-colors">
                                    <Link href={`/blog/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title }} />
                                </h2>
                                <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                                <Link href={`/blog/${post.slug}`} className="text-red-500 font-semibold hover:text-red-600 inline-flex items-center gap-1">
                                    Read Article →
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No posts found</h3>
                        <p className="text-gray-600">Check back soon for updates!</p>
                    </div>
                )}
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
