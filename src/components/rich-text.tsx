import React from 'react'
import type {
  DefaultNodeTypes,
  SerializedLinkNode,
  DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  if (!doc || typeof doc.value !== 'object' || doc.value === null) return '#'

  const value = doc.value as { slug?: string | null; url?: string | null; filename?: string | null }

  if (doc.relationTo === 'media') {
    return value.url ?? (value.filename ? `/api/media/file/${value.filename}` : '#')
  }
  if (!value.slug) return '#'
  if (doc.relationTo === 'posts') return `/posts/${value.slug}`
  return value.slug === 'home' ? '/' : `/${value.slug}`
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

type Props = {
  data: DefaultTypedEditorState | SerializedEditorState | null | undefined
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * Long-form prose. The `payload-richtext` class is the hook the typography
 * overrides in globals.css hang off; `prose-invert` is unconditional because
 * this site has no light mode.
 */
export default function RichText(props: Props) {
  const { className, enableProse = true, data, ...rest } = props
  if (!data) return null

  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data as SerializedEditorState}
      className={cn(
        'payload-richtext',
        enableProse &&
          'prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-steel-50 prose-p:text-steel-200 prose-p:leading-relaxed prose-a:text-ember prose-a:no-underline hover:prose-a:underline prose-strong:text-steel-50 prose-li:text-steel-200 prose-hr:border-border',
        className,
      )}
      {...rest}
    />
  )
}

/**
 * Short copy inside a block's own layout. Deliberately not `prose`: the
 * surrounding block owns the measure and the type scale, and prose's own
 * margins would fight the block's grid.
 */
export function BodyRichText({
  data,
  className,
}: {
  data: DefaultTypedEditorState | SerializedEditorState | null | undefined
  className?: string
}) {
  if (!data) return null

  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data as SerializedEditorState}
      className={cn(
        'payload-richtext text-sm leading-relaxed text-steel-300 [&_a]:text-ember [&_a:hover]:underline [&_p+p]:mt-3 [&_strong]:text-steel-50 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5',
        className,
      )}
    />
  )
}
