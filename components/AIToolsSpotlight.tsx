import { AI_TOOLS } from '@/lib/rss-sources'
import Link from 'next/link'

export default function AIToolsSpotlight() {
  const featured = AI_TOOLS.filter(t => t.featured).slice(0, 5)
  
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold flex items-center gap-2">
          🛠️ Top AI Tools
        </h3>
        <Link href="/tools" className="text-xs text-purple-400 hover:text-purple-300">
          View all →
        </Link>
      </div>
      
      <div className="space-y-3">
        {featured.map((tool) => (
          <a
            key={tool.name}
            href={tool.affiliate_url || tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group hover:bg-gray-800 rounded-lg p-2 -mx-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {tool.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium group-hover:text-purple-400 transition-colors truncate">
                  {tool.name}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded text-xs flex-shrink-0 ${
                  tool.pricing === 'Free' ? 'bg-green-900/50 text-green-400' :
                  tool.pricing === 'Freemium' ? 'bg-blue-900/50 text-blue-400' :
                  'bg-orange-900/50 text-orange-400'
                }`}>
                  {tool.pricing}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{tool.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
