import type { Metadata } from 'next'

import { siteConfig } from './site-config'
import { buildOgImageUrl } from './og-url'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteConfig.description,
  images: [{ url: buildOgImageUrl({ title: siteConfig.tagline }), width: 1200, height: 630 }],
  siteName: siteConfig.name,
  title: siteConfig.title,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
