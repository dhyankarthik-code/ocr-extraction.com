"use client"

import { Brain, Sparkles, FileText, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const LOADING_STATES = [
    { text: "Analyzing document structure...", icon: FileText },
    { text: "Identifying key insights...", icon: Brain },
    { text: "Synthesizing AI summary...", icon: Sparkles },
    { text: "Finalizing report...", icon: CheckCircle2 },
]

export default function PremiumLoadingOverlay() {
    const [currentState, setCurrentState] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentState((prev) => (prev + 1) % LOADING_STATES.length)
        }, 1500) // Switch every 1.5s
        return () => clearInterval(interval)
    }, [])

    const CurrentIcon = LOADING_STATES[currentState].icon

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            {/* Glass Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden"
            >
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_50%)] animate-spin-slow duration-[10s]" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    {/* Animated Icon Container */}
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentState}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CurrentIcon className="w-10 h-10 text-white" strokeWidth={1.5} />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                        {/* Orbital particles */}
                        <div className="absolute inset-0 w-24 h-24 -m-2 border border-white/20 rounded-full animate-[spin_4s_linear_infinite]" />
                        <div className="absolute inset-0 w-28 h-28 -m-4 border border-white/10 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
                    </div>

                    {/* Text Cycle */}
                    <div className="h-16 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={currentState}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl font-bold text-white tracking-tight"
                            >
                                {LOADING_STATES[currentState].text}
                            </motion.h3>
                        </AnimatePresence>
                        <p className="text-white/60 text-sm mt-2 font-medium">Powered by OCR Extraction AI Engine</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 8, // Estimated total time
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
