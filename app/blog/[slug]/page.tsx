import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/wordpress';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
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
                    <Link href="/blog">
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
