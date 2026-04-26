import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

export const revalidate = 3600

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at, title')
    .order('published_at', { ascending: false })
    .limit(1000)
  
  const siteUrl = SITE_CONFIG.url
  
  type SitemapPage = {
    url: string
    changefreq: string
    priority: string
    lastmod?: string
  }

  const staticPages: SitemapPage[] = [
    { url: siteUrl, changefreq: 'hourly', priority: '1.0' },
    { url: `${siteUrl}/tools`, changefreq: 'daily', priority: '0.9' },
    { url: `${siteUrl}/research`, changefreq: 'daily', priority: '0.8' },
  ]
  
  const articlePages: SitemapPage[] = (articles || []).map((a) => ({
    url: `${siteUrl}/article/${a.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date(a.published_at).toISOString().split('T')[0],
  }))
  
  const allPages = [...staticPages, ...articlePages]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
