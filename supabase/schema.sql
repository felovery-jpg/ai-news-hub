-- =============================================
-- AI News Hub - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- Articles table
-- =============================================
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  content text,
  url text unique not null,
  source text not null,
  category text not null default 'news',
  tags text[] default '{}',
  image_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  slug text unique not null,
  view_count integer not null default 0
);

-- Indexes for performance
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_category_idx on public.articles (category);
create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_view_count_idx on public.articles (view_count desc);

-- =============================================
-- AI Tools table
-- =============================================
create table if not exists public.ai_tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  url text not null,
  affiliate_url text,
  category text not null,
  tags text[] default '{}',
  logo_url text,
  pricing text not null default 'Freemium',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS
alter table public.articles enable row level security;
alter table public.ai_tools enable row level security;

-- Public can read all articles
create policy "Public read articles"
  on public.articles for select
  to anon
  using (true);

-- Public can read all tools
create policy "Public read tools"
  on public.ai_tools for select
  to anon
  using (true);

-- Service role can do everything (for cron job)
create policy "Service role full access articles"
  on public.articles for all
  to service_role
  using (true);

create policy "Service role full access tools"
  on public.ai_tools for all
  to service_role
  using (true);

-- Allow anonymous view count updates
create policy "Anyone can update view count"
  on public.articles for update
  to anon
  using (true)
  with check (true);

-- =============================================
-- Auto-cleanup old articles (keep 6 months)
-- =============================================
create or replace function cleanup_old_articles()
returns void as $$
begin
  delete from public.articles
  where published_at < now() - interval '6 months'
  and view_count < 10;
end;
$$ language plpgsql;

-- =============================================
-- Stats view
-- =============================================
create or replace view public.site_stats as
select
  count(*) as total_articles,
  count(distinct source) as total_sources,
  count(*) filter (where published_at > now() - interval '24 hours') as articles_today,
  count(*) filter (where published_at > now() - interval '7 days') as articles_this_week
from public.articles;
