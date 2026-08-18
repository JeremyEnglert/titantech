import { siteConfig } from './site-config'

/**
 * Build the URL of a generated share card.
 *
 * Kept separate from `og-image.tsx` on purpose: that module imports
 * `next/og`, which drags Satori and its font machinery into anything that
 * touches it. Metadata is generated on every page render, so it should only
 * ever import this string builder.
 */
export function buildOgImageUrl(params: { title?: string; eyebrow?: string }): string {
  const search = new URLSearchParams()
  if (params.title) search.set('title', params.title)
  if (params.eyebrow) search.set('eyebrow', params.eyebrow)

  const query = search.toString()
  return `${siteConfig.url}/api/og${query ? `?${query}` : ''}`
}
