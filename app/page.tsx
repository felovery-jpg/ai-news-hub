import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import AIToolsSpotlight from '@/components/AIToolsSpotlight'
import AdBanner from '@/components/AdBanner'
import type { Article } from '@/lib/supabase'

export const revalidate = 3600

async function getLatestArticles(category?: string): Promise<Article[]> {
  if (!supabase) return []

  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(30)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) { console.error('Error fetching articles:', error); return [] }
  return data || []
}

async function getFeaturedArticles(): Promise<Article[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(5)
  return data || []
}

/* ===== Loading Skeleton ===== */
function LoadingSkeleton() {
  return (
    <div className="animate-shimmer rounded-2xl h-[400px] mb-8" />
  )
}

function CardSkeleton() {
  return (
    <div className="animate-shimmer rounded-xl h-[180px] mb-4" />
  )
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

  const heroArticle = articles[0]
  const subHeroArticles = articles.slice(1, 3)
  const remainingArticles = articles.slice(3)

  return (
    <div className="grid-pattern min-h-screen">
      {/* ===== HERO BANNER ===== */}
      <section className="hero-bg relative border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="live-dot animate-pulse-dot" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Live Updates</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent glow-text">
                  AI News Hub
                </span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span>📡</span> 16+ Sources
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span>🤖</span> AI Summaries
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span>⚡</span> Real-time
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed">
            Your daily pulse on the AI revolution — curated news, breakthrough research,
            cutting-edge tools, and developer insights from across the globe.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Top Ad Banner */}
        <AdBanner slot={SITE_CONFIG.adsenseSlotIds.header} format="horizontal" />

        {/* Category Filter */}
        <CategoryFilter activeCategory={category} />

        {/* ===== MAIN LAYOUT ===== */}
        {articles.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-4xl animate-float">
                🤖
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2">Initializing AI Feed</h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              The content pipeline is spinning up. Articles will appear here once the first collection cycle completes.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              Waiting for Supabase connection...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* ===== LEFT COLUMN: Articles ===== */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Hero Article */}
              {heroArticle && (
                <ArticleCard article={heroArticle} variant="featured" />
              )}

              {/* Sub-hero grid (2 side by side) */}
              {subHeroArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subHeroArticles.map(article => (
                    <ArticleCard key={article.id} article={article} variant="default" />
                  ))}
                </div>
              )}

              {/* Divider */}
              {remainingArticles.length > 0 && (
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Latest</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}

              {/* Remaining articles list */}
              <div className="space-y-4">
                {remainingArticles.map((article, idx) => (
                  <div key={article.id}>
                    <ArticleCard article={article} variant="default" />
                    {(idx + 1) % 8 === 0 && (
                      <AdBanner slot={SITE_CONFIG.adsenseSlotIds.inArticle} format="rectangle" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT SIDEBAR ===== */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Sidebar Ad */}
              <AdBanner slot={SITE_CONFIG.adsenseSlotIds.sidebar} format="rectangle" />

              {/* Trending / Hot */}
              {featured.length > 0 && (
                <div className="glass rounded-xl p-5 gradient-border">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-lg">🔥</span>
                    <h3 className="font-bold text-sm uppercase tracking-wider">Trending Now</h3>
                  </div>
                  <div className="space-y-1">
                    {featured.map((article, idx) => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tools Spotlight */}
              <AIToolsSpotlight />

              {/* Newsletter CTA */}
              <div className="relative overflow-hidden glass rounded-xl p-6 gradient-border">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🚀</span>
                    <h3 className="font-bold">Stay Ahead of AI</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Get the most important AI news and tools delivered every morning. Join 5,000+ readers.
                  </p>
                  <a
                    href="https://buttondown.email"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-500/15 hover:shadow-purple-500/25"
                  >
                    Subscribe Free →
                  </a>
                </div>
              </div>

              {/* Stats / Info card */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  📊 Coverage
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'News Sources', value: '16+', icon: '📡' },
                    { label: 'Daily Articles', value: '100+', icon: '📰' },
                    { label: 'AI Tools', value: '50+', icon: '🛠️' },
                    { label: 'Categories', value: '7', icon: '🏷️' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/[0.03] rounded-lg p-3 text-center">
                      <div className="text-lg mb-0.5">{stat.icon}</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
