export const siteConfig = {
  name: 'Titantech CNC',
  title: 'Titantech CNC — Precision Machining | Tucson, AZ',
  description:
    'Titantech CNC is a precision machining job shop in Tucson, AZ. 3-axis milling, 4th & 5th axis machining, CNC turning, laser engraving and custom parts to ±0.0005". Request a quote.',
  // One variable, not two. The starter read NEXT_PUBLIC_SITE_URL here while
  // the live-preview listener read NEXT_PUBLIC_URL, so in production every
  // canonical and OG URL silently stayed http://localhost:3000.
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
} as const
