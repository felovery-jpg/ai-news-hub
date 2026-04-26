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

/* ===== Inline Critical Styles (bypasses Vercel CSS bundling issue) ===== */
const CRITICAL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
body{background:#0a0a0f;color:#ededed;font-size:16px;line-height:1.6}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0a0f}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
::selection{background:rgba(168,85,247,0.25);color:#fff}
a{text-decoration:none;color:inherit}img{max-width:100%;display:block}

/* Layout */
.flex{display:flex}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-1{flex:1}.grid{display:grid}.block{display:block}.inline-flex{display:inline-flex}.relative{position:relative}.absolute{position:absolute}.overflow-hidden{overflow:hidden}.min-w-0{min-width:0}.flex-shrink-0{flex-shrink:0}
.items-center{align-items:center}.items-start{align-items:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}
.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}
.p-0{padding:0}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-14{padding-top:3.5rem;padding-bottom:3.5rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.mt-8{margin-top:2rem}.mt-20{margin-top:5rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.ml-auto{margin-left:auto}.mx-auto{margin-left:auto;margin-right:auto}.-mx-2{margin-left:-.5rem;margin-right:-.5rem}
.w-full{width:100%}.w-8{width:2rem}.w-14{width:3.5rem}.h-8{height:2rem}.h-14{height:3.5rem}.h-16{height:4rem}.h-20{height:5rem}.min-h-screen{min-height:100vh}
.text-xs{font-size:11px;line-height:1.4}.text-sm{font-size:13px;line-height:1.5}.text-base{font-size:15px;line-height:1.5}.text-lg{font-size:18px;line-height:1.5}.text-xl{font-size:20px;line-height:1.4}.text-2xl{font-size:24px;line-height:1.3}.text-3xl{font-size:30px;line-height:1.2}.text-4xl{font-size:36px;line-height:1.2}.text-5xl{font-size:48px;line-height:1.1}
.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.font-black{font-weight:900}.font-light{font-weight:300}
.uppercase{text-transform:uppercase}.tracking-tight{letter-spacing:-.02em}.tracking-widest{letter-spacing:.15em}.text-center{text-align:center}
.leading-snug{line-height:1.35}.leading-relaxed{line-height:1.65}.leading-tight{line-height:1.2}
.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.text-white{color:#fff}.text-gray-200{color:#e5e7eb}.text-gray-300{color:#d1d5db}.text-gray-400{color:#9ca3af}.text-gray-500{color:#6b7280}.text-gray-600{color:#4b5563}.text-gray-700{color:#374151}
.text-purple-300{color:#d8b4fe}.text-purple-400{color:#c084fc}.text-cyan-300{color:#67e8f9}.text-cyan-400{color:#22d3ee}.text-green-400{color:#34d399}.text-pink-400{color:#f472b6}.text-blue-400{color:#60a5fa}.text-red-400{color:#f87171}.text-amber-400{color:#fbbf24}
.bg-white\/\[0\.03\]{background:rgba(255,255,255,.03)}.bg-white\/\[0\.04\]{background:rgba(255,255,255,.04)}.bg-white\/\[0\.05\]{background:rgba(255,255,255,.05)}.bg-white\/\[0\.06\]{background:rgba(255,255,255,.06)}
.bg-gray-900{background:#111827}.bg-gray-950{background:#030712}
.border{border-width:1px;border-style:solid}.border-b{border-bottom-width:1px;border-style:solid}.border-t{border-top-width:1px;border-style:solid}
.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}
.border-white\/\[0\.04\]{border-color:rgba(255,255,255,.04)}.border-white\/\[0\.06\]{border-color:rgba(255,255,255,.06)}.border-transparent{border-color:transparent}.border-purple-500\/30{border-color:rgba(168,85,247,.3)}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}
.opacity-50{opacity:.5}.opacity-80{opacity:.8}
.cursor-pointer{cursor:pointer}
.sticky{position:sticky}.top-0{top:0}.z-50{z-index:50}
.object-cover{object-fit:cover}
.transition-all{transition-property:all;transition-duration:300ms}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-duration:200ms}.transition-transform{transition-property:transform;transition-duration:500ms}
.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.backdrop-blur-xl{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}

.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.max-w-2xl{max-width:42rem}.max-w-md{max-width:28rem}.max-w-sm{max-width:24rem}.max-w-7xl{max-width:80rem}
.hidden{display:none!important}

@media(min-width:768px){.md\:block{display:block}.md\:flex{display:flex}.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.lg\:col-span-4{grid-column:span 4/span 4}.lg\:col-span-8{grid-column:span 8/span 8}}

@media(max-width:767px){.md\:hidden{display:none!important}}
@media(min-width:640px){.sm\:w-56{width:14rem}.sm\:min-h-\[180px\]{min-height:180px}.sm\:flex-row{flex-direction:row}}

/* Hover states */
.group:hover .group-hover\:translate-x-1{transform:translateX(.25rem)}.group:hover .group-hover\:opacity-100{opacity:1}.group:hover .group-hover\:opacity-0{opacity:0}
.group:hover .group-hover\:text-purple-300{color:#d8b4fe}.group:hover .group-hover\:text-purple-400{color:#c084fc}.group:hover .group-hover\:text-white{color:#fff}
.group:hover .group-hover\:bg-white\/\[0\.03\]{background:rgba(255,255,255,.03)}.group:hover .group-hover\:bg-white\/\[0\.08\]{background:rgba(255,255,255,.08)}
.group:hover .group-hover\:shadow-purple-500\/25{box-shadow:0 8px 25px rgba(168,85,247,.25)}
.hover\:text-purple-300:hover{color:#d8b4fe}.hover\:text-white:hover{color:#fff}.hover\:text-gray-400:hover{color:#9ca3af}
.hover\:text-cyan-300:hover{color:#67e8f9}
.hover\:bg-white\/\[0\.04\]:hover{background:rgba(255,255,255,.04)}.hover\:bg-white\/\[0\.05\]:hover{background:rgba(255,255,255,.05)}.hover\:bg-white\/\[0\.06\]:hover{background:rgba(255,255,255,.06)}.hover\:bg-white\/\[0\.08\]:hover{background:rgba(255,255,255,.08)}
.hover\:bg-purple-700:hover{background:#7e22ce}.hover\:bg-purple-500:hover{background:#a855f7}
.hover\:shadow-purple-500\/25:hover{box-shadow:0 8px 25px rgba(168,85,247,.25)}
.hover\:from-purple-500:hover{--tw-gradient-from:#a855f7}
.hover\:to-fuchsia-500:hover{--tw-gradient-to:#c026d3}

/* Gradients */
.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}
.from-purple-500{--tw-gradient-from-position:var(--tw-gradient-via-position,var(--tw-gradient-to-position));--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to);--tw-gradient-from:#a855f7}
.to-cyan-5{--tw-gradient-to:#22d3ee}
.from-purple-600{--tw-gradient-from:#9333ea}.to-fuchsia-600{--tw-gradient-to:#c026d3}
.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
.from-purple-900\/50{--tw-gradient-from:rgba(88,28,135,.5)}.to-cyan-900\/50{--tw-gradient-to:rgba(21,94,117,.5)}
.bg-gradient-to-t{background-image:linear-gradient(to top,var(--tw-gradient-stops))}
.from-black\/90{--tw-gradient-from:rgba(0,0,0,.9)}.via-black\/40{--tw-gradient-via:rgba(0,0,0,.4)}.to-transparent{--tw-gradient-to:transparent}

.bg-clip-text{-webkit-background-clip:text;background-clip:text;color:transparent}

/* Glass */
.glass{background:rgba(17,17,36,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.06);border-radius:.75rem}
.gradient-border{position:relative}
.gradient-border::before{content:'';position:absolute;inset:0;padding:1px;border-radius:inherit;background:linear-gradient(135deg,rgba(168,85,247,.3),rgba(34,211,238,.12),transparent);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none}

.hero-bg{background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(168,85,247,.13),transparent),radial-gradient(ellipse 60% 40% at 80% 10%,rgba(34,211,238,.07),transparent),radial-gradient(ellipse 50% 30% at 20% 50%,rgba(59,130,246,.05),transparent)}
.grid-pattern{background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:40px 40px}
.glow-text{text-shadow:0 0 30px rgba(168,85,247,.35),0 0 60px rgba(168,85,247,.15)}

@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
.animate-pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.animate-float{animation:float 4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
.img-zoom{overflow:hidden}.img-zoom img{transition:transform .5s cubic-bezier(.25,.46,.45,.94)}.img-zoom:hover img{transform:scale(1.08)}
.live-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px rgba(34,197,94,.6)}

.tag-news{background:rgba(59,130,246,.15);color:#60a5fa;border:1px solid rgba(59,130,246,.2)}
.tag-research{background:rgba(168,85,247,.15);color:#c084fc;border:1px solid rgba(168,85,247,.2)}
.tag-tools{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.2)}
.tag-tutorial{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)}
.tag-dev{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.2)}
.tag-newsletter{background:rgba(236,72,153,.15);color:#f472b6;border:1px solid rgba(236,72,153,.2)}
.tag-tech{background:rgba(34,211,238,.15);color:#22d3ee;border:1px solid rgba(34,211,238,.2)}

.grad-hero{background-image:linear-gradient(to right,#a855f7,#d946ef,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}

footer{background:#07070a}
article{transition:all 250ms ease}
header nav a{transition:color 150ms ease}
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
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
