import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { CapabilityGrid } from '@/components/capability-grid'
import { ContactCards } from '@/components/contact-cards'
import { CtaBand } from '@/components/cta-band'
import { FormBlock } from '@/components/form-block'
import { Hero } from '@/components/hero'
import { MediaWithText } from '@/components/media-with-text'
import { PageBanner } from '@/components/page-banner'
import { RichTextBlock } from '@/components/rich-text-block'
import { ServiceCards } from '@/components/service-cards'
import { Stats } from '@/components/stats'
import { ValueProps } from '@/components/value-props'
import { cn } from '@/lib/utils'

type PageContent = NonNullable<NonNullable<Page['content']>>
type PageBlock = PageContent[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- block components accept varying props per block
const blockComponents: Partial<Record<PageBlock['blockType'], React.ComponentType<any>>> = {
  hero: Hero,
  pageBanner: PageBanner,
  serviceCards: ServiceCards,
  valueProps: ValueProps,
  stats: Stats,
  ctaBand: CtaBand,
  contactCards: ContactCards,
  capabilityGrid: CapabilityGrid,
  mediaWithText: MediaWithText,
  richText: RichTextBlock,
  form: FormBlock,
}

// Blocks that render their own <h1>. If you add another block that emits an
// <h1>, add it here too, or a page carrying both will ship two.
export const BLOCKS_WITH_H1 = new Set<string>(['hero', 'pageBanner'])

// Block spacing lives in SectionShell: transparent blocks apply the
// `default-block-margin` utility, painted blocks apply nothing and get their
// air from their neighbors' margins. Touching margins collapse to the LARGEST
// one at the junction, so Extra Spacing works by outbidding the standard gap.
// Collapsing requires normal block flow — never make this container flex/grid.
const extraSpacingTopClasses: Record<string, string> = {
  '8': 'mt-28 lg:mt-36',
  '16': 'mt-36 lg:mt-44',
  '24': 'mt-44 lg:mt-52',
}

const extraSpacingBottomClasses: Record<string, string> = {
  '8': 'mb-28 lg:mb-36',
  '16': 'mb-36 lg:mb-44',
  '24': 'mb-44 lg:mb-52',
}

type BlockSettings = {
  anchorId?: string | null
  spacingTop?: string | null
  spacingBottom?: string | null
  hidden?: boolean | null
}

function getBlockSettings(block: PageBlock) {
  return 'blockSettings' in block ? (block.blockSettings as BlockSettings | undefined) : undefined
}

function getExtraSpacingClasses(block: PageBlock) {
  const settings = getBlockSettings(block)
  if (!settings) return undefined

  const mt = settings.spacingTop ? extraSpacingTopClasses[settings.spacingTop] : undefined
  const mb = settings.spacingBottom ? extraSpacingBottomClasses[settings.spacingBottom] : undefined

  return cn(mt, mb) || undefined
}

export const RenderBlocks: React.FC<{ blocks: PageContent }> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks
        .filter((block) => !getBlockSettings(block)?.hidden)
        .map((block, index) => {
          const { blockType } = block
          if (!blockType || !(blockType in blockComponents)) return null

          const Block = blockComponents[blockType]
          if (!Block) return null

          const anchorId = getBlockSettings(block)?.anchorId || undefined

          // A <div>, not a <section>: every block emits its own <section> via
          // SectionShell, and nesting the two produces a landmark with no
          // accessible name wrapping one that has a heading.
          return (
            <div
              key={index}
              id={anchorId}
              data-block={blockType}
              className={cn(getExtraSpacingClasses(block), anchorId && 'scroll-mt-20')}
            >
              <Block {...(block as React.ComponentProps<typeof Block>)} />
            </div>
          )
        })}
    </Fragment>
  )
}
