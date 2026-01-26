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
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full shadow hover:shadow-md transition-all"
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
