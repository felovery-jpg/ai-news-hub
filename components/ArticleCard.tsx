import type { Article } from '@/lib/supabase'

type Props = {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
}

const categoryStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  news:       { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.25)', icon: '📡' },
  research:   { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', border: 'rgba(168,85,247,0.25)', icon: '🔬' },
  tools:      { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.25)', icon: '🛠️' },
  tutorial:   { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.25)', icon: '📚' },
  dev:        { bg: 'rgba(239,68,68,0.12)',   text: '#f87171', border: 'rgba(239,68,68,0.25)',   icon: '💻' },
  newsletter: { bg: 'rgba(236,72,153,0.12)',   text: '#f472b6', border: 'rgba(236,72,153,0.25)', icon: '📧' },
  tech:       { bg: 'rgba(34,211,238,0.12)',   text: '#22d3ee', border: 'rgba(34,211,238,0.25)', icon: '⚡' },
}

const defaultStyle = {
  bg: 'rgba(107,114,128,0.12)', text: '#9ca3af', border: 'rgba(107,114,128,0.25)', icon: '📄',
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const timeAgo = getTimeAgo(article.published_at)
  const cat = categoryStyles[article.category] || defaultStyle
  const hasImage = !!article.image_url

  /* ===== Featured: Large hero-style card ===== */
  if (variant === 'featured') {
    return (
      <a href={`/article/${article.slug}`} className="group block rounded-2xl overflow-hidden glass gradient-border hover:border-purple-500/30 transition-all duration-500">
        {/* Image area */}
        <div className="relative h-[320px] md:h-[380px] bg-surface-light img-zoom">
          {hasImage ? (
            <img
              src={article.image_url!}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = getFallbackGradient(article.category) }}
            />
          ) : (
            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: getFallbackGradient(article.category) }} />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          {/* Content over image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cat.bg, color: cat.text, borderColor: cat.border, borderWidth: '1px' }}>
                {cat.icon} {article.category}
              </span>
              <span className="text-gray-400 text-xs">{article.source}</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-2 group-hover:text-purple-300 transition-colors line-clamp-3">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2 mb-3 opacity-80">
              {article.summary}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{timeAgo}</span>
              {article.tags && article.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="text-purple-400/70">{article.tags.slice(0, 3).join(' · ')}</span>
                </>
              )}
              <span className="ml-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform text-purple-400 opacity-0 group-hover:opacity-100">
                Read →
              </span>
            </div>
          </div>
        </div>
      </a>
    )
  }

  /* ===== Compact: Sidebar / list item ===== */
  if (variant === 'compact') {
    return (
      <a href={`/article/${article.slug}`} className="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors">
        {hasImage ? (
          <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-surface-light img-zoom">
            <img src={article.image_url!} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className="w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center text-lg" style={{ background: cat.bg }}>
            {cat.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 group-hover:text-purple-300 transition-colors line-clamp-2 font-medium leading-snug">
            {article.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <span style={{ color: cat.text }}>{cat.icon} {article.category}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </a>
    )
  }

  /* ===== Default: Standard card with image + content side by side ===== */
  return (
    <a href={`/article/${article.slug}`} className="group block rounded-xl overflow-hidden glass hover:border-purple-500/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className={`relative ${hasImage ? 'sm:w-56 md:w-64 h-48 sm:h-auto sm:min-h-[180px]' : ''} bg-surface-light flex-shrink-0`}>
          {hasImage ? (
              <img
                src={article.image_url!}
                alt={article.title}
                className="w-full h-full object-cover img-zoom"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
          ) : (
            <div className="w-full h-full min-h-[160px] flex items-center justify-center">
              <div className="text-4xl opacity-20">{cat.icon}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text, borderColor: cat.border, borderWidth: '1px' }}>
                {cat.icon} {article.category}
              </span>
              <span className="text-gray-600 text-[11px]">{article.source}</span>
              <span className="text-gray-700 text-[11px] ml-auto">{timeAgo}</span>
            </div>

            <h2 className="text-base md:text-lg font-bold leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
              {article.title}
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {article.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getFallbackGradient(category: string): string {
  const colors: Record<string, string> = {
    news: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    research: 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)',
    tools: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    tutorial: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
    dev: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
    newsletter: 'linear-gradient(135deg, #831843 0%, #4a044e 100%)',
    tech: 'linear-gradient(135deg, #164e63 0%, #083344 100%)',
  }
  return `<div style="width:100%;height:100%;background:${colors[category] || colors.news};display:flex;align-items:center;justify-content:center"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>`
}
