import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

import { seedContext } from './payload-client'

type PageSeed = {
  slug: string
  title: string
  content: unknown[]
  meta?: { title?: string; description?: string }
}

/**
 * Upsert by slug, never blind-create — every seed script is expected to be
 * safe to re-run, and creating on each run would leave duplicate pages that
 * both answer the same route.
 */
export async function upsertPage(payload: Payload, page: PageSeed) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: page.slug } },
    limit: 1,
    depth: 0,
  })

  const data = {
    title: page.title,
    slug: page.slug,
    content: page.content,
    _status: 'published',
    ...(page.meta ? { meta: page.meta } : {}),
  } as unknown as RequiredDataFromCollectionSlug<'pages'>

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    await payload.update({ collection: 'pages', id, data, ...seedContext })
    console.log(`  updated /${page.slug === 'home' ? '' : page.slug} (${id})`)
    return id
  }

  const created = await payload.create({ collection: 'pages', data, ...seedContext })
  console.log(`  created /${page.slug === 'home' ? '' : page.slug} (${created.id})`)
  return created.id
}
