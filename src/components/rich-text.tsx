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
          cn(
            'prose prose-invert max-w-none',
            // Headings carry the display face and an ember rule above them, so
            // a run of prose reads as a set of labelled sections rather than
            // one undifferentiated wall of monospace.
            'prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-steel-50',
            'prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:font-extrabold prose-h2:leading-none',
            'prose-h2:border-t prose-h2:border-[color:var(--border)] prose-h2:pt-8',
            // Order matters: `prose-h2:first:` scopes the reset to an h2 that
            // is itself the first child. Writing it `first:prose-h2:` instead
            // targets h2s inside a first-child container, which silently
            // stripped the rule from every heading rather than just the top one.
            'prose-h2:first:mt-0 prose-h2:first:border-t-0 prose-h2:first:pt-0',
            'prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold',
            'prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-steel-300',
            'prose-strong:text-steel-50 prose-strong:font-bold',
            'prose-a:text-ember prose-a:no-underline hover:prose-a:underline',
            'prose-li:text-steel-300 prose-li:marker:text-ember',
            'prose-hr:border-[color:var(--border)]',
          ),
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
