import Image from 'next/image'

import { Icon, type IconName } from '@/components/icons'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type CapabilityGridItem = {
  id?: string | null
  title: string
  detail?: string | null
  /** A bare id when the page was queried at depth 0 — nothing to render from. */
  image?: (string | Media) | null
  icon?: IconName | null
}

export type CapabilityGridProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  items?: CapabilityGridItem[] | null
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
 * The 1px gap over a lighter background IS the cell border, so a last row that
 * does not fill leaves that lighter surface showing as an empty lit cell. Auto
 * therefore picks the width that leaves the fewest of them — 6 items land on 3,
 * 7 on 4 (one gap, versus two at 3-up). Ties go to the wider grid, which is
 * closer to the design's dense set.
 */
function autoColumnCount(itemCount: number) {
  if (itemCount <= 3) return itemCount

  let best = 3
  let fewestGaps = Number.POSITIVE_INFINITY

  for (const candidate of [4, 3]) {
    const gaps = (candidate - (itemCount % candidate)) % candidate
    if (gaps < fewestGaps) {
      best = candidate
      fewestGaps = gaps
    }
  }

  return best
}

function gridColumnClasses(columns: CapabilityGridProps['columns'], itemCount: number) {
  if (columns && columns !== 'auto') return explicitColumnClasses[columns]

  const count = autoColumnCount(itemCount)
  if (count <= 1) return ''
  return explicitColumnClasses[String(count) as '2' | '3' | '4']
}

export function CapabilityGrid({
  eyebrow,
  title,
  intro,
  items,
  columns,
  background,
  topDivider,
  joinPrevious,
}: CapabilityGridProps) {
  const cells = items ?? []
  if (cells.length === 0) return null

  const hasHeader = Boolean(eyebrow || title || intro)

  // A set where no cell carries an image or a detail line (the industries
  // list) needs far less height than one that does — at the taller height the
  // tiles read as mostly-empty boxes.
  const isCompact = cells.every((item) => !item.detail && !item.image && !item.icon)

  // The last row rarely divides evenly, and the 1px gap over a lighter surface
  // means an unfilled slot shows as a lit empty cell. Stretching the final item
  // across the remainder fills the row and reads as deliberate.
  const columnCount =
    columns && columns !== 'auto' ? Number(columns) : autoColumnCount(cells.length)
  const trailingGaps = columnCount > 1 ? (columnCount - (cells.length % columnCount)) % columnCount : 0
  const lastItemSpan = trailingGaps > 0 ? trailingGaps + 1 : 1
  const spanClasses: Record<number, string> = {
    2: 'sm:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      {hasHeader && (
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            <SectionTitle>{title}</SectionTitle>
          </div>
          {intro && <p className="max-w-md text-sm leading-relaxed text-steel-300">{intro}</p>}
        </div>
      )}

      <div
        className={cn(
          'grid gap-px bg-graphite-500/30 hairline',
          gridColumnClasses(columns, cells.length),
        )}
      >
        {cells.map((item, index) => {
          const media = item.image && typeof item.image === 'object' ? item.image : null
          const hasImage = Boolean(media?.url)
          const hasIcon = !hasImage && Boolean(item.icon)

          return (
            <div
              key={item.id ?? index}
              // The min height is what keeps a title-only set reading as tiles
              // rather than a stack of thin strips — but a compact set needs
              // much less of it than one carrying photos.
              className={cn(
                'flex flex-col bg-graphite-850 p-7',
                isCompact ? 'min-h-24 justify-center' : 'min-h-40',
                index === cells.length - 1 && lastItemSpan > 1 && spanClasses[lastItemSpan],
              )}
            >
              {media?.url && (
                <div className="relative aspect-[4/3] overflow-hidden hairline bg-graphite-900">
                  <Image
                    src={media.url}
                    alt={media.alt ?? ''}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}

              {hasIcon && (
                <span className="grid h-12 w-12 place-items-center hairline bg-graphite-900 text-ember">
                  <Icon name={item.icon} className="size-6" />
                </span>
              )}

              <h3
                className={cn(
                  'font-display text-xl font-bold uppercase tracking-wide text-steel-50',
                  (hasImage || hasIcon) && 'mt-6',
                )}
              >
                {item.title}
              </h3>

              {item.detail && (
                <p className="mt-2 text-sm leading-relaxed text-steel-300">{item.detail}</p>
              )}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
