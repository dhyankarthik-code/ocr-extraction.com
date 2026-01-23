"use client"

import { useMemo, useRef, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Globe, Loader2, Mail, MessageSquare, Phone, Search, Target, User, X } from "lucide-react"

import { COUNTRIES, COUNTRY_PHONE_CODES } from "@/lib/contact-countries"

export default function ToolsContactForm() {
    const [formData, setFormData] = useState({
        lookingFor: "",
        name: "",
        email: "",
        country: "",
        mobile: "",
        message: ""
    })
    const [countrySearch, setCountrySearch] = useState("")
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const { executeRecaptcha } = useGoogleReCaptcha()
    const countryInputRef = useRef<HTMLInputElement>(null)

    const filteredCountries = useMemo(() => {
        if (!countrySearch) return COUNTRIES
        return COUNTRIES.filter(country => country.toLowerCase().includes(countrySearch.toLowerCase()))
    }, [countrySearch])

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return email.length > 0 && email.length <= 254 && emailRegex.test(email)
    }

    const getPhoneConfig = () => {
        return COUNTRY_PHONE_CODES[formData.country] || { code: "", digits: 10 }
    }

    const hasInvalidNameChars = (value: string) => {
        return /[0-9]/.test(value)
    }

    const hasInvalidMobileChars = (value: string) => {
        return /[a-zA-Z]/.test(value)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value && !/^[a-zA-Z\s]*$/.test(value)) return

        setFormData(prev => ({ ...prev, name: value }))
        if (value.trim().length > 0 && value.trim().length < 2) {
            setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }))
        } else {
            setErrors(prev => ({ ...prev, name: "" }))
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, email: value }))
        if (value.includes("@") && !validateEmail(value)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }))
        } else {
            setErrors(prev => ({ ...prev, email: "" }))
        }
    }

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value && !/^\d*$/.test(value)) return

        const phoneConfig = getPhoneConfig()
        const maxDigits = phoneConfig.digits || 15
        if (value.length > maxDigits) return

        setFormData(prev => ({ ...prev, mobile: value }))
        setErrors(prev => ({ ...prev, mobile: "" }))
    }

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= 200) {
            setFormData(prev => ({ ...prev, message: value }))
            if (errors.message) setErrors(prev => ({ ...prev, message: "" }))
        }
    }

    const handleCountrySelect = (country: string) => {
        setFormData(prev => ({ ...prev, country: country, mobile: "" }))
        setCountrySearch("")
        setShowCountryDropdown(false)
        if (errors.country) setErrors(prev => ({ ...prev, country: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: { [key: string]: string } = {}
        const phoneConfig = getPhoneConfig()

        if (!formData.lookingFor) newErrors.lookingFor = "Please select what you're looking for"
        if (!formData.country) newErrors.country = "Please select a country"

        const cleanedMobile = formData.mobile.replace(/[^0-9]/g, "")
        if (!cleanedMobile) {
            newErrors.mobile = "Mobile number is required"
        } else if (hasInvalidMobileChars(formData.mobile)) {
            newErrors.mobile = "Mobile number should contain only digits"
        } else if (phoneConfig.code && cleanedMobile.length !== phoneConfig.digits) {
            newErrors.mobile = `Mobile number must be exactly ${phoneConfig.digits} digits for ${formData.country}`
        } else if (!phoneConfig.code && cleanedMobile.length < 7) {
            newErrors.mobile = "Please enter a valid mobile number"
        }

        if (formData.name) {
            const cleanedName = formData.name.replace(/[^a-zA-Z\s]/g, "").trim()
            if (cleanedName.length < 2) {
                newErrors.name = "Name must be at least 2 characters"
            } else if (hasInvalidNameChars(formData.name)) {
                newErrors.name = "Name should contain only letters"
            }
        }

        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setSubmitting(true)
        try {
            let token: string | null = null
            if (executeRecaptcha) {
                try {
                    token = await executeRecaptcha("contact_form")
                } catch {
                    // best-effort
                }
            }

            if (token) {
                const verifyRes = await fetch("/api/verify-recaptcha", {
                    method: "POST",
                    body: JSON.stringify({ token })
                })
                const verifyData = await verifyRes.json()
                if (!verifyData.success) throw new Error("Bot verification failed")
            }

            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lookingFor: formData.lookingFor,
                    name: formData.name || "Not provided",
                    email: formData.email || "Not provided",
                    country: formData.country,
                    mobile: phoneConfig.code ? `'${phoneConfig.code} ${cleanedMobile}` : `'${cleanedMobile}`,
                    message: formData.message || "Not provided"
                })
            })

            if (!response.ok) throw new Error("Failed to submit form")

            setSubmitted(true)
            setFormData({
                lookingFor: "",
                name: "",
                email: "",
                country: "",
                mobile: "",
                message: ""
            })
        } catch (error) {
            console.error("Tools contact form error:", error)
            alert("Failed to submit form. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const phoneConfig = getPhoneConfig()

    const orchestrationValue = "AI Orchestration"

    return (
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Reach Out To The <span className="text-red-600">Experts</span>
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto">
                        Looking For Workflow Automation, AI Orchestration Or Agentic AI Integration And Deployment
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
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            Choose From *
                                        </label>
                                        <Select
                                            value={formData.lookingFor}
                                            onValueChange={(value) => {
                                                setFormData(prev => ({ ...prev, lookingFor: value }))
                                                if (errors.lookingFor) setErrors(prev => ({ ...prev, lookingFor: "" }))
                                            }}
                                        >
                                            <SelectTrigger className={`w-full ${errors.lookingFor ? "border-red-500 ring-red-500" : "focus:ring-red-500"}`}>
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                <SelectItem value="Workflow Automation" className="focus:bg-red-50 focus:text-red-900 cursor-pointer">Workflow Automation</SelectItem>
                                                <SelectItem value={orchestrationValue} className="focus:bg-red-50 focus:text-red-900 cursor-pointer">{orchestrationValue}</SelectItem>
                                                <SelectItem value="Agentic AI Integration and Deployment" className="focus:bg-red-50 focus:text-red-900 cursor-pointer">Agentic AI Integration and Deployment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.lookingFor && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.lookingFor}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name
                                        </label>
                                        <Input
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            placeholder="Enter your full name (letters only)"
                                            className={`w-full transition-all ${errors.name
                                                ? "border-red-500 border-2 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                                : ""
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            placeholder="your.email@example.com"
                                            className={`w-full transition-all ${errors.email
                                                ? "border-red-500 border-2 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                                : ""
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Country *
                                        </label>
                                        <div className="relative">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    ref={countryInputRef}
                                                    type="text"
                                                    value={formData.country ? formData.country : countrySearch}
                                                    onChange={(e) => {
                                                        setCountrySearch(e.target.value)
                                                        if (formData.country) {
                                                            setFormData(prev => ({ ...prev, country: "" }))
                                                        }
                                                    }}
                                                    onFocus={() => setShowCountryDropdown(true)}
                                                    placeholder="Search and select your country..."
                                                    className={`w-full pl-10 pr-8 transition-all ${errors.country
                                                        ? "border-red-500 border-2 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                                        : ""
                                                        }`}
                                                />
                                                {formData.country && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, country: "", mobile: "" }))
                                                            setCountrySearch("")
                                                            countryInputRef.current?.focus()
                                                        }}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {showCountryDropdown && !formData.country && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {filteredCountries.length === 0 ? (
                                                        <div className="px-4 py-3 text-gray-500 text-sm">No country found</div>
                                                    ) : (
                                                        filteredCountries.map((country) => (
                                                            <button
                                                                key={country}
                                                                type="button"
                                                                onClick={() => handleCountrySelect(country)}
                                                                className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center justify-between transition-colors"
                                                            >
                                                                <span>{country}</span>
                                                                {COUNTRY_PHONE_CODES[country] && (
                                                                    <span className="text-xs text-gray-500">{COUNTRY_PHONE_CODES[country].code}</span>
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.country}
                                            </p>
                                        )}

                                        {showCountryDropdown && !formData.country && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowCountryDropdown(false)}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Mobile *
                                        </label>
                                        <div className="flex gap-2">
                                            {phoneConfig.code && (
                                                <div className="flex items-center px-3 border rounded-md bg-gray-50 text-sm font-medium text-gray-700 min-w-[60px] justify-center">
                                                    {phoneConfig.code}
                                                </div>
                                            )}
                                            <Input
                                                name="mobile"
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={handleMobileChange}
                                                placeholder={phoneConfig.code ? `Enter ${phoneConfig.digits} digits` : "Enter mobile number"}
                                                className={`flex-1 transition-all ${errors.mobile
                                                    ? "border-red-500 border-2 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                                    : ""
                                                    }`}
                                            />
                                        </div>
                                        {errors.mobile && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.mobile}
                                            </p>
                                        )}
                                        {formData.country && phoneConfig.code && !errors.mobile && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.country} requires exactly {phoneConfig.digits} digits
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Give us a hint about your requirement
                                        </label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleMessageChange}
                                            placeholder="How can we help you?"
                                            className={`w-full min-h-[120px] transition-all ${errors.message
                                                ? "border-red-500 border-2 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                                : ""
                                                }`}
                                            maxLength={200}
                                        />
                                        <div className="text-xs text-gray-500 text-right mt-1">
                                            {formData.message.length}/200
                                        </div>
                                        {errors.message && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <X className="w-3 h-3" />
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={submitting}
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
            </div>
        </div>
    )
}
