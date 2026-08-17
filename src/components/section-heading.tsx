import React from 'react'

import { cn } from '@/lib/utils'

/**
 * The eyebrow used across every section: a short ember rule, then small
 * uppercase wide-tracked text. It appears often enough that duplicating the
 * tracking values per block would guarantee drift.
 */
export function Eyebrow({
  children,
  className,
  tone = 'ember',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'ember' | 'steel'
}) {
  if (!children) return null

  return (
    <p
      className={cn(
        'flex items-center gap-3 text-[11px] uppercase tracking-[0.18em]',
        tone === 'ember' ? 'text-ember' : 'text-steel-300',
        className,
      )}
    >
      <span className="inline-block h-px w-8 bg-ember" aria-hidden="true" />
      {children}
    </p>
  )
}

export function SectionTitle({
  children,
  as: Tag = 'h2',
  className,
}: {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  if (!children) return null

  return (
    <Tag
      className={cn(
        'font-display font-extrabold uppercase leading-[0.95] tracking-[-0.015em] text-steel-50',
        Tag === 'h1' ? 'text-4xl sm:text-6xl' : 'text-4xl sm:text-5xl',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
