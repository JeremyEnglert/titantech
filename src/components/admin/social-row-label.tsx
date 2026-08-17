'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function SocialRowLabel() {
  const { data, rowNumber } = useRowLabel<{ platform?: string }>()
  const platform = data?.platform?.trim()
  const fallback = `Link ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`

  return (
    <span style={{ textTransform: 'capitalize' }}>
      {platform && platform.length > 0 ? platform : fallback}
    </span>
  )
}
