export const siteConfig = {
  name: 'Titantech CNC',
  title: 'Titantech CNC — 5-Axis Precision CNC Machining | Tucson, AZ',
  description:
    'Precision 3-axis and 5-axis CNC milling and CNC turning for complex, tight-tolerance components. Prototype to production in stainless, aluminum, tool steels, titanium and engineering plastics.',
  /** Short enough to set as display type on a share card. */
  tagline: 'Complex parts. Precision machined.',
  // One variable, not two. The starter read NEXT_PUBLIC_SITE_URL here while
  // the live-preview listener read NEXT_PUBLIC_URL, so in production every
  // canonical and OG URL silently stayed http://localhost:3000.
  //
  // The Vercel fallback matters because that failure is invisible: the site
  // builds and renders fine while every canonical, OG tag and sitemap entry
  // points at localhost. Vercel injects the production domain on its own, so
  // the only case still needing NEXT_PUBLIC_URL is a custom domain.
  url:
    process.env.NEXT_PUBLIC_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
} as const
