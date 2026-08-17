import { Eyebrow, SectionTitle } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

type StatItem = {
  id?: string | null
  label: string
  value: string
  accentSuffix?: string | null
}

export type StatsProps = {
  eyebrow?: string | null
  title?: string | null
  items?: StatItem[] | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

/**
 * The 1px gap over a lighter background IS the cell border, so a column count
 * larger than the number of stats would leave that lighter surface showing as
 * an empty cell. Two stays two on mobile — the design's grid never goes 1-up.
 */
function gridColumnClasses(count: number) {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-2 sm:grid-cols-3'
  return 'grid-cols-2 sm:grid-cols-4'
}

export function Stats({ eyebrow, title, items, background, topDivider, joinPrevious }: StatsProps) {
  const stats = items ?? []
  if (stats.length === 0) return null

  const hasHeader = Boolean(eyebrow || title)

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      {hasHeader && (
        <div className="mb-10">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <SectionTitle>{title}</SectionTitle>
        </div>
      )}

      <dl className={cn('grid gap-px bg-graphite-500/30 hairline', gridColumnClasses(stats.length))}>
        {stats.map((stat, index) => (
          <div key={stat.id ?? index} className="bg-graphite-850 p-5 text-center">
            <dt className="text-[10px] uppercase tracking-wider text-steel-300">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl font-extrabold text-steel-50 tabular">
              {stat.value}
              {stat.accentSuffix && <span className="text-ember">{stat.accentSuffix}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
