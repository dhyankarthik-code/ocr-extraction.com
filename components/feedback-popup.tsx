"use client";

import { useState, useEffect } from "react";
import { Star, Chat } from "react-coolicons";
import { X as Close } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export default function FeedbackPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasVoted, setHasVoted] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const checkVotingStatus = async () => {
            try {
                const response = await fetch("/api/feedback?check=true");
                if (response.ok) {
                    const data = await response.json();
                    if (!data.hasVoted) {
                        setHasVoted(false);
                        setTimeout(() => setIsOpen(true), 1000);
                    }
                } else {
                    console.error("Feedback check failed:", response.status);
                }
            } catch (error) {
                console.error("Failed to check feedback status", error);
            }
        };

        checkVotingStatus();
    }, []);

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
                body: JSON.stringify({ rating, comment }),
            });

            if (response.ok) {
                toast.success("Thank you for your feedback!");
                setIsOpen(false);
                setHasVoted(true);
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

    if (hasVoted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="h-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 w-full" />

                        <div className="p-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                aria-label="Close feedback popup"
                            >
                                <Close className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                                    We Value Your Feedback
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Please share your experience. Your suggestions are welcome.
                                </p>
                            </div>

                            <div className="flex flex-col items-center space-y-8">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            aria-label={`Rate ${star} stars`}
                                        >
                                            <Star
                                                className={`w-12 h-12 transition-colors ${star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-gray-100 text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="w-full relative">
                                    <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                                        <Chat className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit();
                                            }
                                        }}
                                        placeholder="Your feedback will help us improve..."
                                        className="w-full h-32 pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none transition-all placeholder:text-gray-400 text-base"
                                        maxLength={1000}
                                        aria-label="Feedback comment"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || rating === 0}
                                    className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-900/30 active:scale-[0.98]"
                                >
                                    {isSubmitting ? "Sending..." : "Submit Feedback"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
