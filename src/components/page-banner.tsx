import React from 'react'

import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

export type PageBannerProps = {
  eyebrow?: string | null
  title: string
  intro?: string | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

export function PageBanner({ eyebrow, title, intro, background, topDivider, joinPrevious }: PageBannerProps) {
  const painted = Boolean(background) && background !== 'none'

  return (
    // `!my-0` drops the transparent-block margin so the banner sits flush under
    // the sticky header; the closing hairline is at the bottom, where the page
    // content begins. The crosshatch only paints when nothing else does —
    // otherwise it would replace the editor's chosen surface.
    <SectionShell
      background={background}
      topDivider={topDivider}
      joinPrevious={joinPrevious}
      className={cn(
        'hairline-b overflow-hidden pt-16 pb-14 lg:pt-24 lg:pb-20 !my-0',
        !painted && 'bg-crosshatch',
      )}
    >
      {eyebrow && (
        <div className="reveal-load mb-5" style={{ animationDelay: '0.05s' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}

      <div className="reveal-load" style={{ animationDelay: '0.18s' }}>
        <SectionTitle as="h1">{title}</SectionTitle>
      </div>

      {intro && (
        <p
          className="reveal-load mt-6 max-w-2xl text-[15px] leading-relaxed text-steel-300"
          style={{ animationDelay: '0.31s' }}
        >
          {intro}
        </p>
      )}
    </SectionShell>
  )
}
