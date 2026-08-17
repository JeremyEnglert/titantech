import React from 'react'

/**
 * The site's icon set, kept as inline SVG rather than uploaded files on
 * purpose: every icon inherits `currentColor`, which is what lets a card flip
 * its icon from steel to ember on hover. An uploaded SVG rendered through
 * next/image is a flat raster to the browser and cannot be recoloured.
 *
 * Adding an icon is a code change. That is correct here — these are bespoke
 * machining marks drawn for this design, not a general-purpose library.
 *
 * `iconOptions` feeds the Payload `select` field, so the two can never drift.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const icons = {
  mill: (
    <>
      <path d="M4 4h16v5H4z" {...stroke} />
      <path d="M10 9v7M14 9v7M8 16h8l-1 4H9z" {...stroke} />
    </>
  ),
  multiAxis: (
    <>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M12 4v16M4 12h16" {...stroke} strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2.5" {...stroke} />
    </>
  ),
  lathe: (
    <>
      <path d="M3 9h18v6H3z" {...stroke} />
      <path d="M7 9V6M11 9V6M15 9V6M19 9V6" {...stroke} />
      <circle cx="12" cy="12" r="1.5" {...stroke} />
    </>
  ),
  laser: (
    <>
      <path d="M12 2v9" {...stroke} />
      <path d="M9 11h6l-1.5 4h-3z" {...stroke} />
      <path d="M10.5 15l1.5 7 1.5-7" {...stroke} />
    </>
  ),
  customPart: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" {...stroke} />
      <circle cx="12" cy="12" r="3" {...stroke} />
    </>
  ),
  repair: (
    <path
      d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"
      {...stroke}
    />
  ),
  phone: (
    <path
      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"
      {...stroke}
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" {...stroke} />
      <path d="m3 7 9 6 9-6" {...stroke} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3.5 2" {...stroke} />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s8-5.5 8-12a8 8 0 1 0-16 0c0 6.5 8 12 8 12Z" {...stroke} />
      <circle cx="12" cy="10" r="2.6" {...stroke} />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" {...stroke} />
      <circle cx="9" cy="10" r="2" {...stroke} />
      <path d="m4 18 5-4 4 3 3-2 4 3" {...stroke} />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" {...stroke} strokeWidth={2.2} />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" {...stroke} />
      <circle cx="12" cy="12" r="4" {...stroke} />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
} as const

export type IconName = keyof typeof icons

export const iconOptions: { label: string; value: IconName }[] = [
  { label: 'Mill', value: 'mill' },
  { label: 'Multi-axis', value: 'multiAxis' },
  { label: 'Lathe', value: 'lathe' },
  { label: 'Laser', value: 'laser' },
  { label: 'Custom part', value: 'customPart' },
  { label: 'Repair', value: 'repair' },
  { label: 'Phone', value: 'phone' },
  { label: 'Mail', value: 'mail' },
  { label: 'Clock', value: 'clock' },
  { label: 'Map pin', value: 'pin' },
  { label: 'Image', value: 'image' },
  { label: 'Arrow', value: 'arrowRight' },
  { label: 'Instagram', value: 'instagram' },
]

export function Icon({
  name,
  className,
}: {
  name?: IconName | null
  className?: string
}) {
  if (!name || !(name in icons)) return null

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  )
}
