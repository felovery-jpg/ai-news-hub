import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/config'

export default function Header() {
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {SITE_CONFIG.name}
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {SITE_CONFIG.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors hidden md:block"
            >
              {cat.label}
            </Link>
          ))}
          <Link
            href="/tools"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            AI Tools →
          </Link>
        </nav>
      </div>
    </header>
  )
}
