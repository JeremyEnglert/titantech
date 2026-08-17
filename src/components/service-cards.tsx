import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from 'lexical'

import { CMSLink } from '@/components/cms-link'
import { Icon, type IconName } from '@/components/icons'
import { BodyRichText } from '@/components/rich-text'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { resolveLink, type LinkValue } from '@/lib/resolve-link'
import { cn } from '@/lib/utils'

type RichTextValue = DefaultTypedEditorState | SerializedEditorState | null | undefined

type ServiceCard = {
  id?: string | null
  icon?: IconName | null
  title: string
  body?: RichTextValue
  link?: LinkValue | null
}

export type ServiceCardsProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  cards?: ServiceCard[] | null
  columns?: ('auto' | '2' | '3' | '4') | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

const explicitColumnClasses: Record<'2' | '3' | '4', string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * The 1px gap over a lighter background IS the cell border, so a row that does
 * not fill leaves that lighter surface showing as an empty cell. Auto therefore
 * narrows to the card count instead of always claiming the design's 3-up.
 */
function gridColumnClasses(columns: ServiceCardsProps['columns'], cardCount: number) {
  if (columns && columns !== 'auto') return explicitColumnClasses[columns]
  if (cardCount <= 1) return ''
  if (cardCount === 2) return 'sm:grid-cols-2'
  return explicitColumnClasses['3']
}

export function ServiceCards({
  eyebrow,
  title,
  intro,
  cards,
  columns,
  background,
  topDivider,
  joinPrevious,
}: ServiceCardsProps) {
  const items = cards ?? []
  if (items.length === 0) return null

  const hasHeader = Boolean(eyebrow || title || intro)

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      {hasHeader && (
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <SectionTitle>{title}</SectionTitle>
          </div>
          {intro && (
            <p className="max-w-md text-sm leading-relaxed text-steel-300">{intro}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          'grid gap-px bg-graphite-500/30 hairline',
          gridColumnClasses(columns, items.length),
        )}
      >
        {items.map((card, index) => (
          <article
            key={card.id ?? index}
            className="group relative bg-graphite-850 p-7 transition-colors hover:bg-graphite-800"
          >
            <span
              className="absolute left-0 top-0 h-0.5 w-0 bg-ember transition-all duration-500 group-hover:w-full"
              aria-hidden="true"
            />

            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center hairline bg-graphite-900 text-ember transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ember-glow">
                <Icon name={card.icon} className="size-6" />
              </span>
              <span className="font-mono text-[11px] text-steel-300">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-wide text-steel-50">
              {/* The stretched pseudo-element is what makes the whole card
                  clickable while the anchor's text stays the card title —
                  no hidden label, no click handler on a div. Resolved here
                  rather than trusting the group to exist: Payload writes an
                  empty link group for every card, and CMSLink renders nothing
                  for one, which would swallow the title. */}
              {resolveLink(card.link, card.title) ? (
                <CMSLink
                  link={card.link}
                  fallbackLabel={card.title}
                  plain
                  className="after:absolute after:inset-0 after:content-['']"
                />
              ) : (
                card.title
              )}
            </h3>

            <BodyRichText data={card.body} className="mt-2" />
          </article>
        ))}
      </div>
    </SectionShell>
  )
}
