import React from 'react'
import Image from 'next/image'

import { CMSLink } from '@/components/cms-link'
import { Icon } from '@/components/icons'
import { BodyRichText } from '@/components/rich-text'
import { Eyebrow } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

type MediaLike = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type HeroSpec = {
  label?: string | null
  value?: string | null
  accentSuffix?: string | null
  id?: string | null
}

type HeroButton = {
  label?: string | null
  linkType?: ('custom' | 'internal') | null
  url?: string | null
  newTab?: boolean | null
  variant?: ('default' | 'outline') | null
  id?: string | null
}

export type HeroProps = {
  eyebrow?: string | null
  title: string
  titleAccent?: string | null
  titleAfter?: string | null
  body?: React.ComponentProps<typeof BodyRichText>['data']
  specs?: HeroSpec[] | null
  buttons?: HeroButton[] | null
  image?: (string | number | MediaLike) | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

// The design's d1…d5 stagger. There is no JS on this block, so the cascade is
// expressed as an inline animation-delay on each `reveal-load` element.
const delay = {
  eyebrow: '0.05s',
  title: '0.18s',
  body: '0.31s',
  specs: '0.44s',
  image: '0.44s',
  buttons: '0.57s',
} as const

export function Hero({
  eyebrow,
  title,
  titleAccent,
  titleAfter,
  body,
  specs,
  buttons,
  image,
  background,
  topDivider,
  joinPrevious,
}: HeroProps) {
  const media = typeof image === 'object' && image !== null ? image : null
  const imageUrl = media?.url ?? null

  const specRows = (specs ?? []).filter((spec) => spec?.label || spec?.value)
  const buttonRows = buttons ?? []

  return (
    // `bleed` because the atmospheric layers have to cover the section's own
    // vertical padding as well as its full width — inside SectionShell's
    // max-width container they would be clipped to the copy. `!my-0` drops the
    // transparent-block margin so the hero sits flush under the sticky header.
    <SectionShell
      background={background}
      topDivider={topDivider}
      joinPrevious={joinPrevious}
      bleed
      className="grain overflow-hidden !my-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-crosshatch opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(900px 540px at 78% 18%, rgba(214,40,40,0.10), transparent 60%), radial-gradient(700px 700px at 8% 90%, rgba(124,130,141,0.10), transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-14 pb-20 sm:px-8 lg:pt-20 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {eyebrow && (
              <div className="reveal-load mb-7" style={{ animationDelay: delay.eyebrow }}>
                <Eyebrow tone="steel">{eyebrow}</Eyebrow>
              </div>
            )}

            <h1
              className="reveal-load font-display text-[3.1rem] leading-[0.9] font-black tracking-[-0.02em] text-steel-50 uppercase sm:text-7xl lg:text-[5.4rem]"
              style={{ animationDelay: delay.title }}
            >
              {title}
              {titleAccent && (
                <>
                  <br />
                  <span className="text-ember">{titleAccent}</span>
                </>
              )}
              {titleAfter && <> {titleAfter}</>}
            </h1>

            {body && (
              <div className="reveal-load mt-7 max-w-xl" style={{ animationDelay: delay.body }}>
                <BodyRichText data={body} className="text-[15px] text-steel-200" />
              </div>
            )}

            {specRows.length > 0 && (
              <dl
                className="reveal-load mt-9 flex flex-wrap gap-x-8 gap-y-5 text-sm"
                style={{ animationDelay: delay.specs }}
              >
                {specRows.map((spec, index) => (
                  <div
                    key={spec.id ?? index}
                    className={cn(index > 0 && 'border-l border-graphite-500 pl-8')}
                  >
                    <dt className="mb-1 text-[10px] tracking-[0.18em] text-steel-300 uppercase">
                      {spec.label}
                    </dt>
                    <dd className="tabular font-display text-2xl font-extrabold text-steel-50">
                      {spec.value}
                      {spec.accentSuffix && <span className="text-ember">{spec.accentSuffix}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {buttonRows.length > 0 && (
              <div
                className="reveal-load mt-10 flex flex-col gap-3 sm:flex-row"
                style={{ animationDelay: delay.buttons }}
              >
                {buttonRows.map((button, index) => {
                  const variant = button.variant ?? 'default'

                  return (
                    <CMSLink
                      key={button.id ?? index}
                      link={button}
                      variant={variant}
                      size="lg"
                      withArrow={variant === 'default'}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div className="reveal-load lg:col-span-5" style={{ animationDelay: delay.image }}>
            <div className="hairline relative aspect-[4/5] bg-graphite-850">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={media?.alt ?? ''}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div className="flex flex-col items-center gap-3 px-6">
                    <Icon name="image" className="size-8 text-steel-300" />
                    <span className="text-[11px] tracking-[0.18em] text-steel-300 uppercase">
                      Image placeholder
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
