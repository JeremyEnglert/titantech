import type { MetadataRoute } from 'next'

import { siteConfig } from '@/utilities/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin and the API are not content; letting a crawler walk them
      // wastes crawl budget on pages that always return a login screen.
      disallow: ['/admin', '/api', '/preview', '/exit-preview'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
