import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import type { Article } from '@/lib/supabase'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

async function getRelatedArticles(category: string, excludeId: string): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(4)
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: `${SITE_CONFIG.url}/article/${article.slug}`,
      images: article.image_url ? [article.image_url] : [],
      publishedTime: article.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.image_url ? [article.image_url] : [],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()
  
  const related = await getRelatedArticles(article.category, article.id)
  
  // Increment view count (fire and forget)
  supabase
    .from('articles')
    .update({ view_count: (article.view_count || 0) + 1 })
    .eq('id', article.id)
    .then(() => {})
  
  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    datePublished: article.published_at,
    dateModified: article.created_at,
    author: { '@type': 'Organization', name: article.source },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: `${SITE_CONFIG.url}/article/${article.slug}`,
    image: article.image_url || `${SITE_CONFIG.url}/og-default.png`,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <a href="/" className="hover:text-purple-400">Home</a>
        <span>/</span>
        <a href={`/?category=${article.category}`} className="hover:text-purple-400 capitalize">
          {article.category}
        </a>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-xs">{article.title}</span>
      </nav>

      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">{publishedDate}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500 text-sm">{article.source}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            {article.summary}
          </p>
          
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-xl mt-6 object-cover max-h-96"
            />
          )}
        </header>

        {/* Top Ad */}
        <AdBanner slot={SITE_CONFIG.adsenseSlotIds.inArticle} format="horizontal" />

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none my-8">
          <p className="text-gray-300 leading-relaxed">{article.content || article.summary}</p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-purple-900 hover:text-purple-300 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read Original */}
        <div className="bg-gray-900 rounded-xl p-6 my-8 border border-gray-800">
          <p className="text-gray-400 mb-3 text-sm">📖 Continue reading the full article:</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Read Full Article on {article.source} →
          </a>
        </div>
      </article>

      {/* Bottom Ad */}
      <AdBanner slot={SITE_CONFIG.adsenseSlotIds.inArticle} format="horizontal" />

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((rel) => (
              <a
                key={rel.id}
                href={`/article/${rel.slug}`}
                className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors group"
              >
                <span className="text-xs text-purple-400 uppercase tracking-wide">{rel.source}</span>
                <h3 className="font-semibold mt-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {rel.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{rel.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
