"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageSquare, User } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
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

    // Validation Functions matching Contact Form
    const validateEmail = (email: string) => {
        // Standard simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const hasInvalidNameChars = (value: string) => {
        return /[0-9]/.test(value)
    }

    // Form State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const formRef = useRef<HTMLDivElement>(null)

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

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        // Trigger validation on blur
        if (field === 'email' && email && !validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address (cannot start with a number)" }))
        }
        if (field === 'name') {
            const cleanedName = name.replace(/[^a-zA-Z\s]/g, "").trim()
            if (cleanedName.length < 2 && name.length > 0) {
                setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }))
            }
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value && !/^[a-zA-Z\s]*$/.test(value)) {
            return
        }
        setName(value)
        if (value.trim().length > 0 && value.trim().length < 2) {
            setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }))
        } else {
            setErrors(prev => ({ ...prev, name: "" }))
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        if (value.includes('@') && !validateEmail(value)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address (cannot start with a number)" }))
        } else {
            setErrors(prev => ({ ...prev, email: "" }))
        }
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= 200) {
            setContent(value)
            if (errors.content) setErrors(prev => ({ ...prev, content: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: { [key: string]: string } = {}
        const cleanedName = name.replace(/[^a-zA-Z\s]/g, "").trim()

        // Name Validation
        if (!name.trim()) {
            newErrors.name = "Name is required"
        } else if (hasInvalidNameChars(name)) {
            newErrors.name = "Name should contain only letters"
        } else if (cleanedName.length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        // Email Validation
        if (!email.trim()) {
            newErrors.email = "Email is required"
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Content Validation
        if (!content.trim()) {
            newErrors.content = "Comment is required"
        } else if (content.trim().length < 10) {
            newErrors.content = "Comment must be at least 10 characters"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setTouched({ name: true, email: true, content: true })
            return
        }

        const token = recaptchaRef.current?.getValue()
        if (!token) {
            toast.error("Please verify you are human")
            return
        }

        setSubmitting(true)

        try {
            const res = await fetch('/api/blog/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    name: cleanedName,
                    email,
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

            // Append new comment to list (optimistic or from response)
            const newComment = {
                id: data.comment?.id || Date.now().toString(),
                name: data.comment?.name || name,
                content: data.comment?.content || content,
                createdAt: new Date().toISOString()
            }
            setComments(prev => [newComment, ...prev])

            // Reset form
            setName("")
            setEmail("")
            setContent("")
            setErrors({})
            setTouched({})
            recaptchaRef.current?.reset()

        } catch (error) {
            console.error("Comment submission error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to post comment")
        } finally {
            setSubmitting(false)
        }
    }

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</label>
                            <Input
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur('name')}
                                placeholder="Your Name"
                                required
                                className={`bg-white transition-all ${errors.name ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => handleBlur('email')}
                                placeholder="name@example.com"
                                required
                                className={`bg-white transition-all ${errors.email ? 'border-red-500 ring-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            <p className="text-xs text-gray-500">Your email will not be published.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment *</label>
                        <Textarea
                            id="comment"
                            value={content}
                            onChange={handleContentChange}
                            onBlur={() => handleBlur('content')}
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

                    <div className="py-2 min-h-[78px] flex items-center justify-start bg-gray-100/50 rounded-lg border border-dashed border-gray-200 px-4">
                        {touched.content || touched.name || touched.email ? (
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lc33R8sAAAAADprj7hnaPVxYBMGgzUEICm_TbBt"}
                            />
                        ) : (
                            <p className="text-xs text-gray-400 italic">Verify you are human (loads on interaction)</p>
                        )}
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
