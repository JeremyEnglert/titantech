import React from 'react'

import { cn } from '@/lib/utils'

/**
 * The Titantech mark, redrawn as inline SVG: a toothed gear ring enclosing a
 * three-bar skyline over a tunnel chevron.
 *
 * The supplied logo file is a JPEG whose wordmark is near-black on white — on
 * graphite the type would vanish and the white plate would punch a hole in the
 * page. So the gear is drawn in `currentColor` (ember) and the wordmark is set
 * in Saira Condensed beside it, which also keeps it crisp at every size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="7" />
      <g>
        <rect x="46" y="2" width="8" height="12" rx="1" />
        <rect x="46" y="86" width="8" height="12" rx="1" />
        <rect x="2" y="46" width="12" height="8" rx="1" />
        <rect x="86" y="46" width="12" height="8" rx="1" />
        <rect x="46" y="2" width="8" height="12" rx="1" transform="rotate(45 50 50)" />
        <rect x="46" y="86" width="8" height="12" rx="1" transform="rotate(45 50 50)" />
        <rect x="46" y="2" width="8" height="12" rx="1" transform="rotate(-45 50 50)" />
        <rect x="46" y="86" width="8" height="12" rx="1" transform="rotate(-45 50 50)" />
      </g>
      <g>
        <rect x="46" y="30" width="8" height="40" rx="1" />
        <rect x="34" y="40" width="8" height="30" rx="1" />
        <rect x="58" y="40" width="8" height="30" rx="1" />
      </g>
      <path
        d="M22 74 L40 56 H60 L78 74"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({
  businessName = 'Titantech',
  className,
  markClassName,
}: {
  businessName?: string
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center text-ember transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          markClassName,
        )}
      >
        <LogoMark className="size-full" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-extrabold uppercase tracking-[0.12em] text-steel-50">
          {businessName.replace(/\s*CNC$/i, '')}
        </span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.5em] text-ember">CNC</span>
      </span>
    </span>
  )
}
