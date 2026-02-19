// lib/geo-pages-data.ts
// Unique content per country — prevents thin/duplicate content penalties.
// Each key maps to a URL slug under /hire-ai-engineer-[slug]
// NOTE: No specific client or company names are mentioned. Industry verticals only.

export interface CountryPageData {
    slug: string
    country: string
    flag: string
    region: string
    heroTitle: string
    heroSubtitle: string
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl: string
    ogImage: string
    marketContext: string
    whyRemote: string
    localIndustries: string[]
    salaryLocal: string
    salaryRemote: string
    hourlyRate: string
    timezone: string
    timezoneOverlap: string
    complianceNote: string
    faqs: { q: string; a: string }[]
    stats: { label: string; value: string }[]
}

const BASE = 'https://www.ocr-extraction.com'

export const geoPages: Record<string, CountryPageData> = {
    'saudi-arabia': {
        slug: 'saudi-arabia',
        country: 'Saudi Arabia',
        flag: '🇸🇦',
        region: 'Middle East',
        heroTitle: 'Hire AI Engineers in Saudi Arabia',
        heroSubtitle: 'Power Saudi Vision 2031 with top 1% AI talent. Deploy vetted AI engineers to Riyadh, Jeddah, and NEOM projects within 48 hours.',
        metaTitle: 'Hire AI Engineers in Saudi Arabia | Vision 2031 AI Talent | InfyGalaxy',
        metaDescription: 'Hire AI engineers in Saudi Arabia for Vision 2031 tech projects. Pre-vetted ML engineers, GenAI developers & data scientists for Riyadh & Jeddah at $30–60/hr.',
        keywords: ['hire ai engineer saudi arabia', 'ai engineer riyadh', 'hire ai developer ksa', 'vision 2031 ai talent', 'ai engineer saudi arabia cost', 'hire ml engineer saudi arabia', 'ai staffing saudi arabia'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-saudi-arabia`,
        ogImage: `${BASE}/images/geo/saudi-arabia-ai.jpg`,
        marketContext: 'Saudi Arabia\'s Vision 2031 has committed over $6.4 billion to AI and digital transformation. NEOM, the $500B mega-city project, is one of the largest AI infrastructure initiatives in human history. Across oil & gas, telecoms, and financial services, Saudi enterprises are now building dedicated AI teams at an unprecedented pace.',
        whyRemote: 'Onsite AI engineers in Riyadh command SAR 25,000–45,000/month plus Iqama sponsorship costs. By deploying a remote AI team through InfyGalaxy, you get the same calibre of talent at 60% lower cost, with zero visa overhead and zero recruitment lag.',
        localIndustries: ['Oil & Gas & Petrochemicals', 'Telecommunications & ISPs', 'Banking & Financial Services', 'Real Estate & Smart City Development', 'Government & Healthcare Digital Transformation', 'Retail & E-commerce'],
        salaryLocal: 'SAR 25,000 – 45,000/month (~$80k–$145k/year)',
        salaryRemote: '$40,000 – $70,000/year',
        hourlyRate: '$30 – $60/hr',
        timezone: 'AST (UTC+3)',
        timezoneOverlap: '4–6 hrs overlap with India | 0–2 hrs overlap with UK',
        complianceNote: 'Saudi AI projects may require CITC data localisation compliance. Our engineers are briefed on NCA (National Cybersecurity Authority) standards and Vision 2031 data governance frameworks.',
        stats: [
            { label: 'Vision 2031 AI Budget', value: '$6.4B+' },
            { label: 'NEOM Project Value', value: '$500B' },
            { label: 'Avg Onsite AI Salary', value: '$120k/yr' },
            { label: 'Remote Saving', value: '60%' },
        ],
        faqs: [
            { q: 'Can you provide AI engineers for Vision 2031 projects in Saudi Arabia?', a: 'Yes. We deploy AI engineers for government-backed and private sector Vision 2031 projects. Our engineers have experience in Arabic NLP, smart city data platforms, and oil & gas predictive analytics relevant to the KSA market.' },
            { q: 'Do your AI engineers comply with CITC and NCA regulations?', a: 'Yes. We brief all engineers on Saudi Arabia\'s CITC data residency requirements and NCA cybersecurity standards. We can also help structure data architecture to meet Saudi data localisation rules.' },
            { q: 'What is the cost to hire an AI engineer for a Saudi Arabia project?', a: 'Remote AI engineers for Saudi projects range from $30–60/hr depending on seniority and specialisation. This compares to SAR 25,000–45,000/month for local onsite hires, representing a saving of 50–65%.' },
            { q: 'How quickly can you deploy an AI team to a KSA project?', a: 'We can deploy a pre-vetted AI engineer or team within 48 hours of requirement sign-off. For larger team builds (5+), expect 1–2 weeks for full onboarding.' },
        ],
    },

    'uae': {
        slug: 'uae',
        country: 'UAE (Dubai & Abu Dhabi)',
        flag: '🇦🇪',
        region: 'Middle East',
        heroTitle: 'Hire AI Engineers in UAE',
        heroSubtitle: 'Build your AI team for Dubai & Abu Dhabi at 60% less than local rates. Pre-vetted engineers available in 48 hours.',
        metaTitle: 'Hire AI Engineers in UAE | Dubai AI Talent | InfyGalaxy',
        metaDescription: 'Hire AI engineers in UAE for Dubai and Abu Dhabi projects. Top GenAI, ML & MLOps engineers for UAE National AI Strategy 2031 at $30–60/hr. Deploy in 48 hrs.',
        keywords: ['hire ai engineer uae', 'ai engineer dubai', 'hire ai developer abu dhabi', 'uae ai strategy talent', 'ai engineer dubai cost', 'hire ml engineer uae', 'ai staffing dubai'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-uae`,
        ogImage: `${BASE}/images/geo/uae-ai.jpg`,
        marketContext: 'The UAE is the Arab world\'s most aggressive AI investor, with the UAE National AI Strategy 2031 targeting a 13.6% GDP contribution from AI. Dubai\'s DIFC and Abu Dhabi\'s ADGM are now global fintech and AI hubs. The UAE\'s Ministry of AI — the world\'s first — signals the government\'s unmatched commitment to the technology.',
        whyRemote: 'Local AI engineers in Dubai DIFC command AED 30,000–60,000/month tax-free, plus housing and visa costs. Remote AI teams through InfyGalaxy deliver the same execution quality without the overhead — and are already experienced working UAE business hours (Gulf Standard Time, UTC+4).',
        localIndustries: ['Fintech & Islamic Finance', 'Real Estate & PropTech', 'Logistics & Supply Chain', 'Healthcare & Digital Health', 'E-commerce & Retail', 'Smart Government & GovTech'],
        salaryLocal: 'AED 30,000 – 60,000/month (~$100k–$200k/year, tax-free)',
        salaryRemote: '$40,000 – $70,000/year',
        hourlyRate: '$30 – $60/hr',
        timezone: 'GST (UTC+4)',
        timezoneOverlap: '1.5 hrs behind India | 4 hrs ahead of UK',
        complianceNote: 'UAE AI projects in DIFC and ADGM fall under distinct regulatory frameworks. Our engineers are familiar with UAE PDPL (Personal Data Protection Law) enacted 2022 and DIFC Data Protection Law 2020.',
        stats: [
            { label: 'UAE AI GDP Target', value: '13.6%' },
            { label: 'Avg Onsite AI Salary', value: '$150k/yr' },
            { label: 'Remote Saving', value: '60%' },
            { label: 'Deploy Time', value: '48 hrs' },
        ],
        faqs: [
            { q: 'Can you provide AI engineers for UAE government and DIFC projects?', a: 'Yes. We deploy engineers for UAE fintech, PropTech, and government AI initiatives. Our teams are experienced in UAE PDPL compliance and can work within DIFC/ADGM regulatory frameworks.' },
            { q: 'What AI specialisations are available for the UAE market?', a: 'We provide Arabic NLP engineers, AI for Islamic Finance (Sharia-compliant recommendation systems), Smart City AI (traffic, energy management), and Vision AI for logistics — all high-demand specialisations in the UAE.' },
            { q: 'Do you support UAE National AI Strategy projects?', a: 'Yes. We have experience supporting initiatives aligned with UAE\'s national AI agenda, including smart government, predictive healthcare, and advanced logistics AI systems.' },
        ],
    },

    'usa': {
        slug: 'usa',
        country: 'United States',
        flag: '🇺🇸',
        region: 'Americas',
        heroTitle: 'Hire AI Engineers in the USA',
        heroSubtitle: 'Cut your US AI hiring costs by 60%. Access top 1% AI engineers with Silicon Valley-grade skills — without Silicon Valley prices.',
        metaTitle: 'Hire AI Engineers in USA | Save 60% on US AI Talent Costs | InfyGalaxy',
        metaDescription: 'Hire AI engineers for US companies at $40–80/hr vs $150–300/hr local rates. GenAI, MLOps & LLM engineers for startups and enterprises. Deploy in 48 hours.',
        keywords: ['hire ai engineer usa', 'hire ai engineer united states', 'ai engineer cost usa', 'outsource ai development usa', 'hire ml engineer us startup', 'ai staffing usa', 'hire generative ai engineer us company'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-usa`,
        ogImage: `${BASE}/images/geo/usa-ai.jpg`,
        marketContext: 'The US remains the world\'s largest market for AI engineers, but also the most expensive. With average Senior AI Engineer salaries at $220,000–$350,000 in San Francisco — plus 30% benefits overhead — US companies are aggressively adopting global remote AI teams to maintain velocity without burning runway.',
        whyRemote: 'A US-based AI team of 5 costs ~$1.5M/year all-in. The same calibre remote team through InfyGalaxy costs $300k–400k/year — freeing $1M+ in capital to ship more product. Fast-growth startups across the US now rely on offshore AI teams as a core cost lever.',
        localIndustries: ['SaaS & Cloud Platforms', 'Fintech & Banking', 'Healthcare AI & MedTech', 'E-commerce & Retail Technology', 'Defence & Government AI', 'Media & Entertainment AI'],
        salaryLocal: '$220,000 – $350,000/year + equity + benefits',
        salaryRemote: '$60,000 – $100,000/year',
        hourlyRate: '$40 – $80/hr',
        timezone: 'EST/PST (UTC-5 to UTC-8)',
        timezoneOverlap: 'Engineers on overlap shifts provide 4–6 hrs real-time collaboration daily',
        complianceNote: 'US projects with HIPAA, SOC2, or FedRAMP requirements are handled by engineers with relevant compliance training. We support NDAs and IP-transfer agreements under US law.',
        stats: [
            { label: 'Avg US AI Engineer Cost', value: '$280k/yr' },
            { label: 'Remote Cost (ours)', value: '$70k/yr' },
            { label: 'Saving per Engineer', value: '$210k+' },
            { label: 'Time-to-Hire (local)', value: '3–4 months' },
        ],
        faqs: [
            { q: 'Can you provide AI engineers who work US business hours?', a: 'Yes. We maintain engineers on EST, CST, and PST overlap shifts, ensuring 4–6 hours of real-time collaboration daily with your US team. For critical sprints, we also offer 24-hour follow-the-sun models.' },
            { q: 'Do your engineers sign US-compliant NDAs and IP agreements?', a: 'Absolutely. All engagements include mutual NDAs, IP assignment agreements, and data protection clauses enforceable under US law. We routinely work with US legal counsel to customise agreements.' },
            { q: 'What is the minimum team size for US companies?', a: 'We work with everything from a single AI engineer augmenting your team to a full dedicated AI pod (engineer + data scientist + MLOps). There is no minimum — we scale to your needs.' },
        ],
    },

    'united-kingdom': {
        slug: 'united-kingdom',
        country: 'United Kingdom',
        flag: '🇬🇧',
        region: 'Europe',
        heroTitle: 'Hire AI Engineers in the UK',
        heroSubtitle: 'Supercharge your London, Manchester, or Edinburgh AI projects with world-class remote talent at 55% below UK market rates.',
        metaTitle: 'Hire AI Engineers in the UK | UK AI Talent at 55% Lower Cost | InfyGalaxy',
        metaDescription: 'Hire AI engineers in the UK at $40–70/hr vs £80–150/hr local. GenAI, ML & NLP engineers for London & Manchester fintechs, health-tech and SaaS. Deploy in 48 hrs.',
        keywords: ['hire ai engineer uk', 'hire ai engineer london', 'ai engineer cost uk', 'ai staffing london', 'hire ml engineer uk', 'hire ai developer manchester', 'generative ai engineer uk'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-the-uk`,
        ogImage: `${BASE}/images/geo/uk-ai.jpg`,
        marketContext: 'The UK\'s AI sector is Europe\'s largest, with London hosting 40% of Europe\'s top AI companies. The UK government\'s £2.5 billion AI Safety and compute investment signals aggressive national commitment. The UK AI research ecosystem is globally recognised — but onsite talent costs have reached London financial services norms.',
        whyRemote: 'A Senior AI Engineer in London commands £90,000–£140,000/year, plus employer NI, pension auto-enrolment, and London Living Wage overhead. Remote InfyGalaxy teams provide the same depth of skill at 55% lower total cost — with no IR35 ambiguity.',
        localIndustries: ['Fintech & Digital Banking', 'Health Tech & NHS Digital Programmes', 'Legal Tech & RegTech', 'Retail & E-commerce AI', 'Media, AdTech & Publishing', 'Defence & GovTech'],
        salaryLocal: '£90,000 – £140,000/year (~$115k–$180k)',
        salaryRemote: '$50,000 – $80,000/year',
        hourlyRate: '$40 – $70/hr',
        timezone: 'GMT/BST (UTC+0/+1)',
        timezoneOverlap: '4.5 hrs behind India (IST) — significant morning overlap',
        complianceNote: 'UK projects fall under UK GDPR (post-Brexit). Our engineers are briefed on UK ICO guidelines. IR35 does not apply to our offshore engagement model, simplifying your procurement.',
        stats: [
            { label: 'UK AI Sector Size', value: '£16.9B' },
            { label: 'Avg London AI Salary', value: '£110k/yr' },
            { label: 'Remote Saving', value: '55%' },
            { label: 'Time-to-Hire (London)', value: '2–3 months' },
        ],
        faqs: [
            { q: 'Does your engagement model avoid IR35 complications?', a: 'Yes. Because our engineers are employed by InfyGalaxy offshore, the IR35 off-payroll rules do not apply to your engagement. You receive a clean B2B service contract with none of the IR35 reclassification risk.' },
            { q: 'Can you support UK GDPR and ICO compliance requirements?', a: 'Yes. Our engineers are briefed on UK GDPR requirements and ICO data handling standards. We can also assist with Data Processing Agreements (DPAs) if required for your project.' },
            { q: 'Do you work with UK FinTech companies regulated by the FCA?', a: 'Yes. We deploy AI engineers for FCA-regulated FinTech projects. Our teams are experienced in explainable AI (XAI) for credit decisions, fraud detection, and AML — all areas requiring regulatory alignment.' },
        ],
    },

    'germany': {
        slug: 'germany',
        country: 'Germany',
        flag: '🇩🇪',
        region: 'Europe',
        heroTitle: 'Hire AI Engineers in Germany',
        heroSubtitle: 'Build your AI team for German Mittelstand and DAX-listed enterprises. GDPR-native engineers, German work-week ready, at 65% below local rates.',
        metaTitle: 'Hire AI Engineers in Germany | Berlin & Munich AI Talent | InfyGalaxy',
        metaDescription: 'Hire GDPR-compliant AI engineers for German companies in Berlin, Munich & Hamburg. ML, NLP & industrial AI engineers at $35–65/hr. 48-hour deployment.',
        keywords: ['hire ai engineer germany', 'ai engineer berlin', 'hire ml engineer munich', 'gdpr ai engineer germany', 'industrial ai germany', 'ai staffing germany', 'hire ki ingenieur deutschland'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-germany`,
        ogImage: `${BASE}/images/geo/germany-ai.jpg`,
        marketContext: 'Germany is Europe\'s industrial AI powerhouse. The German government\'s AI Strategy commits €3 billion to AI development, with a focus on manufacturing, automotive, and healthcare. Major German enterprises across automotive, industrial, and financial services sectors are building large AI teams — but Germany\'s strict labour laws and premium salaries create a significant cost barrier.',
        whyRemote: 'A Senior AI Engineer in Berlin or Munich commands €90,000–€130,000/year plus mandatory social security contributions of ~20%. Germany\'s Kurzarbeit and strict employment protections add further overhead. Remote teams via InfyGalaxy sidestep all of this — no Sozialabgaben, no Kündigungsschutz complexity — just pure engineering delivery.',
        localIndustries: ['Automotive & Mobility AI', 'Industrial IoT & Industry 4.0', 'Enterprise Software & ERP', 'Banking & Insurance', 'Pharmaceutical & Healthcare AI', 'E-commerce & Retail Tech'],
        salaryLocal: '€90,000 – €130,000/year (~$98k–$142k)',
        salaryRemote: '$45,000 – $75,000/year',
        hourlyRate: '$35 – $65/hr',
        timezone: 'CET/CEST (UTC+1/+2)',
        timezoneOverlap: '3.5–4.5 hrs behind India — strong morning overlap window',
        complianceNote: 'German AI projects must comply with EU AI Act (2024) and GDPR. Our engineers are EU AI Act-ready and trained on data minimisation, purpose limitation, and Article 22 (automated decision-making) requirements critical for German enterprise deployments.',
        stats: [
            { label: 'German AI Investment', value: '€3B+' },
            { label: 'Avg Berlin AI Salary', value: '€105k/yr' },
            { label: 'Remote Saving', value: '65%' },
            { label: 'EU AI Act Compliant', value: '✓ Yes' },
        ],
        faqs: [
            { q: 'Are your AI engineers trained on EU AI Act and GDPR compliance?', a: 'Yes. All engineers working on European projects undergo GDPR and EU AI Act briefings, including high-risk AI system classification, transparency obligations, and data minimisation principles. We can provide relevant compliance documentation upon request.' },
            { q: 'Can you build industrial AI solutions for German manufacturing clients?', a: 'Absolutely. We have experience in predictive maintenance AI (Industry 4.0), quality inspection computer vision, supply chain optimisation ML, and digital twin architectures — all critical to German Mittelstand and large manufacturers.' },
            { q: 'How do you handle the German work-culture expectations (e.g. documentation, precision)?', a: 'We select engineers with demonstrated experience working with German enterprise clients. Our process emphasises thorough technical documentation, strict sprint commitments, and clear escalation protocols — aligning with German professional standards.' },
        ],
    },

    'singapore': {
        slug: 'singapore',
        country: 'Singapore',
        flag: '🇸🇬',
        region: 'APAC',
        heroTitle: 'Hire AI Engineers in Singapore',
        heroSubtitle: 'Power your Singapore AI projects with top 1% remote talent. PDPA-aware engineers for MAS-regulated fintechs, SGX-listed firms, and smart city initiatives.',
        metaTitle: 'Hire AI Engineers in Singapore | APAC AI Talent | InfyGalaxy',
        metaDescription: 'Hire AI engineers for Singapore at $35–70/hr vs SGD 10,000–18,000/month local. PDPA-compliant GenAI, ML & data science for fintech and smart city projects. 48hr deploy.',
        keywords: ['hire ai engineer singapore', 'ai engineer singapore cost', 'hire ml developer singapore', 'pdpa ai singapore', 'mas fintech ai engineer', 'smart city ai singapore', 'ai staffing singapore'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-singapore`,
        ogImage: `${BASE}/images/geo/singapore-ai.jpg`,
        marketContext: 'Singapore is APAC\'s undisputed AI hub. The National AI Strategy 2.0 commits S$1 billion over five years, with focus on government AI, fintech, and smart nation initiatives. Singapore is home to APAC headquarters of the world\'s largest tech companies, creating fierce competition for AI talent and pushing local salaries to near-Western levels.',
        whyRemote: 'An AI Engineer in Singapore commands SGD 120,000–180,000/year — among the highest in Asia. CPF employer contributions (17%) add further overhead. Remote teams through InfyGalaxy are deployed at 50–60% lower cost with near-identical timezone overlap (IST is only 2.5 hours behind SGT).',
        localIndustries: ['Fintech & MAS-regulated Financial Services', 'Government & Smart Nation', 'Logistics & Supply Chain', 'Healthcare & BioMedTech', 'Digital Media & Gaming', 'Legal Tech & RegTech'],
        salaryLocal: 'SGD 120,000 – 180,000/year (~$90k–$135k)',
        salaryRemote: '$45,000 – $80,000/year',
        hourlyRate: '$35 – $70/hr',
        timezone: 'SGT (UTC+8)',
        timezoneOverlap: 'Just 2.5 hours ahead of IST — near-perfect overlap for real-time collaboration',
        complianceNote: 'Singapore projects must comply with PDPA (Personal Data Protection Act). Our engineers are briefed on PDPA obligations, MAS Technology Risk Management Guidelines (TRMG), and GovTech\'s AI governance framework.',
        stats: [
            { label: 'National AI Budget', value: 'S$1B' },
            { label: 'Avg Onsite AI Salary', value: 'SGD 150k/yr' },
            { label: 'Remote Saving', value: '55%' },
            { label: 'IST–SGT Gap', value: '2.5 hrs' },
        ],
        faqs: [
            { q: 'Can your engineers comply with MAS Technology Risk Management Guidelines?', a: 'Yes. Engineers working on Singapore fintech projects are briefed on MAS TRMG requirements including model risk management, algorithmic auditability, and data governance standards.' },
            { q: 'What is the timezone difference between India and Singapore for remote collaboration?', a: 'IST is only 2.5 hours behind SGT — making this one of the best timezone matches for remote AI teams globally. Your Singapore team can have 6+ hours of real-time collaboration daily with no early morning or late evening calls required.' },
            { q: 'Can you support Singapore Smart Nation and GovTech AI projects?', a: 'Yes. We have experience delivering AI solutions for government-adjacent projects including predictive public service analytics, NLP for civic engagement, and computer vision for public safety applications.' },
        ],
    },

    'india': {
        slug: 'india',
        country: 'India',
        flag: '🇮🇳',
        region: 'APAC',
        heroTitle: 'Hire AI Engineers in India',
        heroSubtitle: 'Access India\'s top 1% of AI engineers — the world\'s largest pool of AI talent at unmatched value. No middlemen. Direct vetted engagement.',
        metaTitle: 'Hire AI Engineers in India | Top 1% Indian AI Talent | InfyGalaxy',
        metaDescription: 'Hire top AI engineers from India at $25–55/hr. India produces 40% of world AI talent. Get pre-vetted GenAI, ML & MLOps engineers from Bengaluru, Hyderabad & Pune.',
        keywords: ['hire ai engineer india', 'hire ml engineer bangalore', 'ai developer india cost', 'hire ai team india', 'best ai engineers india', 'generative ai engineer india', 'ai staffing india bangalore hyderabad'],
        canonicalUrl: `${BASE}/hire-expert-ai-engineers/hire-ai-engineer-in-india`,
        ogImage: `${BASE}/images/geo/india-ai.jpg`,
        marketContext: 'India produces approximately 40% of the world\'s AI talent. Bengaluru\'s AI ecosystem — home to major global tech R&D centres — rivals Silicon Valley for depth of talent in ML, GenAI, and MLOps. India\'s NASSCOM estimates 1 million+ AI-skilled professionals, making it the deepest available talent pool on earth.',
        whyRemote: 'Hiring directly through InfyGalaxy gives you access to the real top 1% — engineers who have built systems at scale for fast-growth startups and global enterprises — not freelancer-platform generalists. We handle all HR, payroll, and compliance, so you get a dedicated engineer without setting up a legal entity in India.',
        localIndustries: ['SaaS & Cloud Product Engineering', 'IT Services & Digital Transformation', 'Fintech & Digital Payments', 'Healthcare AI & Diagnostics', 'EdTech & Online Learning', 'E-commerce & Quick Commerce AI'],
        salaryLocal: '₹25,00,000 – ₹50,00,000/year CTC (~$30k–$60k)',
        salaryRemote: '$30,000 – $65,000/year (global market rate via InfyGalaxy)',
        hourlyRate: '$25 – $55/hr',
        timezone: 'IST (UTC+5:30)',
        timezoneOverlap: 'Overlaps with all major global timezones via shift scheduling',
        complianceNote: 'Indian AI projects fall under the DPDP Act 2023 (Digital Personal Data Protection Act). Our contracts include DPDP-aligned data processing terms. IP ownership is fully transferred to clients via signed agreements.',
        stats: [
            { label: 'India AI Talent Pool', value: '1M+' },
            { label: 'World AI Talent Share', value: '40%' },
            { label: 'Avg Senior AI Salary', value: '$45k/yr' },
            { label: 'Global Tech R&D Centres', value: '400+' },
        ],
        faqs: [
            { q: 'How is InfyGalaxy different from hiring on Upwork or Toptal for Indian AI engineers?', a: 'Platforms like Upwork surface the available, not the best. InfyGalaxy headhunts from tier-1 product and research organisations. Every engineer passes a 5-stage evaluation: DSA & ML fundamentals, system design, live coding, domain knowledge, and client communication assessment.' },
            { q: 'Who owns the IP and code written by Indian AI engineers?', a: 'You do — 100%. All our engagement agreements include full IP assignment and work-for-hire clauses enforceable under Indian law. Source code, models, and data pipelines are your property from day one.' },
            { q: 'Can Indian AI engineers get a visa to work onsite in the UK, USA, or Germany?', a: 'Yes. We have experience facilitating engineer travel for onsite sprints under B-1 (USA), Business Visitor (UK), and Schengen Business Visa (Germany). For long-term onsite, we can support Tier-2/Skilled Worker visa sponsorship discussions.' },
        ],
    },
}

export function getCountryData(slug: string): CountryPageData | null {
    return geoPages[slug] || null
}

export const allCountrySlugs = Object.keys(geoPages)
