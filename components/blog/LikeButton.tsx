"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"

interface LikeButtonProps {
    slug: string
}

export default function LikeButton({ slug }: LikeButtonProps) {
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)

    // Load initial state
    useEffect(() => {
        if (!slug) return

        // Generate or retrieve session ID
        let sessionId = localStorage.getItem('blog_session_id')
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem('blog_session_id', sessionId)
        }

        fetch(`/api/blog/likes?slug=${slug}&sessionId=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setLikes(data.count)
                setLiked(data.liked)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch likes", err)
                setLoading(false)
            })
    }, [slug])

    const handleToggleLike = async () => {
        if (loading) return

        // Optimistic UI
        const previousLiked = liked
        const previousLikes = likes
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)

        try {
            let sessionId = localStorage.getItem('blog_session_id')
            if (!sessionId) {
                sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
                localStorage.setItem('blog_session_id', sessionId)
            }

            const res = await fetch('/api/blog/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, sessionId })
            })

            if (!res.ok) throw new Error('Failed to update like')

            const data = await res.json()
            setLikes(data.count) // Sync with server count which might include others
            setLiked(data.liked)

        } catch (error) {
            console.error("Like toggle failed:", error)
            // Revert on error
            setLiked(previousLiked)
            setLikes(previousLikes)
            toast.error("Something went wrong. Please try again.")
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggleLike}
            className={`gap-2 rounded-full transition-all ${liked ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700' : 'text-gray-600 hover:text-red-600'}`}
        >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
            <span className="sr-only">Likes</span>
        </Button>
    )
}
