'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function CapabilityGridRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  const label = data?.title?.trim()

  return (
    <span>
      {label && label.length > 0 ? label : `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}
    </span>
  )
}
