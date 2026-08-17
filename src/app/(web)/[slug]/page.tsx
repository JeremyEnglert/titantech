import type { Metadata } from 'next'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { RenderBlocks } from '@/blocks/render-blocks'
import { generateMeta } from '@/utilities/generate-meta'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return pages.docs?.filter((doc) => doc.slug !== 'home').map(({ slug }) => ({ slug })) ?? []
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({ slug })

  // The starter returned null here, which renders a blank 200 — a soft 404
  // that search engines index and users can't tell from a broken page.
  if (!page) notFound()

  const contentBlocks = Array.isArray(page.content) ? page.content : []

  // No padding on this wrapper: it would block the first block's margin from
  // collapsing and push a full-bleed hero away from the header.
  return <RenderBlocks blocks={contentBlocks} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({ slug })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    // depth 1 so link fields on blocks carry their target's slug — resolveLink
    // cannot route a bare id.
    depth: 1,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
