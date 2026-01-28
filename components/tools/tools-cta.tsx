"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

export function ToolsCTA() {
    const [showContact, setShowContact] = useState(false)

    return (
        <>
            <div className="mt-8 text-center space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Reach Out To The <span className="text-red-600">Experts</span>
                </h2>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    Looking For Workflow Automation, AI Orchestration Or Agentic AI Integration And Deployment
                </h3>

                <Button
                    size="lg"
                    onClick={() => setShowContact(true)}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xl px-12 py-10 rounded-[2.5rem] shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-2 transition-all duration-500 border-b-8 border-red-800 active:translate-y-0 active:border-b-0"
                >
                    Try Our Live Demo
                </Button>
            </div>

            <ContactModal
                isOpen={showContact}
                onClose={() => setShowContact(false)}
            />
        </>
    )
}
