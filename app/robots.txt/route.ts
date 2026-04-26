import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/lib/config'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# Crawl delay
Crawl-delay: 10

# Disallow admin areas
Disallow: /api/
Disallow: /_next/
`
  return new NextResponse(robots, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
