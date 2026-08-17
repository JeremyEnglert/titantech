'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function MenuItemRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  const label = data?.label?.trim()
  const fallback = `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`

  return <span>{label && label.length > 0 ? label : fallback}</span>
}
