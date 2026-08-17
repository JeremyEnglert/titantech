import React from 'react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { resolveLink } from '@/lib/resolve-link'
import { cn } from '@/lib/utils'

type ButtonVariant = NonNullable<React.ComponentProps<typeof Button>['variant']>
type ButtonSize = NonNullable<React.ComponentProps<typeof Button>['size']>

export type CMSLinkProps = {
  link: unknown
  fallbackLabel?: string | null
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  /** Render as a plain anchor instead of a button — for nav and list links. */
  plain?: boolean
  /** Append the design's sliding arrow. Ignored when `plain`. */
  withArrow?: boolean
}

/**
 * Renders a link field. Returns null when the field has no destination, so a
 * block that leaves its optional button empty renders nothing rather than a
 * dead anchor.
 */
export function CMSLink({
  link,
  fallbackLabel,
  variant = 'default',
  size = 'default',
  className,
  plain = false,
  withArrow = false,
}: CMSLinkProps) {
  const resolved = resolveLink(link, fallbackLabel)
  if (!resolved) return null

  const label = resolved.label ?? fallbackLabel
  if (!label) return null

  const newTabProps = resolved.newTab
    ? { target: '_blank', rel: 'noopener noreferrer' as const }
    : {}

  // tel:/mailto:/file hrefs have no route for the client router to navigate
  // to, so they stay plain anchors — next/link would try to prefetch them.
  const useAnchor = resolved.external || resolved.isFile

  const content = (
    <>
      {label}
      {withArrow && !plain && (
        <Icon
          name="arrowRight"
          className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  )

  if (plain) {
    return useAnchor ? (
      <a href={resolved.href} className={className} {...newTabProps}>
        {label}
      </a>
    ) : (
      <Link href={resolved.href} className={className} {...newTabProps}>
        {label}
      </Link>
    )
  }

  const classes = cn('group', buttonVariants({ variant, size }), className)

  return useAnchor ? (
    <a href={resolved.href} className={classes} {...newTabProps}>
      {content}
    </a>
  ) : (
    <Link href={resolved.href} className={classes} {...newTabProps}>
      {content}
    </Link>
  )
}
