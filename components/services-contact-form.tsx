"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2, User, Mail, Building2, MessageSquare, Phone, Sparkles, Zap } from "lucide-react"
import { sendGAEvent } from "@/lib/gtag"

// Country data with phone codes and validation patterns
const countries = [
    { code: "US", name: "United States", dialCode: "+1", pattern: /^\d{10}$/, placeholder: "2025551234", format: "10 digits" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", pattern: /^\d{10}$/, placeholder: "2012345678", format: "10 digits" },
    { code: "IN", name: "India", dialCode: "+91", pattern: /^\d{10}$/, placeholder: "9876543210", format: "10 digits" },
    { code: "CA", dialCode: "+1", name: "Canada", pattern: /^\d{10}$/, placeholder: "4165551234", format: "10 digits" },
    { code: "AU", name: "Australia", dialCode: "+61", pattern: /^\d{9}$/, placeholder: "412345678", format: "9 digits" },
    { code: "DE", name: "Germany", dialCode: "+49", pattern: /^\d{10,11}$/, placeholder: "15112345678", format: "10-11 digits" },
    { code: "FR", name: "France", dialCode: "+33", pattern: /^\d{9}$/, placeholder: "612345678", format: "9 digits" },
    { code: "SG", name: "Singapore", dialCode: "+65", pattern: /^\d{8}$/, placeholder: "81234567", format: "8 digits" },
    { code: "AE", name: "UAE", dialCode: "+971", pattern: /^\d{9}$/, placeholder: "501234567", format: "9 digits" },
    { code: "JP", name: "Japan", dialCode: "+81", pattern: /^\d{10}$/, placeholder: "9012345678", format: "10 digits" },
]

export function ServicesContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        country: "US",
        phone: "",
        message: ""
    })
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const selectedCountry = countries.find(c => c.code === formData.country) || countries[0]

    // Enhanced validation functions
    const validateName = (name: string): string | null => {
        if (!name || name.trim().length === 0) {
            return "Name is required"
        }
        if (name.trim().length < 2) {
            return "Name must be at least 2 characters"
        }
        if (name.trim().length > 100) {
            return "Name must be less than 100 characters"
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            return "Name can only contain letters, spaces, hyphens, and apostrophes"
        }
        return null
    }

    const validateEmail = (email: string): string | null => {
        if (!email || email.trim().length === 0) {
            return "Email is required"
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address"
        }
        if (email.length > 254) {
            return "Email address is too long"
        }
        return null
    }

    const validateCompany = (company: string): string | null => {
        if (company && company.trim().length > 0) {
            if (company.trim().length < 2) {
                return "Company name must be at least 2 characters"
            }
            if (company.trim().length > 150) {
                return "Company name must be less than 150 characters"
            }
            if (!/^[a-zA-Z0-9\s.,'&-]+$/.test(company)) {
                return "Company name contains invalid characters"
            }
        }
        return null
    }

    const validatePhone = (phone: string, country: typeof selectedCountry): string | null => {
        if (!phone || phone.trim().length === 0) {
            return "Phone number is required"
        }
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '')
        if (!country.pattern.test(digitsOnly)) {
            return `Phone number must be ${country.format} for ${country.name}`
        }
        return null
    }

    const validateMessage = (message: string): string | null => {
        if (!message || message.trim().length === 0) {
            return "Message is required"
        }
        if (message.trim().length < 20) {
            return "Please provide more details (minimum 20 characters)"
        }
        if (message.trim().length > 2000) {
            return "Message is too long (maximum 2000 characters)"
        }
        return null
    }

    const handleBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }))

        // Validate on blur
        let error: string | null = null
        switch (fieldName) {
            case 'name':
                error = validateName(formData.name)
                break
            case 'email':
                error = validateEmail(formData.email)
                break
            case 'company':
                error = validateCompany(formData.company)
                break
            case 'phone':
                error = validatePhone(formData.phone, selectedCountry)
                break
            case 'message':
                error = validateMessage(formData.message)
                break
        }

        if (error) {
            setValidationErrors(prev => ({ ...prev, [fieldName]: error }))
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            company: true,
            phone: true,
            message: true
        })

        // Clear previous errors
        setValidationErrors({})
        setErrorMessage("")

        // Validate all fields
        const errors: Record<string, string> = {}

        const nameError = validateName(formData.name)
        if (nameError) errors.name = nameError

        const emailError = validateEmail(formData.email)
        if (emailError) errors.email = emailError

        const companyError = validateCompany(formData.company)
        if (companyError) errors.company = companyError

        const phoneError = validatePhone(formData.phone, selectedCountry)
        if (phoneError) errors.phone = phoneError

        const messageError = validateMessage(formData.message)
        if (messageError) errors.message = messageError

        // If there are validation errors, show them and don't submit
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            return
        }

        setStatus("loading")

        try {
            const response = await fetch("/api/services-contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    phoneWithCode: `${selectedCountry.dialCode} ${formData.phone}`
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            setStatus("success")
            sendGAEvent({
                action: "services_form_submit",
                category: "Contact",
                label: "Services Page Form - AI Services",
            })

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({ name: "", email: "", company: "", country: "US", phone: "", message: "" })
                setTouched({})
                setStatus("idle")
            }, 3000)
        } catch (error) {
            setStatus("error")
            setErrorMessage("Failed to send your message. Please try again.")
            console.error("Form submission error:", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear validation error for this field when user starts typing (only if touched)
        if (touched[name] && validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-white via-red-50/40 to-orange-50/40 backdrop-blur-xl p-8 md:p-14 rounded-[3.5rem] border-2 border-white/60 shadow-[0_20px_80px_-15px_rgba(220,38,38,0.25)] overflow-hidden group">
                {/* Animated Premium Border */}
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100"></div>
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-1000 ease-out"></div>

                {/* Floating AI Icons */}
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Sparkles className="w-24 h-24 text-red-600 animate-pulse" />
                </div>
                <div className="absolute bottom-10 left-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Zap className="w-20 h-20 text-orange-600" />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2 rounded-full text-xs font-black mb-4 shadow-lg shadow-red-500/30 animate-pulse uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Transformation Starts Here</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                            Transform Your Vision Into{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500">
                                AI-Powered Reality
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 font-semibold max-w-3xl mx-auto leading-relaxed">
                            Ready to build your <span className="text-red-600 font-black">AI Workflow</span>, <span className="text-orange-600 font-black">AI Orchestration</span>, or launch an <span className="text-yellow-600 font-black">AI MVP/POC</span>?
                            <br className="hidden md:block" />
                            Let's discuss your AI ambitions and create a custom solution.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div className="group/field">
                                <label htmlFor="name" className="block text-sm font-black text-gray-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <User className="w-4 h-4 text-red-600" />
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    className={`w-full px-6 py-4 bg-white border-2 ${touched.name && validationErrors.name ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-300'} rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-500/30 outline-none transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal group-hover/field:border-red-400 shadow-sm`}
                                    placeholder="John Doe"
                                />
                                {touched.name && validationErrors.name && (
                                    <p className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">
                                        <span className="text-red-600">⚠</span> {validationErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="group/field">
                                <label htmlFor="email" className="block text-sm font-black text-gray-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <Mail className="w-4 h-4 text-red-600" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full px-6 py-4 bg-white border-2 ${touched.email && validationErrors.email ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-300'} rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-500/30 outline-none transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal group-hover/field:border-red-400 shadow-sm`}
                                    placeholder="john@company.com"
                                />
                                {touched.email && validationErrors.email && (
                                    <p className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">
                                        <span className="text-red-600">⚠</span> {validationErrors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Company Field */}
                            <div className="group/field">
                                <label htmlFor="company" className="block text-sm font-black text-gray-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <Building2 className="w-4 h-4 text-orange-600" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('company')}
                                    className={`w-full px-6 py-4 bg-white border-2 ${touched.company && validationErrors.company ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-300'} rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-500/30 outline-none transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal group-hover/field:border-orange-400 shadow-sm`}
                                    placeholder="Your Company or Startup"
                                />
                                {touched.company && validationErrors.company && (
                                    <p className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">
                                        <span className="text-red-600">⚠</span> {validationErrors.company}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number with Country Selector */}
                            <div className="group/field">
                                <label htmlFor="phone" className="block text-sm font-black text-gray-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <Phone className="w-4 h-4 text-orange-600" />
                                    Phone Number *
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        aria-label="Country code selector"
                                        className="px-4 py-4 bg-white border-2 border-gray-300 rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-500/30 outline-none transition-all duration-300 text-gray-900 font-bold group-hover/field:border-orange-400 cursor-pointer shadow-sm"
                                    >
                                        {countries.map(country => (
                                            <option key={country.code} value={country.code}>
                                                {country.dialCode}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('phone')}
                                        className={`flex-1 px-6 py-4 bg-white border-2 ${touched.phone && validationErrors.phone ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-300'} rounded-2xl focus:border-orange-600 focus:ring-4 focus:ring-orange-500/30 outline-none transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal group-hover/field:border-orange-400 shadow-sm`}
                                        placeholder={selectedCountry.placeholder}
                                    />
                                </div>
                                {touched.phone && validationErrors.phone && (
                                    <p className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">
                                        <span className="text-red-600">⚠</span> {validationErrors.phone}
                                    </p>
                                )}
                                {!validationErrors.phone && (
                                    <p className="mt-1.5 text-xs text-gray-500 font-medium">
                                        Format: {selectedCountry.format} ({selectedCountry.name})
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="group/field">
                            <label htmlFor="message" className="block text-sm font-black text-gray-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                <MessageSquare className="w-4 h-4 text-red-600" />
                                Your AI Project Details *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={() => handleBlur('message')}
                                className={`w-full px-6 py-4 bg-white border-2 ${touched.message && validationErrors.message ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-300'} rounded-2xl focus:border-red-600 focus:ring-4 focus:ring-red-500/30 outline-none transition-all duration-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal resize-none group-hover/field:border-red-400 shadow-sm`}
                                placeholder="Tell us about your AI workflow needs, orchestration requirements, MVP/POC goals, timeline, budget, and any specific challenges you're facing..."
                            />
                            {touched.message && validationErrors.message && (
                                <p className="mt-2 text-sm text-red-600 font-bold flex items-center gap-1">
                                    <span className="text-red-600">⚠</span> {validationErrors.message}
                                </p>
                            )}
                            {!validationErrors.message && (
                                <p className="mt-1.5 text-xs text-gray-500 font-medium">
                                    {formData.message.length}/2000 characters (minimum 20)
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col items-center gap-5 pt-4">
                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className="group/btn relative bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-size-200 bg-pos-0 hover:bg-pos-100 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-lg px-14 py-6 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_15px_50px_-10px_rgba(220,38,38,0.7)] hover:-translate-y-1 transition-all duration-500 border-b-4 border-red-800 hover:border-red-900 active:translate-y-0 active:border-b-2 disabled:border-gray-600 disabled:cursor-not-allowed flex items-center gap-3 min-w-[280px] justify-center uppercase tracking-wide"
                            >
                                {status === "loading" && (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Sending...
                                    </>
                                )}
                                {status === "success" && (
                                    <>
                                        <CheckCircle2 className="w-6 h-6" />
                                        Message Sent!
                                    </>
                                )}
                                {status === "idle" && (
                                    <>
                                        <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                        Start Your AI Journey
                                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                                {status === "error" && (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Try Again
                                    </>
                                )}
                            </button>

                            {/* Success Message */}
                            {status === "success" && (
                                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 animate-fade-in shadow-lg">
                                    <p className="text-green-700 font-black text-center text-lg flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-6 h-6" />
                                        Success! We'll respond within 24 hours with a custom AI strategy.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {status === "error" && (
                                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 animate-fade-in shadow-lg">
                                    <p className="text-red-700 font-black text-center text-lg">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}

                            {/* Privacy & Trust Indicators */}
                            <div className="flex flex-col items-center gap-3 max-w-2xl">
                                <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold">24hr Response</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold">Free Consultation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold">NDA Available</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center font-medium">
                                    🔒 Enterprise-grade security. Your data is encrypted and never shared with third parties.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
