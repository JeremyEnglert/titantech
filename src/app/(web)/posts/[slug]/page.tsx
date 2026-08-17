import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generate-meta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/rich-text'
import type { PostWithPopulatedAuthors } from '@/payload-types-extended'


export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })


  return (
    <article className="pt-16 pb-16">
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4 text-center">{post.title}</h1>
          <div className="text-gray-600 text-center mb-8">
            {post.createdAt && (
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            )}
            {renderAuthors(post)}
          </div>
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} enableProse={true} />
        </div>
      </div>
    </article>
  )
}

// Helper function to render authors with proper formatting
function renderAuthors(post: PostWithPopulatedAuthors) {
  // Only show authors if populatedAuthors exists and has items
  if (post.populatedAuthors && post.populatedAuthors.length > 0) {
    return (
      <>
        <span className="mx-2">•</span>
        <span>By {post.populatedAuthors.map((author, i: number) => (
          <React.Fragment key={author.id}>
            {i > 0 && i === post.populatedAuthors!.length - 1 && ' and '}
            {i > 0 && i < post.populatedAuthors!.length - 1 && ', '}
            {author.name}
          </React.Fragment>
        ))}</span>
      </>
    )
  }

  return null;
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
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})