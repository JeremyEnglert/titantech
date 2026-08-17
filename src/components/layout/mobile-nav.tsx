'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import type { ResolvedMenuItem } from '@/lib/get-menu'
import { cn } from '@/lib/utils'

type MobileNavProps = {
  items: ResolvedMenuItem[]
  phone: string | null
  phoneHref: string | null
}

export function MobileNav({ items, phone, phoneHref }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  // Navigating does not unmount this component, so the panel has to be closed
  // explicitly. Doing it in each link's onClick rather than in an effect
  // watching the pathname avoids a second render pass on every route change.
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="grid size-11 place-items-center hairline bg-graphite-800 text-steel-100 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      <div
        id="mobile-menu"
        className={cn(
          'absolute left-0 right-0 top-full hairline-t bg-graphite-850 lg:hidden',
          !open && 'hidden',
        )}
      >
        <ul className="flex flex-col divide-y divide-graphite-600/60 px-5 py-4 text-sm uppercase tracking-wider">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-steel-200 hover:text-ember"
                onClick={close}
                {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 px-5 pb-5">
          {phoneHref && phone && (
            <a
              href={phoneHref}
              onClick={close}
              className="hairline py-3 text-center text-sm uppercase tracking-wider text-steel-100 hover:border-steel-300"
            >
              Call {phone}
            </a>
          )}
          <Link
            href="/quote"
            onClick={close}
            className="bg-ember py-3 text-center font-display font-bold uppercase tracking-wider text-white hover:bg-ember-soft"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </>
  )
}
