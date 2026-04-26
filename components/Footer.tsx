import { SITE_CONFIG } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] mt-20 bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-purple-500/15">
                AI
              </div>
              <span className="font-bold text-lg tracking-tight">AI News Hub</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              {SITE_CONFIG.description}
            </p>
            <p className="text-gray-600 text-xs flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Auto-updated daily</span>
              <span>16+ sources</span>
              <span>AI-powered</span>
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Categories</h4>
            <div className="space-y-2.5">
              {SITE_CONFIG.categories.map(cat => (
                <a key={cat.slug} href={`/?category=${cat.slug}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-300 transition-colors group">
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                  {cat.label}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
            <div className="space-y-2.5">
              <a href="/tools" className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-300 transition-colors group">
                🛠️ AI Tools Directory
              </a>
              <a href="/feed.xml" className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-300 transition-colors group">
                📡 RSS Feed
              </a>
              <a href="/sitemap.xml" className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-300 transition-colors group">
                🗺️ Sitemap
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">
            © {currentYear} AI News Hub. Content curated from original sources.
          </p>
          <p className="text-gray-800 text-[11px]">
            Built with Next.js + Supabase + Vercel · Powered by Gemini AI
          </p>
        </div>
      </div>
    </footer>
  )
}
