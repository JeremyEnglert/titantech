import type { Metadata } from 'next'
import { siteConfig } from './site-config'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteConfig.description,
  images: [
    {
      url: `${siteConfig.url}${siteConfig.ogImage}`,
    },
  ],
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
