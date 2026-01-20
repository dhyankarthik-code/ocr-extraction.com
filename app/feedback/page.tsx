"use client";

import { useState } from "react";
import { Star, Chat } from "react-coolicons";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, feedback: comment }), // API expects 'feedback' not 'comment'
            });

            if (response.ok) {
                toast.success("Thank you for your feedback!");
                setIsSubmitted(true);
            } else {
                let errorMessage = "Something went wrong";
                try {
                    const data = await response.json();
                    errorMessage = data.error || errorMessage;
                } catch (e) {
                    console.error("Feedback submit error:", e);
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Your feedback has been received. We appreciate your input effectively to improve our service.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 w-full" />

                <div className="p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                            We Value Your Feedback
                        </h1>
                        <p className="text-lg text-gray-600">
                            Tell us about your experience using our OCR tool.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-8">
                        {/* Star Rating */}
                        <div className="flex flex-col items-center space-y-3">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rate your experience</span>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star
                                            className={`w-12 h-12 transition-all duration-200 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                                : "fill-gray-100 text-gray-200"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="h-6">
                                {(hoverRating || rating) > 0 && (
                                    <span className="text-purple-600 font-medium animate-in fade-in slide-in-from-bottom-1">
                                        {['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][(hoverRating || rating) - 1]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Comment Box */}
                        <div className="w-full space-y-3">
                            <label htmlFor="feedback-comment" className="text-sm font-bold text-gray-700 block">
                                Additional Comments <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4 text-gray-400 transition-colors group-focus-within:text-purple-500 pointer-events-none">
                                    <Chat className="w-5 h-5" />
                                </div>
                                <textarea
                                    id="feedback-comment"
                                    name="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                    placeholder="What did you like? What can we improve?"
                                    className="w-full h-40 pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-400 text-base shadow-sm group-hover:bg-white"
                                    maxLength={1000}
                                />
                                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                    {comment.length}/1000
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0}
                            className={`w-full py-4 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] ${isSubmitting || rating === 0
                                ? "bg-gray-300 cursor-not-allowed opacity-70"
                                : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 hover:-translate-y-0.5"
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                "Submit Feedback"
                            )}
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
