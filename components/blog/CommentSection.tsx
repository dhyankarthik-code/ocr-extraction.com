"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageSquare, ShieldCheck } from "lucide-react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { toast } from "sonner"

interface Comment {
    id: string
    name: string
    content: string
    createdAt: string
}

interface CommentSectionProps {
    slug: string
}

export default function CommentSection({ slug }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const formRef = useRef<HTMLDivElement>(null)

    // reCAPTCHA v3 hook
    const { executeRecaptcha } = useGoogleReCaptcha()

    // Load Comments
    useEffect(() => {
        if (!slug) return

        fetch(`/api/blog/comments?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || [])
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load comments", err)
                setLoading(false)
            })
    }, [slug])

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= 200) {
            setContent(value)
            if (errors.content) setErrors(prev => ({ ...prev, content: "" }))
        }
    }

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: { [key: string]: string } = {}

        // Content Validation
        if (!content.trim()) {
            newErrors.content = "Comment is required"
        } else if (content.trim().length < 10) {
            newErrors.content = "Comment must be at least 10 characters"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Execute reCAPTCHA v3
        if (!executeRecaptcha) {
            toast.error("reCAPTCHA not ready. Please try again.")
            return
        }

        setSubmitting(true)

        try {
            const token = await executeRecaptcha("comment_submit")

            const res = await fetch('/api/blog/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    content,
                    recaptchaToken: token
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit comment')
            }

            // Success
            toast.success("Comment posted successfully!")

            // Append new comment to list
            const newComment = {
                id: data.comment?.id || Date.now().toString(),
                name: "Anonymous User",
                content: data.comment?.content || content,
                createdAt: new Date().toISOString()
            }
            setComments(prev => [newComment, ...prev])

            // Reset form
            setContent("")
            setErrors({})

        } catch (error) {
            console.error("Comment submission error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to post comment")
        } finally {
            setSubmitting(false)
        }
    }, [content, executeRecaptcha, slug])

    return (
        <div className="mt-12 border-t border-gray-100 pt-10" ref={formRef}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Leave a Reply</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment *</label>
                        <Textarea
                            id="comment"
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Share your thoughts..."
                            required
                            className={`bg-white min-h-[100px] transition-all ${errors.content ? 'border-red-500 ring-red-500' : ''}`}
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.content ? (
                                <p className="text-red-500 text-xs">{errors.content}</p>
                            ) : <span></span>}
                            <span className="text-xs text-gray-500">{content.length}/200</span>
                        </div>
                    </div>

                    {/* reCAPTCHA v3 Badge Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Protected by reCAPTCHA</span>
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            "Post Comment"
                        )}
                    </Button>
                </form>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500 font-bold">
                                    {(comment.name?.[0] || 'U').toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-gray-900">{comment.name}</h5>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </div>
    )
}
