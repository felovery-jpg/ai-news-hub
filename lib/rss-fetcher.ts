import Parser from 'rss-parser'
import { RSS_SOURCES } from './rss-sources'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AINewsHub/1.0 (+https://ainewshub.vercel.app)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
})

export type FeedItem = {
  title: string
  link: string
  contentSnippet: string
  pubDate: string
  source: string
  category: string
  imageUrl: string | null
}

function extractImageFromContent(content: string): string | null {
  const imgMatch = content?.match(/<img[^>]+src="([^"]+)"/i)
  return imgMatch ? imgMatch[1] : null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results: FeedItem[] = []
  
  await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url)
        const items = (feed.items || []).slice(0, 10).map((item) => ({
          title: item.title || '',
          link: item.link || item.guid || '',
          contentSnippet: item.contentSnippet || item.summary || '',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: source.source,
          category: source.category,
          imageUrl: extractImageFromContent(item.content || item['content:encoded'] || ''),
        })).filter(item => item.title && item.link)
        
        results.push(...items)
      } catch (error) {
        console.error(`Failed to fetch ${source.url}:`, error)
      }
    })
  )
  
  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = results.filter(item => {
    if (seen.has(item.link)) return false
    seen.add(item.link)
    return true
  })
  
  // Sort by date, newest first
  return unique.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
}

export function generateSlug(title: string, date: string): string {
  const dateStr = new Date(date).toISOString().split('T')[0]
  return `${dateStr}-${slugify(title)}`
}
