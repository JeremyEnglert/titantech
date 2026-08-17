import React from 'react'
import type { SerializedEditorState } from 'lexical'

import RichText from '@/components/rich-text'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'

export type RichTextBlockProps = {
  content?: SerializedEditorState | null
  width?: ('narrow' | 'full') | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

// `RichText` already sets `max-w-none`; this overrides it, so the reading
// measure is the block's decision rather than the prose defaults'.
const widthClasses: Record<'narrow' | 'full', string> = {
  narrow: 'max-w-3xl',
  full: 'max-w-none',
}

export function RichTextBlock({ content, width, background, topDivider, joinPrevious }: RichTextBlockProps) {
  if (!content) return null

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      <RichText data={content} className={widthClasses[width ?? 'narrow']} />
    </SectionShell>
  )
}
