import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './merge-open-graph'
import { buildOgImageUrl } from './og-url'
import { siteConfig } from './site-config'

/**
 * An editor-supplied SEO image wins when one is set; otherwise the share card
 * is generated at /api/og from the page's own title. The starter shipped a
 * static `/og-image.png` that still said "Payload Tailwind Starter", which is
 * the kind of thing nobody sees until a link is already posted somewhere.
 */
const getUploadedImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
): string | undefined => {
  if (!image || typeof image !== 'object' || !('url' in image)) return undefined

  const ogUrl = image.sizes?.og?.url
  const url = ogUrl ?? image.url
  if (!url) return undefined

  // Payload stores media URLs as site-relative paths; OG needs absolute.
  return url.startsWith('http') ? url : `${siteConfig.url}${url}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const featuredImage = doc && 'featuredImage' in doc ? doc.featuredImage : undefined
  const uploaded = getUploadedImageURL(doc?.seo?.image ?? featuredImage ?? null)

  const excerpt = doc && 'excerpt' in doc ? (doc.excerpt as string | undefined) : undefined
  const description = doc?.seo?.description || excerpt || siteConfig.description

  // SEO title is used verbatim; a bare doc title lets the layout template
  // append the site name.
  const title = doc?.seo?.title
    ? { absolute: doc.seo.title }
    : doc?.title
      ? doc.title
      : { absolute: siteConfig.title }

  // Prefer the SEO title for the share card, minus the "| Tucson, AZ" tail —
  // that suffix earns its place in a search result but is noise at display
  // size. The bare document title is too thin to share ("Services"), so it is
  // only the fallback.
  const seoTitle = doc?.seo?.title?.split(' | ')[0]?.trim()
  const cardTitle =
    seoTitle || (doc?.title && doc.title !== 'Home' ? doc.title : siteConfig.tagline)
  const ogImage = uploaded ?? buildOgImageUrl({ title: cardTitle })

  // The same pages answer on the apex, on www, and on the project's
  // .vercel.app alias. Only the first is canonical; without this tag the other
  // two are indexable duplicates competing with it. Relative is enough —
  // metadataBase in the root layout resolves it against siteConfig.url.
  const isPost = Boolean(doc && 'excerpt' in doc)
  const pathname = !doc?.slug
    ? '/'
    : isPost
      ? `/posts/${doc.slug}`
      : doc.slug === 'home'
        ? '/'
        : `/${doc.slug}`

  return {
    alternates: { canonical: pathname },
    description,
    openGraph: mergeOpenGraph({
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      title: typeof title === 'string' ? title : title.absolute,
      url: pathname,
    }),
    title,
    twitter: {
      card: 'summary_large_image',
      title: typeof title === 'string' ? title : title.absolute,
      description,
      images: [ogImage],
    },
  }
}
