import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { siteConfig } from '@/utilities/site-config'

// The starter's revalidate hooks already fire `revalidateTag('pages-sitemap')`
// and `('posts-sitemap')` — there was simply no route listening for them.
const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      draft: false,
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })
    return result.docs
  },
  ['pages-sitemap'],
  { tags: ['pages-sitemap'] },
)

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      draft: false,
      overrideAccess: false,
      pagination: false,
      limit: 1000,
      select: { slug: true, updatedAt: true },
    })
    return result.docs
  },
  ['posts-sitemap'],
  { tags: ['posts-sitemap'] },
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([getPagesSitemap(), getPostsSitemap()])

  return [
    ...pages.map((page) => ({
      url: page.slug === 'home' ? siteConfig.url : `${siteConfig.url}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      // The home page and the quote page are the two that matter commercially.
      priority: page.slug === 'home' ? 1 : 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
      priority: 0.5,
    })),
  ]
}
