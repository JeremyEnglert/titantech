'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function HeroButtonRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  const label = data?.label?.trim()

  return (
    <span>
      {label && label.length > 0 ? label : `Button ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}
    </span>
  )
}
