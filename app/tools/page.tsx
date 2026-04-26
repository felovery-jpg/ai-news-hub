import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import { AI_TOOLS } from '@/lib/rss-sources'
import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'

export const revalidate = 86400 // Revalidate daily

export const metadata: Metadata = {
  title: 'Best AI Tools Directory 2025 - Free & Paid',
  description: 'Discover the best AI tools for writing, coding, image generation, video creation, and more. Curated list of 100+ AI tools with reviews.',
  keywords: 'AI tools, best AI tools 2025, AI software, ChatGPT alternatives, AI writing tools, AI image generators',
}

const toolCategories = [
  { id: 'all', label: 'All Tools', icon: '🤖' },
  { id: 'Chat AI', label: 'Chat AI', icon: '💬' },
  { id: 'Image AI', label: 'Image AI', icon: '🎨' },
  { id: 'Coding AI', label: 'Coding AI', icon: '💻' },
  { id: 'Writing AI', label: 'Writing AI', icon: '✍️' },
  { id: 'Video AI', label: 'Video AI', icon: '🎬' },
  { id: 'Voice AI', label: 'Voice AI', icon: '🎙️' },
  { id: 'Search AI', label: 'Search AI', icon: '🔍' },
]

const pricingColors: Record<string, string> = {
  'Free': 'bg-green-900/50 text-green-400',
  'Freemium': 'bg-blue-900/50 text-blue-400',
  'Paid': 'bg-orange-900/50 text-orange-400',
}

// JSON-LD for tools page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best AI Tools 2025',
  description: 'Comprehensive directory of AI tools and software',
  url: `${SITE_CONFIG.url}/tools`,
  numberOfItems: AI_TOOLS.length,
  itemListElement: AI_TOOLS.map((tool, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: tool.name,
    description: tool.description,
    url: tool.url,
  })),
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category || 'all'
  
  const filteredTools = activeCategory === 'all'
    ? AI_TOOLS
    : AI_TOOLS.filter(t => t.category === activeCategory)
  
  const featuredTools = AI_TOOLS.filter(t => t.featured)

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          🛠️ AI Tools Directory
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          The most comprehensive list of AI tools. Find the perfect AI for your workflow.
        </p>
      </div>

      {/* Ad */}
      <AdBanner slot={SITE_CONFIG.adsenseSlotIds.header} format="horizontal" />

      {/* Featured Tools */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">⭐ Featured AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.affiliate_url || tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/20 hover:border-purple-500/60 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">
                  {tool.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${pricingColors[tool.pricing] || 'bg-gray-700 text-gray-300'}`}>
                  {tool.pricing}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{tool.description}</p>
              <div className="flex flex-wrap gap-1">
                {tool.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              {tool.affiliate_url && (
                <div className="mt-3 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visit {tool.name} →
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {toolCategories.map((cat) => (
          <a
            key={cat.id}
            href={`/tools${cat.id !== 'all' ? `?category=${encodeURIComponent(cat.id)}` : ''}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.label}
          </a>
        ))}
      </div>

      {/* All Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <a
            key={tool.name}
            href={tool.affiliate_url || tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-900 hover:bg-gray-800 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold group-hover:text-purple-400 transition-colors">{tool.name}</h3>
                <span className="text-xs text-gray-500">{tool.category}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${pricingColors[tool.pricing] || 'bg-gray-700 text-gray-300'}`}>
                {tool.pricing}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
