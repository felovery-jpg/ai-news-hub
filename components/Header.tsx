import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/config'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-black shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
            AI
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-lg tracking-tight">AI</span>
            <span className="font-light text-gray-400 text-lg">NewsHub</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {SITE_CONFIG.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/10 mx-2" />
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-500/15"
          >
            🛠️ Tools
          </Link>
        </nav>

        {/* Mobile indicator */}
        <div className="md:hidden flex items-center gap-3">
          <div className="live-dot animate-pulse-dot" />
          <Link
            href="/tools"
            className="text-xs font-medium px-2.5 py-1 bg-purple-600 text-white rounded-md"
          >
            Tools →
          </Link>
        </div>
      </div>
    </header>
  )
}
