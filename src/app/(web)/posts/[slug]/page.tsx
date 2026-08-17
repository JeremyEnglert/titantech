import type { Metadata } from 'next'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import RichText from '@/components/rich-text'
import { Eyebrow } from '@/components/section-heading'
import { generateMeta } from '@/utilities/generate-meta'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

// `populatedAuthors` is added by the Posts afterRead hook, so it exists at
// runtime but never lands in the generated types.
type PostAuthor = { id: string; name?: string | null }
type PostWithAuthors = { populatedAuthors?: PostAuthor[] | null }

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  // The starter dereferenced `post.title` without this guard, so a missing
  // post threw a 500 instead of rendering a 404.
  if (!post) notFound()

  const authors = (post as PostWithAuthors).populatedAuthors ?? []

  return (
    <article className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <Eyebrow className="mb-5">Notes</Eyebrow>
        <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-steel-50 sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-steel-300">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
          {authors.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>By {authors.map((author) => author.name).filter(Boolean).join(', ')}</span>
            </>
          )}
        </div>

        <RichText className="mt-10" data={post.content} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 1,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
