import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import AIToolsSpotlight from '@/components/AIToolsSpotlight'
import AdBanner from '@/components/AdBanner'
import type { Article } from '@/lib/supabase'

export const revalidate = 3600 // Revalidate every hour

async function getLatestArticles(category?: string): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(30)
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }
  return data || []
}

async function getFeaturedArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(5)
  return data || []
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category || 'all'
  
  const [articles, featured] = await Promise.all([
    getLatestArticles(category),
    getFeaturedArticles(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-10 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {SITE_CONFIG.description}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          📡 Auto-updated daily from 16+ top AI sources
        </div>
      </section>

      {/* Top Ad Banner */}
      <AdBanner slot={SITE_CONFIG.adsenseSlotIds.header} format="horizontal" />

      {/* Category Filter */}
      <CategoryFilter activeCategory={category} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Articles Feed */}
        <div className="lg:col-span-2">
          {articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🤖</div>
              <p className="text-xl">Loading AI news...</p>
              <p className="text-sm mt-2">Content is being fetched from sources. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article, idx) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                  {/* In-feed ad every 8 articles */}
                  {(idx + 1) % 8 === 0 && (
                    <AdBanner slot={SITE_CONFIG.adsenseSlotIds.inArticle} format="rectangle" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Sidebar Ad */}
          <AdBanner slot={SITE_CONFIG.adsenseSlotIds.sidebar} format="rectangle" />
          
          {/* AI Tools Spotlight */}
          <AIToolsSpotlight />
          
          {/* Trending */}
          {featured.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🔥 Trending
              </h3>
              <div className="space-y-3">
                {featured.map((article, idx) => (
                  <a
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex gap-3 group hover:text-purple-400 transition-colors"
                  >
                    <span className="text-2xl font-bold text-gray-700 group-hover:text-purple-500 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                      {article.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Newsletter CTA */}
          <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl p-5 border border-purple-500/20">
            <h3 className="font-semibold mb-2">📬 Daily AI Digest</h3>
            <p className="text-sm text-gray-400 mb-4">Get top AI news delivered to your inbox every morning.</p>
            <a
              href="https://buttondown.email"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Subscribe Free →
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
