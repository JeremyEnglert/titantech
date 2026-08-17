import React from 'react'

import { CMSLink } from '@/components/cms-link'
import { Icon, type IconName } from '@/components/icons'
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
  mapEmbedUrl?: string | null
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
  mapEmbedUrl,
  background,
  topDivider,
  joinPrevious,
}: ContactCardsProps) {
  const rows = cards?.filter(Boolean) ?? []
  const mapSrc = mapEmbedUrl?.trim()

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      {(eyebrow || title) && (
        <div className="mb-12">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <SectionTitle>{title}</SectionTitle>
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid gap-px hairline bg-graphite-500/30 md:grid-cols-2 lg:grid-cols-4">
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

      {mapSrc ? (
        <iframe
          src={mapSrc}
          title="Location map"
          className="mt-px h-44 w-full hairline sm:h-56"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="relative mt-px grid h-44 place-items-center text-center hairline bg-graphite-850 sm:h-56">
          <div className="flex flex-col items-center gap-3 px-6">
            <Icon name="pin" className="size-8 text-steel-300" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-steel-300">
              Map placeholder
            </span>
          </div>
        </div>
      )}
    </SectionShell>
  )
}
