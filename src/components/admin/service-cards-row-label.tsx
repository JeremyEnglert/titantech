'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ServiceCardsRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  const label = data?.title?.trim()

  return (
    <span>
      {label && label.length > 0 ? label : `Card ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}
    </span>
  )
}
