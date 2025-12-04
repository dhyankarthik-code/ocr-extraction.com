"use client"

import { useState, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "@/hooks/use-session"
import AuthModal from "@/components/auth-modal"
import ReCAPTCHA from "react-google-recaptcha"
import { Loader2, CheckCircle2, Mail, User, Globe, Phone, MessageSquare } from "lucide-react"

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
    "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
    "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

export default function ContactPage() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: "",
        mobile: "",
        message: ""
    })
    const [captchaVerified, setCaptchaVerified] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    const validateName = (value: string) => {
        // Only allow letters (a-z, A-Z) and spaces
        const filtered = value.replace(/[^a-zA-Z\s]/g, "")
        return filtered
    }

    const validateMobile = (value: string) => {
        // Only allow numbers (0-9) and spaces
        const filtered = value.replace(/[^0-9\s]/g, "")
        return filtered
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtered = validateName(e.target.value)
        setFormData(prev => ({ ...prev, name: filtered }))
        if (errors.name) setErrors(prev => ({ ...prev, name: "" }))
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, email: e.target.value }))
        if (errors.email) setErrors(prev => ({ ...prev, email: "" }))
    }

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtered = validateMobile(e.target.value)
        setFormData(prev => ({ ...prev, mobile: filtered }))
        if (errors.mobile) setErrors(prev => ({ ...prev, mobile: "" }))
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, message: e.target.value }))
        if (errors.message) setErrors(prev => ({ ...prev, message: "" }))
    }

    const handleCountryChange = (value: string) => {
        setFormData(prev => ({ ...prev, country: value }))
        if (errors.country) setErrors(prev => ({ ...prev, country: "" }))
    }

    const handleCaptchaChange = (value: string | null) => {
        setCaptchaVerified(!!value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const newErrors: { [key: string]: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.country) {
            newErrors.country = "Please select a country"
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required"
        } else if (formData.mobile.replace(/\s/g, "").length < 7) {
            newErrors.mobile = "Please enter a valid mobile number"
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required"
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        if (!captchaVerified) {
            alert("Please verify you're not a robot")
            return
        }

        setSubmitting(true)

        try {
            // Submit to API route which will handle Google Sheets and IP capture
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Failed to submit form")
            }

            setSubmitted(true)
            setFormData({
                name: "",
                email: "",
                country: "",
                mobile: "",
                message: ""
            })
            setCaptchaVerified(false)
            recaptchaRef.current?.reset()
        } catch (error) {
            console.error("Contact form error:", error)
            alert("Failed to submit form. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have a question or need support? We're here to help!
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {submitted ? (
                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    Your message has been submitted successfully. We'll get back to you soon!
                                </p>
                                <Button
                                    onClick={() => setSubmitted(false)}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Send Another Message
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Get in Touch</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name *
                                        </label>
                                        <Input
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            placeholder="Enter your full name (letters only)"
                                            className={`w-full ${errors.name ? "border-red-500" : ""}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email *
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            placeholder="your.email@example.com"
                                            className={`w-full ${errors.email ? "border-red-500" : ""}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Country Dropdown */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Country *
                                        </label>
                                        <Select
                                            required
                                            value={formData.country}
                                            onValueChange={handleCountryChange}
                                        >
                                            <SelectTrigger className={`w-full ${errors.country ? "border-red-500" : ""}`}>
                                                <SelectValue placeholder="Select your country" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {COUNTRIES.map((country) => (
                                                    <SelectItem key={country} value={country}>
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Mobile *
                                        </label>
                                        <Input
                                            name="mobile"
                                            type="tel"
                                            required
                                            value={formData.mobile}
                                            onChange={handleMobileChange}
                                            placeholder="+1 234 567 8900 (numbers only)"
                                            className={`w-full ${errors.mobile ? "border-red-500" : ""}`}
                                        />
                                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Message *
                                        </label>
                                        <Textarea
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleMessageChange}
                                            placeholder="How can we help you?"
                                            className={`w-full min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                                        />
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                    </div>

                                    {/* reCAPTCHA */}
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                                            onChange={handleCaptchaChange}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={!captchaVerified || submitting}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => {
                        setShowAuthModal(false)
                        window.location.reload()
                    }}
                />
            )}
        </div>
    )
}
