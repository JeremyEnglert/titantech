import React from 'react'
import Image from 'next/image'
import type { SerializedEditorState } from 'lexical'

import { CMSLink } from '@/components/cms-link'
import { Icon } from '@/components/icons'
import { BodyRichText } from '@/components/rich-text'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

type MediaWithTextImage = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type MediaWithTextButton = {
  label?: string | null
  linkType?: ('custom' | 'internal') | null
  url?: string | null
  doc?: { relationTo: string; value: unknown } | null
  newTab?: boolean | null
}

export type MediaWithTextProps = {
  /** A string when the page was queried at depth 0 — there is nothing to render then. */
  image?: MediaWithTextImage | string | null
  imagePosition?: ('left' | 'right') | null
  eyebrow?: string | null
  title?: string | null
  body?: SerializedEditorState | null
  button?: MediaWithTextButton | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

export function MediaWithText({
  image,
  imagePosition,
  eyebrow,
  title,
  body,
  button,
  background,
  topDivider,
  joinPrevious,
}: MediaWithTextProps) {
  const media = typeof image === 'object' && image !== null ? image : null

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden hairline bg-graphite-850',
            imagePosition === 'right' && 'lg:order-2',
          )}
        >
          {media?.url ? (
            <Image
              src={media.url}
              alt={media.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div className="flex flex-col items-center gap-3 px-6">
                <Icon name="image" className="size-8 text-steel-300" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-steel-300">
                  Image placeholder
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          <SectionTitle>{title}</SectionTitle>
          <BodyRichText data={body} className="mt-5 max-w-xl text-steel-200 sm:text-base" />
          <CMSLink link={button} variant="outline" size="lg" withArrow className="mt-8" />
        </div>
      </div>
    </SectionShell>
  )
}
