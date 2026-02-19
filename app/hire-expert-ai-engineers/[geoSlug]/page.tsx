import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ArrowRight, Clock, DollarSign, Globe, ShieldCheck } from 'lucide-react'
import { getCountryData, allCountrySlugs } from '@/lib/geo-pages-data'

interface PageProps {
    params: Promise<{ geoSlug: string }>
}

// Returns full slugs like 'hire-ai-engineer-in-saudi-arabia'
export async function generateStaticParams() {
    return allCountrySlugs.map((slug) => ({ geoSlug: `hire-ai-engineer-in-${slug}` }))
}

function extractCountrySlug(geoSlug: string): string {
    return geoSlug.replace(/^hire-ai-engineer-in-/, '')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { geoSlug } = await params
    const data = getCountryData(extractCountrySlug(geoSlug))
    if (!data) return { title: 'Not Found' }

    return {
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.keywords,
        alternates: { canonical: data.canonicalUrl },
        openGraph: {
            title: data.metaTitle,
            description: data.metaDescription,
            url: data.canonicalUrl,
            type: 'website',
            siteName: 'InfyGalaxy',
            images: [{ url: data.ogImage, width: 1200, height: 630, alt: `Hire AI Engineers in ${data.country}` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.metaTitle,
            description: data.metaDescription,
        },
        robots: { index: true, follow: true },
    }
}

export default async function GeoAIEngineerPage({ params }: PageProps) {
    const { geoSlug } = await params
    const countrySlug = extractCountrySlug(geoSlug)
    const data = getCountryData(countrySlug)
    if (!data) notFound()

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ocr-extraction.com' },
            { '@type': 'ListItem', position: 2, name: 'Hire Expert AI Engineers', item: 'https://www.ocr-extraction.com/hire-expert-ai-engineers' },
            { '@type': 'ListItem', position: 3, name: `Hire AI Engineers in ${data.country}`, item: data.canonicalUrl },
        ],
    }

    const serviceLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `AI Engineer Staffing — ${data.country}`,
        provider: { '@type': 'Organization', name: 'InfyGalaxy', url: 'https://www.ocr-extraction.com' },
        areaServed: { '@type': 'Country', name: data.country },
        description: data.metaDescription,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: data.hourlyRate,
            priceSpecification: { '@type': 'UnitPriceSpecification', priceCurrency: 'USD', unitText: 'HOUR' },
        },
    }

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
    }

    return (
        <main className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

            {/* HERO */}
            <section className="relative pt-16 pb-24 bg-white border-b border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 via-white to-blue-50/30 -z-10" />
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-red-100/20 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/hire-expert-ai-engineers" className="hover:text-gray-600 transition-colors">Hire AI Engineers</Link>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">{data.country}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest mb-6 border border-red-100">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                {data.flag} {data.region} · Deploying in 48 hrs
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                                {data.heroTitle}
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                {data.heroSubtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-red-600 rounded-full hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Hire AI Engineers Now <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact?subject=Consultation"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
                                >
                                    Schedule a Call
                                </Link>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gray-900 rounded-3xl p-8 text-white">
                            <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wider mb-6 text-sm">
                                {data.country} AI Market Snapshot
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.stats.map((stat) => (
                                    <div key={stat.label} className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="text-2xl font-extrabold text-white mb-1">{stat.value}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Our Rate</span>
                                    <span className="text-green-400 font-bold text-lg">{data.hourlyRate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MARKET CONTEXT */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Market Intelligence</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                                Why {data.country} is Accelerating AI Investment
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {data.marketContext}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                {data.whyRemote}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Cost Comparison */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-red-600" /> Cost Comparison
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                                        <span className="text-sm text-gray-600">Local Onsite Rate</span>
                                        <span className="font-bold text-gray-900 text-sm">{data.salaryLocal}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                                        <span className="text-sm text-gray-600">InfyGalaxy Remote Rate</span>
                                        <span className="font-bold text-green-700 text-sm">{data.salaryRemote}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                        <span className="text-sm text-gray-600">Hourly Rate</span>
                                        <span className="font-bold text-blue-700">{data.hourlyRate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timezone */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" /> Timezone & Collaboration
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /><span>{data.timezone}</span></div>
                                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /><span>{data.timezoneOverlap}</span></div>
                                </div>
                            </div>

                            {/* Compliance */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-purple-600" /> Compliance & Data Protection
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{data.complianceNote}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INDUSTRIES */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">Industry Focus</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Industries We Serve in {data.country}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {data.localIndustries.map((industry) => (
                            <div key={industry} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all group">
                                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">{industry}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">FAQ</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                            Hiring AI Engineers in {data.country} — Common Questions
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {data.faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">{faq.q}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERNAL LINKS — Hub & Sister Pages */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-10">
                        <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Explore More Markets</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {allCountrySlugs
                            .filter((s) => s !== countrySlug)
                            .map((s) => {
                                const sibling = getCountryData(s)
                                if (!sibling) return null
                                return (
                                    <Link
                                        key={s}
                                        href={`/hire-expert-ai-engineers/hire-ai-engineer-in-${s}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all"
                                    >
                                        {sibling.flag} {sibling.country}
                                    </Link>
                                )
                            })}
                        <Link
                            href="/hire-expert-ai-engineers"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all"
                        >
                            <Globe className="w-4 h-4" /> All Markets
                        </Link>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/50 text-red-300 text-xs font-bold uppercase tracking-widest mb-8 border border-red-800">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Ready to Deploy
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Build Your AI Team in {data.country} <br className="hidden md:block" />
                        <span className="text-red-400">Starting Today.</span>
                    </h2>
                    <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10">
                        Skip the 3-month hiring cycle. Get pre-vetted AI engineers for {data.country} projects deployed in 48 hours at {data.hourlyRate}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-bold text-white bg-red-600 rounded-full hover:bg-red-500 hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Hire AI Engineers Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/blog/cost-to-hire-ai-engineers-in-2026-usa-vs-india-vs-europe-vs-dubai"
                            className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-gray-300 border border-gray-700 rounded-full hover:border-gray-500 hover:text-white transition-all"
                        >
                            Compare Global AI Costs →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
