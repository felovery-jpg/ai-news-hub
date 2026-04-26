export const SITE_CONFIG = {
  name: 'AI News Hub',
  tagline: 'Your Daily Digest of Artificial Intelligence',
  description: 'Stay ahead with the latest AI tools, research breakthroughs, and industry news. Updated daily from 16+ top sources.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ainewshub.vercel.app',
  logo: '/logo.png',
  locale: 'en-US',
  twitterHandle: '@ainewshub',
  
  // Google AdSense
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  adsenseSlotIds: {
    header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '',
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || '',
  },
  
  // SEO
  keywords: 'AI news, artificial intelligence, machine learning, AI tools, GPT, LLM, deep learning, AI research',
  
  categories: [
    { slug: 'news', label: 'AI News', icon: '📰' },
    { slug: 'tools', label: 'AI Tools', icon: '🛠️' },
    { slug: 'research', label: 'Research', icon: '🔬' },
    { slug: 'tutorial', label: 'Tutorials', icon: '📚' },
    { slug: 'dev', label: 'For Devs', icon: '💻' },
  ],
}
