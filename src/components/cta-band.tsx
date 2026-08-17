import React, { Fragment } from 'react'
import type { SerializedEditorState } from 'lexical'

import { CMSLink } from '@/components/cms-link'
import { BodyRichText } from '@/components/rich-text'
import { Eyebrow } from '@/components/section-heading'
import { SectionShell } from '@/components/section-shell'
import type { SectionBackground } from '@/fields/section-settings'
import { cn } from '@/lib/utils'

type CtaBandButton = {
  label?: string | null
  linkType?: ('custom' | 'internal') | null
  url?: string | null
  doc?: { relationTo: string; value: unknown } | null
  newTab?: boolean | null
  variant?: ('default' | 'outline') | null
  id?: string | null
}

export type CtaBandProps = {
  eyebrow?: string | null
  title: string
  body?: SerializedEditorState | null
  buttons?: CtaBandButton[] | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

/**
 * The headline is a plain text field, so the split it takes in the design has
 * to come from real newlines the editor typed rather than markup they have to
 * know how to write.
 */
function withLineBreaks(value: string) {
  return value.split(/\r?\n/).map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

export function CtaBand({
  eyebrow,
  title,
  body,
  buttons,
  background,
  topDivider,
  joinPrevious,
}: CtaBandProps) {
  const rows = buttons?.filter(Boolean) ?? []

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>

          {title && (
            <h2 className="font-display text-4xl font-black uppercase leading-[0.92] tracking-tight text-steel-50 sm:text-6xl">
              {withLineBreaks(title)}
            </h2>
          )}

          <BodyRichText data={body} className="mt-5 max-w-xl text-steel-200 sm:text-base" />
        </div>

        {rows.length > 0 && (
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            {rows.map((button, index) => {
              const variant = button.variant ?? 'default'

              return (
                <CMSLink
                  key={button.id ?? index}
                  link={button}
                  variant={variant}
                  size="lg"
                  withArrow={variant === 'default'}
                  className={cn('w-full lg:w-auto')}
                />
              )
            })}
          </div>
        )}
      </div>
    </SectionShell>
  )
}
