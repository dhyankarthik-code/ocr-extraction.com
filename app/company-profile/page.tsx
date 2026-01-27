import CompanyProfilePageClient from "./client"

export const metadata = {
    title: 'Company Profile - Infy Galaxy | AI & Automation Experts',
    description: 'Infy Galaxy is a global technology company specializing in AI, OCR, and intelligent automation. Read our company profile and vision.',
    alternates: {
        canonical: '/company-profile',
    },
}

export default function CompanyProfilePage() {
    return <CompanyProfilePageClient />
}
