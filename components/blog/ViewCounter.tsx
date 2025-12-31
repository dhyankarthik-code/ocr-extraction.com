"use client"

import { useState, useEffect, useRef } from "react"
import { Eye } from "lucide-react"

interface ViewCounterProps {
    slug: string
}

export default function ViewCounter({ slug }: ViewCounterProps) {
    const [views, setViews] = useState<number | null>(null)
    const counted = useRef(false)

    useEffect(() => {
        if (!slug) return

        // Fetch current views
        fetch(`/api/blog/views?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                // If we haven't counted this view yet in this session (simple check), increment
                // For a more robust check, we rely on the API. But here we just want to fetch.
                // Actually we should increment ONCE per page view.
                if (!counted.current) {
                    incrementView()
                } else {
                    setViews(data.views)
                }
            })
            .catch(() => setViews(0))

    }, [slug])

    const incrementView = async () => {
        counted.current = true
        try {
            const res = await fetch('/api/blog/views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
            })
            const data = await res.json()
            setViews(data.views)
        } catch (e) {
            console.error("View increment failed", e)
        }
    }

    if (views === null) return null // Loading state or hidden

    return (
        <div className="flex items-center gap-1 text-sm text-gray-500" title={`${views} views`}>
            <Eye className="w-4 h-4" />
            <span>{views?.toLocaleString() ?? 0}</span>
        </div>
    )
}
