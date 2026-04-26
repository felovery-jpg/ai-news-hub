import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAllFeeds, generateSlug } from '@/lib/rss-fetcher'
import { generateAISummary } from '@/lib/gemini'

// This endpoint is called by GitHub Actions daily cron job
// Protected by a secret key to prevent unauthorized calls

export async function POST(req: NextRequest) {
  // Security check
  const authHeader = req.headers.get('authorization')
  const expectedKey = `Bearer ${process.env.CRON_SECRET_KEY}`
  
  if (authHeader !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use service role key for write operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 })
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  console.log('🤖 Starting daily feed collection...')
  
  try {
    const items = await fetchAllFeeds()
    console.log(`📰 Fetched ${items.length} total items from all sources`)
    
    let newCount = 0
    let skippedCount = 0
    
    for (const item of items.slice(0, 100)) { // Process max 100 per run
      // Check if article already exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('url', item.link)
        .single()
      
      if (existing) {
        skippedCount++
        continue
      }
      
      // Generate AI summary and tags
      const aiData = await generateAISummary(item.title, item.contentSnippet)
      
      // Rate limit: wait 500ms between Gemini API calls
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const slug = generateSlug(item.title, item.pubDate)
      
      // Insert into Supabase
      const { error } = await supabase.from('articles').insert({
        title: item.title,
        summary: aiData.summary,
        content: item.contentSnippet,
        url: item.link,
        source: item.source,
        category: item.category,
        tags: aiData.tags,
        image_url: item.imageUrl,
        published_at: new Date(item.pubDate).toISOString(),
        slug,
        view_count: 0,
      })
      
      if (!error) {
        newCount++
        
        // Submit URL to Bing IndexNow for instant indexing
        await submitToIndexNow(
          `${process.env.NEXT_PUBLIC_SITE_URL}/article/${slug}`
        ).catch(() => {}) // Non-blocking
      }
    }
    
    // Also submit sitemap to search engines
    await pingSearchEngines().catch(() => {})
    
    const result = {
      success: true,
      fetched: items.length,
      newArticles: newCount,
      skipped: skippedCount,
      timestamp: new Date().toISOString(),
    }
    
    console.log('✅ Daily feed collection complete:', result)
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Feed collection failed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

async function submitToIndexNow(url: string): Promise<void> {
  const indexNowKey = process.env.INDEXNOW_KEY
  if (!indexNowKey) return
  
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname,
      key: indexNowKey,
      keyLocation: `${process.env.NEXT_PUBLIC_SITE_URL}/${indexNowKey}.txt`,
      urlList: [url],
    }),
  })
}

async function pingSearchEngines(): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return
  
  const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`)
  
  // Ping Google
  await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {})
  
  // Ping Bing
  await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {})
}

// GET handler for manual testing
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return NextResponse.json({ status: 'API online. Use POST with authorization.' })
  }
  return NextResponse.json({ status: 'Cron API ready', time: new Date().toISOString() })
}
