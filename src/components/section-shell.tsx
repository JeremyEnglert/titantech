import React from 'react'

import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

export type SectionShellProps = {
  background?: SectionBackground | null
  topDivider?: boolean | null
  /** Drop the space above so this block reads as part of the previous one. */
  joinPrevious?: boolean | null
  children: React.ReactNode
  /** Extra classes on the <section> itself, not the inner container. */
  className?: string
  /** Drop the max-width container — for blocks that manage their own width. */
  bleed?: boolean
  containerClassName?: string
}

// Painted surfaces. `none` is deliberately absent: it paints nothing, so the
// body's machined grid shows through.
const backgroundClasses: Record<Exclude<SectionBackground, 'none'>, string> = {
  tint: 'bg-graphite-850/60',
  deep: 'bg-graphite-900',
  sheen: 'steel-sheen',
}

/**
 * The single place the painted/transparent spacing rule is applied. A block
 * that paints gets its air from interior padding; a block that doesn't gets
 * the collapsing `default-block-margin`. Doing this in one component is what
 * keeps every gap on the site identical — see CLAUDE.md.
 */
export function SectionShell({
  background,
  topDivider,
  joinPrevious,
  children,
  className,
  bleed = false,
  containerClassName,
}: SectionShellProps) {
  const painted = Boolean(background) && background !== 'none'

  return (
    <section
      className={cn(
        'relative w-full',
        painted
          ? cn('painted-block-padding', backgroundClasses[background as Exclude<SectionBackground, 'none'>])
          : 'default-block-margin',
        // At the seam, the block above contributes a full step of its own —
        // interior padding if it paints, a collapsing margin if it doesn't —
        // and this block cannot see it to cancel it. The negative margin
        // reaches back over exactly one step, then a short pad restores the
        // design's tight gap (the mockup nests the stat row 32px under the
        // list it belongs to). Intended for a continuation of the same
        // surface: this block is pulled over the one above, so a different
        // background here would clip it.
        joinPrevious && '-mt-20 pt-8 lg:-mt-28 lg:pt-10',
        topDivider && 'hairline-t',
        className,
      )}
    >
      {/* The tint reads as flat without the grid showing through it, and the
          sheen band wants the coarse drafting crosshatch over the brushed
          metal — both are decorative, so they sit behind the content. */}
      {background === 'tint' && (
        <div className="pointer-events-none absolute inset-0 bg-machined opacity-50" aria-hidden="true" />
      )}
      {background === 'sheen' && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-crosshatch opacity-40" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(800px 400px at 85% 50%, rgba(214,40,40,0.16), transparent 60%)',
            }}
          />
        </>
      )}

      {bleed ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <div className={cn('relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8', containerClassName)}>
          {children}
        </div>
      )}
    </section>
  )
}
