import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

export const revalidate = 1800

export async function GET() {
  if (!supabase) {
    return new NextResponse('<?xml version="1.0"?><rss><channel><title>AI News Hub</title></channel></rss>', {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
  }
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)
  
  const items = (articles || []).map(article => `
  <item>
    <title><![CDATA[${article.title}]]></title>
    <link>${SITE_CONFIG.url}/article/${article.slug}</link>
    <description><![CDATA[${article.summary}]]></description>
    <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
    <guid isPermaLink="true">${SITE_CONFIG.url}/article/${article.slug}</guid>
    <category>${article.category}</category>
    <source url="${article.url}">${article.source}</source>
    ${article.tags?.map((t: string) => `<tag>${t}</tag>`).join('\n    ')}
  </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name} - AI News Feed</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${SITE_CONFIG.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_CONFIG.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_CONFIG.url}/logo.png</url>
      <title>${SITE_CONFIG.name}</title>
      <link>${SITE_CONFIG.url}</link>
    </image>
${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  })
}
