export type ResolvedLink = {
  href: string
  label: string | null
  newTab: boolean
  external: boolean
  /**
   * The href points at an uploaded file, or at a tel:/mailto: URL, rather than
   * an app route. Those must not go through next/link: it would attempt a
   * client-side navigation to a path the router has no route for, and prefetch
   * the target on hover.
   */
  isFile: boolean
}

/**
 * The stored shape, mirroring what Lexical's LinkFeature writes so one
 * resolver serves block links and rich-text link nodes alike.
 */
export type LinkValue = {
  label?: string | null
  linkType?: ('custom' | 'internal') | null
  url?: string | null
  doc?: { relationTo: string; value: unknown } | null
  newTab?: boolean | null
}

const collectionPrefixes: Record<string, string> = {
  pages: '',
  posts: 'posts',
}

function isNonRouteHref(href: string) {
  return /^(tel:|mailto:|sms:)/i.test(href) || /\.[a-z0-9]{2,5}(\?|#|$)/i.test(href)
}

function buildLink(
  href: string,
  label: string | null,
  newTab: boolean,
  forceFile = false,
): ResolvedLink {
  const external = /^https?:\/\//i.test(href)
  return {
    href,
    label,
    newTab,
    external,
    isFile: forceFile || isNonRouteHref(href),
  }
}

function resolveDocHref(relationTo: string, value: unknown): string | null {
  // depth: 0 gives a bare id, which we can't route from — the caller has to
  // query with depth >= 1 for internal links to resolve.
  if (!value || typeof value !== 'object') return null

  const doc = value as { slug?: string | null; url?: string | null; filename?: string | null }

  if (relationTo === 'media') {
    return doc.url ?? (doc.filename ? `/api/media/file/${doc.filename}` : null)
  }

  if (!doc.slug) return null
  if (relationTo === 'pages') return doc.slug === 'home' ? '/' : `/${doc.slug}`

  const prefix = collectionPrefixes[relationTo]
  return prefix === undefined ? null : prefix ? `/${prefix}/${doc.slug}` : `/${doc.slug}`
}

/**
 * Accepts the structured link object OR a bare string. Returns null when there
 * is nothing to link to, so callers can render nothing rather than an empty
 * anchor — which is why every component guards on the result instead of the
 * raw field.
 */
export function resolveLink(value: unknown, fallbackLabel?: string | null): ResolvedLink | null {
  if (typeof value === 'string') {
    return value ? buildLink(value, fallbackLabel ?? null, false) : null
  }
  if (!value || typeof value !== 'object') return null

  const link = value as LinkValue
  const label = link.label ?? fallbackLabel ?? null
  const newTab = Boolean(link.newTab)

  if (link.linkType === 'internal') {
    const href = link.doc ? resolveDocHref(link.doc.relationTo, link.doc.value) : null
    return href ? buildLink(href, label, newTab, link.doc?.relationTo === 'media') : null
  }

  // Anything else is treated as a custom URL, including a legacy row that has
  // a url but no linkType at all.
  return link.url ? buildLink(link.url, label, newTab) : null
}
