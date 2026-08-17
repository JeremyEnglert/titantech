'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function StatsRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; value?: string }>()
  const label = data?.label?.trim()
  const value = data?.value?.trim()
  const fallback = `Stat ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`

  if (!label || label.length === 0) return <span>{fallback}</span>

  return <span>{value && value.length > 0 ? `${label} — ${value}` : label}</span>
}
