"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import AuthModal from "@/components/auth-modal"
import { useState } from "react"


export default function TermsPage() {
    const { session, logout } = useSession()
    const [showAuthModal, setShowAuthModal] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar
                session={session}
                onLogout={logout}
                onLoginClick={() => setShowAuthModal(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 pt-24 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

                    <div className="prose max-w-none text-gray-700 space-y-6">
                        <p>
                            Welcome to www.ocr-extraction.com (from this point onwards "the Service.") The Service offers its users solely a web and mobile browser based application which allows users to convert documents and/or images through online software.
                            The current Terms and Conditions stipulate the legally binding conditions between Yourself (the "User") and the websites, services, and applications of www.ocr-extraction.com (from this point forward, www.ocr-extraction.com).
                            www.ocr-extraction.com brands are property of www.ocr-extraction.com
                            The text in the summary boxes aim to give a plain summary of our Terms and Conditions. Please make sure to read our Terms and Conditions carefully, because the summary doesn't cover all the important details.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">1. Use of Our Service</h2>

                        <h3 className="font-bold text-gray-800 mt-4">1.1 General</h3>
                        <p>
                            This page explains the terms by which you may use our online services, website, and software provided on or in connection with our services. By accessing or using www.ocr-extraction.com you agree to be conformant to this Terms and Conditions agreement ("Agreement") whether or not you are registered on our services. In the case of disagreement with all or part of these Terms and Conditions, you should abstain from using the Service.
                        </p>
                        <p className="mt-2">
                            By means of acceptance of the current Terms and Conditions, the User agrees to comply with the following service rules:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>To have read and understood what is explained here.</li>
                            <li>To have read, understood and agreed to the privacy policy in www.ocr-extraction.com</li>
                            <li>To have assumed all of the obligations that are stated here.</li>
                            <li>To use the service solely for purposes permitted by law and which do not violate the rights of a third-party.</li>
                            <li>To not use this website for any unlawful activity. You are prohibited to break any term and condition to not generate content dedicated to creating SPAM or which could provide instructions about how to engage in illegal activities.</li>
                            <li>To not gather, handle, or store personal information about other Users or third-parties without complying with the current legislation regarding the protection of information.</li>
                        </ul>
                        <p className="mt-2">
                            If the regulations in the Terms and Conditions are in contradiction with the privacy policy, Terms and Conditions will prevail.
                            Failure to comply with these obligations may result in the cancellation of the Contract, as is established in Clause 9.
                        </p>
                        <p className="mt-2 font-medium">
                            We are giving this service for free. Please do not try to hack our servers, send spam or break any other rules, regulations or laws or do any malicious activities. These are the things you just can't do.
                        </p>

                        <h3 className="font-bold text-gray-800 mt-6">1.2 Service Rules</h3>
                        <p>
                            Your use of the Service and www.ocr-extraction.com Desktop is subject to this Reasonable Use Policy, which has been created to ensure that our service is fair for both users and developers.
                        </p>
                        <p className="mt-2">The following is not permitted in connection with www.ocr-extraction.com Services and Desktop App:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Using any automated or non-automated scraping process (including bots, scrapers, and spiders) in conjunction with www.ocr-extraction.com;</li>
                            <li>Converting or otherwise editing documents with www.ocr-extraction.com at a rate that exceeds what a human can reasonably do by using manual means and a conventional device;</li>
                            <li>Providing your password to any other person or using any other persons username and password to access www.ocr-extraction.com ;</li>
                            <li>Abusing www.ocr-extraction.com in excess of what is reasonably needed or required for legitimate business or personal purposes. www.ocr-extraction.com may investigate any account that registers over 900 tasks in a month to determine compliance with this requirement.</li>
                        </ul>
                        <p className="mt-2">
                            If www.ocr-extraction.com determines that you are in breach of this policy, we may temporarily or permanently suspend or terminate your account or your subscription to the Service.
                        </p>

                        <h3 className="font-bold text-gray-800 mt-6">1.3 Cookies</h3>
                        <p>
                            www.ocr-extraction.com websites are a Software as a Service (SaaS), and use cookies, which are essential for the operations of the service and for its correct functionality. A minimal number of other non-essential cookies will be placed under your consent. In case you do not accept, manage or reject the use of cookies, consent will be granted by using our software; yet you can give or withdraw consent to these from our cookie policy page anytime.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">2. Accounts</h2>
                        <h3 className="font-bold text-gray-800 mt-4">2.1 General</h3>
                        <p>
                            www.ocr-extraction.com accounts give the user access to the services and functionality that we may establish and maintain from time to time and in our sole discretion. We may maintain different types of accounts for different types of Users. The different account types allow the user to work within different file size and file number limitations. Our Service users' types are as follows:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Not registered</li>
                            <li>Registered</li>
                            <li>Premium</li>
                        </ul>
                        <p className="mt-2">
                            User is solely responsible for the activity that occurs on his account and must keep his account password secure.
                            www.ocr-extraction.com owns the right to totally or partially stop providing any of its Services whenever it considers it appropriate and would only give prior notification to Premium Users (in the future, right now our service is free). In the previous operations, the corresponding taxes will be applied to the Users, assuming payment whomever, in conformity with the current regulation, is considered a passive subject of these operations.
                        </p>
                        <p className="mt-2 font-medium">
                            You are responsible for whatever is done on your Account, so make sure you have a strong password and don't let anyone else use it.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">3. User Content</h2>
                        <h3 className="font-bold text-gray-800 mt-4">3.1 General</h3>
                        <p>
                            www.ocr-extraction.com does not analyse the content of files whilst processing them and only Users will have access to the edited files once www.ocr-extraction.com has processed them. If chosen by the user, this link can be shared with someone else. www.ocr-extraction.com will automatically delete processed files from their servers after a defined period of time depending on the tool used:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Users bear the sole responsibility for the usage of their own files.</li>
                        </ul>
                        <p className="mt-2">
                            www.ocr-extraction.com is limited to offer users access to their own processed files. These files will only remain stored on our servers during the time that the download link is available.
                        </p>

                        <h3 className="font-bold text-gray-800 mt-6">3.2 Content processing</h3>
                        <p>
                            www.ocr-extraction.com provides all the necessary information to assist the user in processing files, and only the User is responsible for contacting www.ocr-extraction.com in case of technical problems. www.ocr-extraction.com is highly concerned about file security, thus its servers have limited access, are using third party servers and we are not liable for any issue arising from third-party servers.
                        </p>

                        <h3 className="font-bold text-gray-800 mt-6">3.3 Responsibility for the content of the files</h3>
                        <p>
                            www.ocr-extraction.com does not analyse the content of processed files and thus is not responsible for its tools misuse nor copyright infringements which may affect third- parties. The User will be responsible before www.ocr-extraction.com of any penalty, sanction, and/or fine which the courts or other competent authorities could issue against www.ocr-extraction.com for non-compliance with any part of this Agreement.
                        </p>
                        <p className="mt-2">
                            In particular, users agree to use the Service in conformity with current laws and conformant to the rules aforementioned in section 1.1.
                        </p>
                        <p className="mt-2 font-medium">
                            We don't access nor analyse your content. Before any technical issue, it's your responsibility to contact us. We are not responsible for the content of your files. You are the only person responsible for whatever they may contain.
                        </p>

                        <h3 className="font-bold text-gray-800 mt-6">4.1 Billing Policies</h3>
                        <p>
                            The file conversion is a free service for a limited size in size - 10 MB or number of files whichever is higher. In the future, pricing may be applied and a policy for pricing will be included in this section.
                            Unless otherwise stated, your subscription will continue indefinitely until cancelled by you. Refunds won't have a retroactive effect. You are responsible to pay your taxes associated with our services.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">5. No warranty</h2>
                        <h3 className="font-bold text-gray-800 mt-4">5.1 General</h3>
                        <p>
                            Use of the service is at your own risk. To the maximum extent permitted by applicable law, the service is provided without warranties of any kind. www.ocr-extraction.com does not warrant that the service will meet your requirements; that the service will be available at any particular time or location, uninterrupted or secure; that any defects or errors will be corrected; or that the service is free of viruses or other harmful components. Any content downloaded or otherwise obtained through the use of the service is downloaded at your own risk and you will be solely responsible for any damage to your computer system or mobile device or loss of data that results from such download or your use of the service. www.ocr-extraction.com does not warrant, endorse, guarantee, or assume responsibility for any product or service advertised or offered by a third party through the www.ocr-extraction.com service or any hyperlinked website or service, and www.ocr-extraction.com will not be a party to monitor any transaction between you and third-party providers.
                        </p>
                        <p className="mt-2 font-medium">
                            You use www.ocr-extraction.com at your own risk. We provide no warranty regarding the Service.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">6. Limitation of liability</h2>
                        <h3 className="font-bold text-gray-800 mt-4">6.1 General</h3>
                        <p>
                            To the maximum extent permitted by applicable law, in no event shall www.ocr-extraction.com or its employees be liable for any direct, indirect, punitive, incidental, special, consequential or exemplary damages, including without limitation damages for use, data or other intangible losses, arising from or relating to any breach of this agreement. Under no circumstances will www.ocr-extraction.com be responsible for any damage, loss or injury resulting from hacking, tampering or other unauthorized access or use of the service or your account or the information contained therein
                        </p>
                        <p className="mt-2 font-medium">
                            We expressly disclaim liability for consequential damages resulting from using or misusing our services.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">7. License of limited use</h2>
                        <h3 className="font-bold text-gray-800 mt-4">7.1 General</h3>
                        <p>
                            www.ocr-extraction.com is the exclusive owner of all of the rights to the web application which allows the functionalities offered online and, in particular, the right to total or partial reproduction, by any means, and in any form; the translation, adaptation, arrangement, or any other transformation of the program and the reproduction of the results of such acts; the distribution in any of the forms admitted by law; the right to publish through all types of media: analog and digital, online and offline; and the right to the program's use. The program's license of use for users does not refer to the Intellectual Property rights of the Service, the users remain solely authorized to use Service software. For any distinct uses, www.ocr-extraction.com must authorize their exploitation, as in ceding those rights to third-parties. Therefore, the execution, reproduction, exploitation, alteration, distribution, or public communication of the totality of the copyright property of www.ocr-extraction.com remain prohibited for uses distinct from those authorized by the current Agreement. In particular, it is not permitted to: make copies of the program, translate its source code, transform it, or distribute it without the precise authorization of www.ocr-extraction.com. The breach of these obligations for the Users may lead to, at the discretion of www.ocr-extraction.com, the relevant claims established by the relevant copyright regulations, the suspension of Service, or the termination of the Contract, as established in Clause 9.
                        </p>
                        <p className="mt-2 font-medium">
                            We own all of the rights to the website and mobile app. We are the only authorized party to exploit our services since we have put in lot of efforts.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">8. Intellectual and industrial property rights</h2>
                        <h3 className="font-bold text-gray-800 mt-4">8.1 General</h3>
                        <p>
                            The contents of this site, including the contents, brands, logos, drawings, texts, images, databases, codes, and any other material belong to www.ocr-extraction.com or to third- parties who have authorized their use. In a general manner, their utilization with commercial ends, their public communication or distribution, or any other form of exploitation by any process, such as transformation or alteration, all remains prohibited. We expressly disclaim liability for consequential damages resulting from using or misusing our services.
                        </p>
                        <p className="mt-2">Please do not infringe in our brand identity.</p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">9. Termination</h2>
                        <h3 className="font-bold text-gray-800 mt-4">9.1 General</h3>
                        <p>
                            www.ocr-extraction.com will be capable of unilaterally and, at any point, resolving the current Contract in the following cases. a) In the event that the User breaches any of the obligations and guarantees established in this Agreement. b) If intellectual property rights or any other third-party rights are infringed upon. c) When the service becomes payable in the future and in that scenario, If User fails to make the timely payment of fees for the Software or the Services. d) If we are required to do so by law (for example, if providing software to a specific region becomes unlawful) e) If we choose to discontinue the Services or Software, in whole or in part, (such as if it becomes impractical for us to provide Service or our website becomes censored in a region).
                        </p>
                        <p className="mt-2">
                            The resolution of the Contract will not affect the ability of www.ocr-extraction.com to claim the corresponding damages and losses. Users will be qualified to cancel their account, at any point, from their Account page or through the contact form available online.
                        </p>
                        <p className="mt-2 font-medium">
                            In some scenarios, we might stop offering our services to you.
                        </p>

                        <h2 className="text-xl font-bold text-gray-900 mt-8">10. Miscellaneous</h2>
                        <h3 className="font-bold text-gray-800 mt-4">10.1 General</h3>
                        <p>
                            The User will not be able to cede, subrogate, or transmit the rights contained in the current Contract to third parties without the previous written consent of www.ocr-extraction.com. Same as the previous point. Please do not copy our brand identity.
                        </p>
                        <p className="mt-2">
                            These Terms and Conditions are the only agreement between both parties (yourself and us), and will be the only one taken into consideration. www.ocr-extraction.com reserves the right to change or modify this terms and conditions or any other document available in it's website based on it's own discretion as and when required without any need to notify and the new revised terms and conditions will come into force.
                        </p>

                        <p className="font-bold text-gray-900 mt-8">
                            Jurisdiction:
                            <br />
                            India, Chennai.
                        </p>
                    </div>
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
