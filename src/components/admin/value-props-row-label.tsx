'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ValuePropsRowLabel() {
  const { data, rowNumber } = useRowLabel<{ marker?: string; title?: string }>()
  const title = data?.title?.trim()
  const marker = data?.marker?.trim()
  const fallback = `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`

  if (!title || title.length === 0) return <span>{fallback}</span>

  return <span>{marker && marker.length > 0 ? `${marker} — ${title}` : title}</span>
}
