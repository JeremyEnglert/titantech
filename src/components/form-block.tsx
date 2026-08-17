import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Form } from '@/payload-types'
import type { SectionBackground } from '@/fields/section-settings'
import { SectionShell } from '@/components/section-shell'
import { Eyebrow, SectionTitle } from '@/components/section-heading'
import RichText from '@/components/rich-text'
import { FormRenderer } from '@/components/form-fields/form-renderer'
import { cn } from '@/lib/utils'

type RichTextValue = React.ComponentProps<typeof RichText>['data']

export type FormBlockProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: RichTextValue
  form?: (string | Form) | null
  aside?: { title?: string | null; body?: RichTextValue } | null
  layout?: ('split' | 'stacked') | null
  background?: SectionBackground | null
  topDivider?: boolean | null
  joinPrevious?: boolean | null
}

export async function FormBlock({
  eyebrow,
  title,
  intro,
  form,
  aside,
  layout = 'split',
  background,
  topDivider,
  joinPrevious,
}: FormBlockProps) {
  // A relationship inside a block comes back as a bare id at the depths the
  // page query uses, so the form is fetched here rather than relying on
  // population — the same reason cvsa's form block refetches.
  let resolved: Form | null = typeof form === 'object' && form !== null ? form : null

  if (!resolved && typeof form === 'string') {
    const payload = await getPayload({ config: configPromise })
    try {
      resolved = (await payload.findByID({ collection: 'forms', id: form, depth: 1 })) as Form
    } catch {
      resolved = null
    }
  }

  if (!resolved) return null

  const hasAside = Boolean(aside?.title || aside?.body)
  const split = layout !== 'stacked'

  return (
    <SectionShell background={background} topDivider={topDivider} joinPrevious={joinPrevious}>
      <div className={cn(split && 'grid gap-12 lg:grid-cols-12 lg:gap-16')}>
        <div className={cn(split ? 'lg:col-span-5' : 'mb-12 max-w-2xl')}>
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          {title && <SectionTitle>{title}</SectionTitle>}
          {intro && <RichText data={intro} className="mt-6 prose-p:text-sm" />}

          {hasAside && (
            <div className="mt-10 hairline bg-graphite-850/70 p-6">
              {aside?.title && (
                <p className="font-display text-lg font-bold uppercase tracking-wide text-steel-50">
                  {aside.title}
                </p>
              )}
              {aside?.body && <RichText data={aside.body} className="mt-3 prose-p:text-sm" />}
            </div>
          )}
        </div>

        <div className={cn(split ? 'lg:col-span-7' : 'max-w-3xl')}>
          <FormRenderer form={resolved} />
        </div>
      </div>
    </SectionShell>
  )
}
