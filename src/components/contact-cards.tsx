import React from 'react'

import { CMSLink } from '@/components/cms-link'
import { Icon, type IconName } from '@/components/icons'
import { LocationMap } from '@/components/location-map'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { resolveLink } from '@/lib/resolve-link'
import { cn } from '@/lib/utils'

type ContactCardLink = {
  linkType?: ('custom' | 'internal') | null
  url?: string | null
  doc?: { relationTo: string; value: unknown } | null
  newTab?: boolean | null
}

type ContactCard = {
  icon?: IconName | null
  label: string
  value: string
  secondary?: string | null
  link?: ContactCardLink | null
  id?: string | null
}

export type ContactCardsProps = {
  eyebrow?: string | null
  title?: string | null
  cards?: ContactCard[] | null
  showMap?: boolean | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

// `whitespace-pre-line` rather than splitting on `\n`, so a two-line address
// reads the same whether or not the card is wrapped in a link — CMSLink renders
// its own text node and cannot take children.
const valueClasses = 'mt-1 whitespace-pre-line font-display text-xl font-bold text-steel-50'

export function ContactCards({
  eyebrow,
  title,
  cards,
  showMap,
  background,
  topDivider,
  joinPrevious,
}: ContactCardsProps) {
  const rows = cards?.filter(Boolean) ?? []

  const columnClasses =
    rows.length === 1
      ? 'md:grid-cols-1'
      : rows.length === 3
        ? 'lg:grid-cols-3'
        : rows.length >= 4
          ? 'lg:grid-cols-4'
          : 'lg:grid-cols-2'

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      {(eyebrow || title) && (
        <div className="mb-12">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <SectionTitle>{title}</SectionTitle>
        </div>
      )}

      {rows.length > 0 && (
        // The `gap-px` over the lighter surface IS the cell border, so an
        // under-filled row shows as an empty lit cell rather than nothing.
        // Match the column count to the cards actually present.
        <div className={cn('grid gap-px hairline bg-graphite-500/30 md:grid-cols-2', columnClasses)}>
          {rows.map((card, index) => {
            const linked = resolveLink(card.link) !== null

            return (
              <div
                key={card.id ?? index}
                className="bg-graphite-850 p-7 transition-colors hover:bg-graphite-800"
              >
                {card.icon && (
                  <span className="mb-5 grid h-11 w-11 place-items-center hairline bg-graphite-900 text-ember">
                    <Icon name={card.icon} className="size-5" />
                  </span>
                )}

                <p className="text-[10px] uppercase tracking-[0.18em] text-steel-300">
                  {card.label}
                </p>

                {linked ? (
                  <CMSLink
                    link={card.link}
                    fallbackLabel={card.value}
                    plain
                    className={cn('block', valueClasses, 'transition-colors hover:text-ember')}
                  />
                ) : (
                  <p className={valueClasses}>{card.value}</p>
                )}

                {card.secondary && (
                  <p className="mt-0.5 text-sm text-steel-300">{card.secondary}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showMap && <LocationMap className="mt-px h-80 w-full sm:h-[420px]" />}

    </SectionShell>
  )
}
