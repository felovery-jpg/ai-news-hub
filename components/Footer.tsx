import { SITE_CONFIG } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <span className="font-bold text-lg">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>
            <p className="text-gray-600 text-xs mt-3">
              Auto-updated daily • 16+ sources • AI-powered summaries
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Content</h4>
            <div className="space-y-2">
              {SITE_CONFIG.categories.map(cat => (
                <a key={cat.slug} href={`/?category=${cat.slug}`} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {cat.icon} {cat.label}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Resources</h4>
            <div className="space-y-2">
              <a href="/tools" className="block text-sm text-gray-500 hover:text-white transition-colors">🛠️ AI Tools</a>
              <a href="/feed.xml" className="block text-sm text-gray-500 hover:text-white transition-colors">📡 RSS Feed</a>
              <a href="/sitemap.xml" className="block text-sm text-gray-500 hover:text-white transition-colors">🗺️ Sitemap</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} {SITE_CONFIG.name}. All content curated from original sources.
          </p>
          <p className="text-gray-700 text-xs">
            This site may contain affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
