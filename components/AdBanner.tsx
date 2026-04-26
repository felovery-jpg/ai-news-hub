'use client'

import { useEffect, useRef } from 'react'

type Props = {
  slot: string
  format?: 'horizontal' | 'rectangle' | 'responsive'
  className?: string
}

export default function AdBanner({ slot, format = 'responsive', className = '' }: Props) {
  const adRef = useRef<HTMLModElement>(null)
  
  useEffect(() => {
    if (!slot) return
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [slot])
  
  if (!slot) return null
  
  const sizeMap = {
    horizontal: { width: '728', height: '90' },
    rectangle: { width: '300', height: '250' },
    responsive: { width: '100%', height: 'auto' },
  }
  
  return (
    <div className={`my-4 flex justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  )
}
