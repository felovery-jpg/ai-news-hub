import type { Article } from '@/lib/supabase'

type Props = { article: Article }

const categoryColors: Record<string, string> = {
  news: 'bg-blue-900/40 text-blue-400',
  research: 'bg-purple-900/40 text-purple-400',
  tools: 'bg-green-900/40 text-green-400',
  tutorial: 'bg-yellow-900/40 text-yellow-400',
  dev: 'bg-red-900/40 text-red-400',
  newsletter: 'bg-pink-900/40 text-pink-400',
  tech: 'bg-cyan-900/40 text-cyan-400',
}

export default function ArticleCard({ article }: Props) {
  const timeAgo = getTimeAgo(article.published_at)
  
  return (
    <article className="group bg-gray-900 hover:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
      <a href={`/article/${article.slug}`} className="block p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${categoryColors[article.category] || 'bg-gray-700 text-gray-300'}`}>
            {article.category}
          </span>
          <span className="text-gray-500 text-xs">{article.source}</span>
          <span className="text-gray-600 text-xs ml-auto">{timeAgo}</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <h2 className="font-semibold text-base leading-snug mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>
          
          {article.image_url && (
            <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {article.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-xs text-gray-600 hover:text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </a>
    </article>
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
