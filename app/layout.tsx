import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SITE_CONFIG } from '@/lib/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAdsense from '@/components/GoogleAdsense'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {SITE_CONFIG.adsenseClientId && (
          <GoogleAdsense clientId={SITE_CONFIG.adsenseClientId} />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
