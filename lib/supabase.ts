import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Article = {
  id: string
  title: string
  summary: string
  content: string
  url: string
  source: string
  category: string
  tags: string[]
  image_url: string | null
  published_at: string
  created_at: string
  slug: string
  view_count: number
}

export type AITool = {
  id: string
  name: string
  description: string
  url: string
  affiliate_url: string | null
  category: string
  tags: string[]
  logo_url: string | null
  pricing: string
  featured: boolean
  created_at: string
}
