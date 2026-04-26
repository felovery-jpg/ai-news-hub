'use client'

type Props = {
  clientId: string
}

export default function GoogleAdsense({ clientId }: Props) {
  if (!clientId) return null
  
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  )
}
