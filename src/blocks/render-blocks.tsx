import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { Hero } from '@/components/hero'
import { cn } from '@/lib/utils'

type PageContent = NonNullable<NonNullable<Page['content']>>
type PageBlock = PageContent[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- block components accept varying props per block
const blockComponents: Partial<Record<PageBlock['blockType'], React.ComponentType<any>>> = {
  hero: Hero,
}

// Block spacing lives in the components: transparent blocks apply the
// `default-block-margin` utility (globals.css), painted blocks apply nothing
// and get their air from their neighbors' margins. Touching margins collapse
// to the LARGEST one at the junction, so Extra Spacing works by outbidding
// the standard gap: each option maps to standard + step, applied as a wrapper
// margin that collapses with everything else there. Collapsing requires
// normal block flow — never make the blocks container flex/grid.
const extraSpacingTopClasses: Record<string, string> = {
  '8': 'mt-24 md:mt-32',
  '16': 'mt-32 md:mt-40',
  '24': 'mt-40 md:mt-48',
}

const extraSpacingBottomClasses: Record<string, string> = {
  '8': 'mb-24 md:mb-32',
  '16': 'mb-32 md:mb-40',
  '24': 'mb-40 md:mb-48',
}

type BlockSettings = {
  spacingTop?: string | null
  spacingBottom?: string | null
  hidden?: boolean | null
}

function getBlockSettings(block: PageBlock) {
  return 'blockSettings' in block ? (block.blockSettings as BlockSettings | undefined) : undefined
}

function isBlockHidden(block: PageBlock) {
  return Boolean(getBlockSettings(block)?.hidden)
}

function getExtraSpacingClasses(block: PageBlock) {
  const settings = getBlockSettings(block)
  if (!settings) return undefined

  const mt = settings.spacingTop ? extraSpacingTopClasses[settings.spacingTop] : undefined
  const mb = settings.spacingBottom ? extraSpacingBottomClasses[settings.spacingBottom] : undefined

  return cn(mt, mb) || undefined
}

export const RenderBlocks: React.FC<{
  blocks: PageContent
}> = (props) => {
  const { blocks } = props

  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <Fragment>
      {blocks
        .filter((block) => !isBlockHidden(block))
        .map((block, index) => {
          const { blockType } = block

          if (!blockType || !(blockType in blockComponents)) {
            return null
          }

          const Block = blockComponents[blockType]
          if (!Block) {
            return null
          }

          return (
            <section data-block={blockType} className={getExtraSpacingClasses(block)} key={index}>
              <Block {...(block as React.ComponentProps<typeof Block>)} />
            </section>
          )
        })}
    </Fragment>
  )
}
