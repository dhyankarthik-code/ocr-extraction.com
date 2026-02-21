import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/wordpress';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import ShareButtons from '@/components/blog/ShareButtons';
import LikeButton from '@/components/blog/LikeButton';
import ViewCounter from '@/components/blog/ViewCounter';
import CommentSection from '@/components/blog/CommentSection';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // [SEO SHIM] Override metadata for specific manual post
    if (slug === 'how-to-hire-ai-engineers-in-2026-the-complete-cto-guide-to-finding-top-ai-talent') {
        const title = 'How to Hire Best AI Engineers in 2026: The Ultimate Guide for CTOs';
        const description = 'Learn the proven 5-step process to hire best AI engineers and top AI talent in 2026. From vetting GenAI skills to salary benchmarks, this guide helps CTOs build world-class AI teams.';
        const url = `https://www.ocr-extraction.com/blog/${slug}`;

        return {
            title,
            description,
            keywords: ['hire ai engineer', 'hire best ai engineers', 'hire top ai engineer', 'hire good ml engineer', 'hire expert ai engineers', 'hire dedicated ai team'],
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description,
                url,
                type: 'article',
                publishedTime: '2026-02-18',
                authors: ['InfyGalaxy Team'],
                images: [{ url: 'https://www.ocr-extraction.com/images/blog/hiring-ai.jpg', width: 1200, height: 630 }], // Placeholder or use dynamic if available
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            }
        };
    }

    // [SEO SHIM 2] Override metadata for Cost to Hire post
    if (slug === 'cost-to-hire-ai-engineers-in-2026-usa-vs-india-vs-europe-vs-dubai') {
        const title = 'Cost to Hire AI Engineers in 2026: The Global CTO Guide (USA vs India vs Dubai)';
        const description = 'How much does it cost to hire an AI engineer in 2026? Complete guide comparing hourly rates in USA ($150/hr), India ($40/hr), & Dubai ($80/hr). Save 60% with remote teams.';
        const url = `https://www.ocr-extraction.com/blog/${slug}`;

        return {
            title,
            description,
            keywords: ['cost to hire ai engineer', 'ai engineer salary 2026', 'hire ai developers india price', 'ai engineer hourly rates', 'software engineer salary usa vs india', 'outsourced ai development cost'],
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description,
                url,
                type: 'article',
                publishedTime: '2026-02-19',
                authors: ['InfyGalaxy Team'],
                images: [{ url: 'https://www.ocr-extraction.com/images/blog/ai-cost-guide.jpg', width: 1200, height: 630 }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            }
        };
    }

    // [SEO SHIM 3] Override metadata for ML Engineer Skills Checklist
    if (slug === 'hire-machine-learning-engineer-skills-checklist') {
        const title = 'Hire a Machine Learning Engineer: The Essential Skills Checklist for 2026';
        const description = 'Complete skills checklist to hire the right machine learning engineer. Covers Python, PyTorch, TensorFlow, MLOps, cloud deployment, model monitoring, and production ML expertise.';
        const url = `https://www.ocr-extraction.com/blog/${slug}`;

        return {
            title,
            description,
            keywords: ['hire machine learning engineer', 'ml engineer skills checklist', 'machine learning engineer skills', 'hire ml developer', 'ml engineer hiring guide', 'pytorch engineer', 'tensorflow developer', 'mlops engineer hire'],
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description,
                url,
                type: 'article',
                publishedTime: '2026-02-21',
                authors: ['InfyGalaxy Team'],
                images: [{ url: 'https://www.ocr-extraction.com/images/blog/ml-engineer-checklist.jpg', width: 1200, height: 630 }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            }
        };
    }

    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const description = post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);
    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    return {
        title: `${post.title.rendered} - OCR Extraction Blog`,
        description,
        alternates: {
            canonical: `https://www.ocr-extraction.com/blog/${slug}`,
        },
        openGraph: {
            title: `${post.title.rendered} - OCR Extraction Blog`,
            description,
            url: `https://www.ocr-extraction.com/blog/${slug}`,
            type: 'article',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title.rendered} - OCR Extraction Blog`,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = featuredMedia?.source_url;
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const author = post._embedded?.author?.[0]?.name || 'Team';

    // [SEO SHIM] JSON-LD and CTA for specific post
    const isTargetPost = slug === 'how-to-hire-ai-engineers-in-2026-the-complete-cto-guide-to-finding-top-ai-talent' || slug === 'hire-machine-learning-engineer-skills-checklist';

    const structuredData = isTargetPost ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Hire Best AI Engineers in 2026: The Ultimate Guide for CTOs",
        "datePublished": "2026-02-18",
        "author": { "@type": "Organization", "name": "InfyGalaxy" },
        "publisher": {
            "@type": "Organization",
            "name": "InfyGalaxy",
            "logo": { "@type": "ImageObject", "url": "https://www.ocr-extraction.com/logo.png" }
        },
        "description": "Learn the proven 5-step process to hire best AI engineers and top AI talent in 2026."
    } : null;

    // Fix mixed content issues by replacing http with https in content
    // Fix mixed content issues and strip unwanted SEO tags/H1s from content
    const sanitizedTitle = post.title.rendered.replace(/http:\/\/([^\s"']+)/g, 'https://$1');

    let sanitizedContent = post.content.rendered.replace(/http:\/\/([^\s"']+)/g, 'https://$1');

    // Remove <title>, <meta>, <link> tags that might have been injected by WP plugins
    sanitizedContent = sanitizedContent.replace(/<title>.*?<\/title>/gi, '');
    sanitizedContent = sanitizedContent.replace(/<meta[^>]*>/gi, '');
    sanitizedContent = sanitizedContent.replace(/<link[^>]*>/gi, '');

    // Replace <h1> with <h2> in content to ensure single H1 (which is the post title)
    sanitizedContent = sanitizedContent.replace(/<h1([^>]*)>(.*?)<\/h1>/gi, '<h2$1>$2</h2>');

    return (
        <div className="bg-white pt-24 pb-16">
            <article className="container mx-auto px-4 max-w-4xl">
                {/* Back Link */}
                <div className="mb-8 flex justify-between items-center">
                    <Link href="/blog/">
                        <Button variant="ghost" size="sm" className="bg-gray-50 hover:bg-gray-100 text-gray-600 gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500 mb-6">
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4" />
                            {date}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {author}
                        </span>
                        <ViewCounter slug={slug} />
                    </div>

                    <h1
                        className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8"
                        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                    />

                    {imageUrl && (
                        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-10">
                            <img
                                src={imageUrl}
                                alt={featuredMedia?.alt_text || post.title.rendered}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 hover:prose-a:text-red-700 prose-img:rounded-xl prose-img:shadow-md mb-12"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />

                {/* [SEO SHIM] Custom CTA for Hiring Guide */}
                {slug === 'how-to-hire-ai-engineers-in-2026-the-complete-cto-guide-to-finding-top-ai-talent' && (
                    <div className="my-12 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 text-center shadow-xl">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Ready to Build Your AI Team?
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Skip the 3-month hiring cycle. Get access to pre-vetted AI engineers from our global talent pool in 48 hours.
                        </p>
                        <a
                            href="/hire-expert-ai-engineers"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                        >
                            Hire Top 1% AI Talent Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>

                        {/* JSON-LD Schema Injection */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Article",
                                    "headline": "How to Hire Best AI Engineers in 2026: The Ultimate Guide for CTOs",
                                    "image": ["https://www.ocr-extraction.com/images/blog/hiring-ai.jpg"],
                                    "datePublished": "2026-02-18T08:00:00+00:00",
                                    "dateModified": "2026-02-18T09:20:00+00:00",
                                    "author": [{
                                        "@type": "Organization",
                                        "name": "InfyGalaxy",
                                        "url": "https://www.ocr-extraction.com"
                                    }]
                                })
                            }}
                        />
                    </div>
                )}

                {/* [SEO SHIM 2] Custom CTA for Cost Guide */}
                {slug === 'cost-to-hire-ai-engineers-in-2026-usa-vs-india-vs-europe-vs-dubai' && (
                    <div className="my-12 p-8 bg-white rounded-2xl border-2 border-red-50 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Stop Paying Silicon Valley Rates.
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
                            Hire the top 1% of AI Engineers from India starting at <span className="text-red-600 font-bold">$40/hr</span>. Same quality, 60% less cost.
                        </p>
                        <a
                            href="/hire-expert-ai-engineers"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-xl"
                        >
                            Build Your AI Team Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </a>

                        {/* JSON-LD Schema Injection */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Article",
                                    "headline": "Cost to Hire AI Engineers in 2026: The Global CTO Guide (USA vs India vs Dubai)",
                                    "description": "How much does it cost to hire an AI engineer in 2026? Complete guide comparing hourly rates in USA ($150/hr), India ($40/hr), & Dubai ($80/hr).",
                                    "image": ["https://www.ocr-extraction.com/images/blog/ai-cost-guide.jpg"],
                                    "datePublished": "2026-02-19T08:00:00+00:00",
                                    "dateModified": "2026-02-19T09:20:00+00:00",
                                    "author": [{
                                        "@type": "Organization",
                                        "name": "InfyGalaxy",
                                        "url": "https://www.ocr-extraction.com"
                                    }]
                                })
                            }}
                        />
                    </div>
                )}

                {/* [SEO SHIM 3] CTA + FAQ/Author Schema for ML Engineer Skills Checklist */}
                {slug === 'hire-machine-learning-engineer-skills-checklist' && (
                    <div className="my-12 p-8 bg-gradient-to-br from-indigo-900 via-gray-900 to-gray-800 rounded-2xl border border-indigo-700/30 text-center shadow-xl">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified AI Talent Network
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Found the Skills You Need? Let Us Find the Engineer.
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg">
                            Skip months of interviewing. Our pre-vetted ML engineers are tested for PyTorch, TensorFlow, MLOps, and production deployment — ready to start in 48 hours.
                        </p>
                        <a
                            href="/hire-expert-ai-engineers"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-red-600/25 text-lg"
                        >
                            Hire a Machine Learning Engineer
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>

                        {/* FAQ + Author JSON-LD Schema */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify([
                                    {
                                        "@context": "https://schema.org",
                                        "@type": "FAQPage",
                                        "mainEntity": [
                                            {
                                                "@type": "Question",
                                                "name": "What skills should you look for when hiring a machine learning engineer?",
                                                "acceptedAnswer": {
                                                    "@type": "Answer",
                                                    "text": "Look for expertise in Python, ML frameworks like TensorFlow or PyTorch, MLOps practices, cloud deployment (AWS SageMaker, GCP Vertex AI, Azure ML), model monitoring, data pipeline design, and production deployment experience."
                                                }
                                            },
                                            {
                                                "@type": "Question",
                                                "name": "How much does it cost to hire a machine learning engineer?",
                                                "acceptedAnswer": {
                                                    "@type": "Answer",
                                                    "text": "Costs vary by region. In the United States, experienced ML engineers may earn $140k–$190k annually. In India, rates start at $40/hr. InfyGalaxy offers pre-vetted ML engineers with a zero-risk 2-week trial."
                                                }
                                            },
                                            {
                                                "@type": "Question",
                                                "name": "What is the difference between a machine learning engineer and a data scientist?",
                                                "acceptedAnswer": {
                                                    "@type": "Answer",
                                                    "text": "A machine learning engineer focuses on building, deploying, and scaling ML models in production systems. A data scientist focuses on analysis, statistical modeling, and extracting insights from data. ML engineers typically have stronger software engineering and MLOps skills."
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "@context": "https://schema.org",
                                        "@type": "Article",
                                        "headline": "Hire a Machine Learning Engineer: The Essential Skills Checklist for 2026",
                                        "description": "Complete skills checklist to hire the right machine learning engineer. Covers Python, PyTorch, TensorFlow, MLOps, cloud deployment, and production ML.",
                                        "image": ["https://www.ocr-extraction.com/images/blog/ml-engineer-checklist.jpg"],
                                        "datePublished": "2026-02-21T08:00:00+00:00",
                                        "dateModified": "2026-02-21T09:00:00+00:00",
                                        "author": {
                                            "@type": "Organization",
                                            "name": "InfyGalaxy",
                                            "url": "https://www.ocr-extraction.com",
                                            "logo": {
                                                "@type": "ImageObject",
                                                "url": "https://www.ocr-extraction.com/logo.png"
                                            },
                                            "sameAs": [
                                                "https://www.linkedin.com/company/infygalaxy",
                                                "https://twitter.com/infygalaxy"
                                            ]
                                        },
                                        "publisher": {
                                            "@type": "Organization",
                                            "name": "InfyGalaxy",
                                            "logo": {
                                                "@type": "ImageObject",
                                                "url": "https://www.ocr-extraction.com/logo.png"
                                            }
                                        }
                                    }
                                ])
                            }}
                        />
                    </div>
                )}

                {isTargetPost && (
                    <div className="bg-red-50 p-8 rounded-2xl border border-red-100 my-10 not-prose">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to accelerate your AI roadmap?</h3>
                        <p className="text-gray-700 mb-6">
                            Don't wait months to find talent. Get immediate access to the top 1% of global AI experts.
                        </p>
                        <Link href="/hire-expert-ai-engineers">
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
                                Hire Best AI Engineers Now
                            </Button>
                        </Link>
                    </div>
                )}

                {structuredData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}

                {/* Engagement Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-b border-gray-100 mb-12">
                    <div className="flex items-center gap-4">
                        <LikeButton slug={slug} />
                    </div>
                    <ShareButtons slug={slug} title={post.title.rendered} />
                </div>

                {/* Comments */}
                <CommentSection slug={post.slug} />

            </article>
        </div>
    );
}
