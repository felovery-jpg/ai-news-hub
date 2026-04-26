import { SITE_CONFIG } from '@/lib/config'

type Props = {
  activeCategory: string
}

export default function CategoryFilter({ activeCategory }: Props) {
  const all = { slug: 'all', label: 'All', icon: '✨' }
  const cats = [all, ...SITE_CONFIG.categories]
  
  return (
    <div className="flex flex-wrap gap-2">
      {cats.map((cat) => (
        <a
          key={cat.slug}
          href={cat.slug === 'all' ? '/' : `/?category=${cat.slug}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.slug
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </a>
      ))}
    </div>
  )
}
