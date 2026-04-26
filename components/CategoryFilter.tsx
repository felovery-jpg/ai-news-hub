import { SITE_CONFIG } from '@/lib/config'

type Props = { activeCategory: string }

const categoryGradients: Record<string, string> = {
  all: 'from-gray-600 to-gray-500',
  news: 'from-blue-500 to-cyan-400',
  research: 'from-purple-500 to-fuchsia-400',
  tools: 'from-emerald-500 to-green-400',
  tutorial: 'from-amber-500 to-yellow-400',
  dev: 'from-red-500 to-orange-400',
  newsletter: 'from-pink-500 to-rose-400',
  tech: 'from-cyan-500 to-blue-400',
}

export default function CategoryFilter({ activeCategory }: Props) {
  const all = { slug: 'all', label: 'All', icon: '✨' }
  const cats = [all, ...SITE_CONFIG.categories]

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {cats.map((cat) => {
        const isActive = activeCategory === cat.slug
        const gradient = categoryGradients[cat.slug] || categoryGradients.all

        return (
          <a
            key={cat.slug}
            href={cat.slug === 'all' ? '/' : `/?category=${cat.slug}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.06]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse" />
            )}
          </a>
        )
      })}
    </div>
  )
}
