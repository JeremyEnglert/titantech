import React from 'react'
import Link from 'next/link'

import { Logo } from '@/components/layout/logo'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Icon } from '@/components/icons'
import { getResolvedMenu } from '@/lib/get-menu'
import { getSiteSettings, telHref } from '@/lib/get-site-settings'

export async function Header() {
  const [items, settings] = await Promise.all([getResolvedMenu('main'), getSiteSettings()])

  const phone = settings?.phone ?? null
  const phoneHref = telHref(phone)

  return (
    <header className="sticky top-0 z-50 hairline-b bg-graphite-900/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <nav className="flex h-[68px] items-center justify-between" aria-label="Primary">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${settings?.businessName ?? 'Titantech CNC'} home`}
          >
            <Logo businessName={settings?.businessName ?? 'Titantech CNC'} />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-7 text-[13px] uppercase tracking-wider text-steel-200">
              {items.map((item) => (
                <li key={item.href}>
                  {/* The ember underline grows from the left on hover — the
                      pseudo-element carries it so no layout shift occurs. */}
                  <Link
                    href={item.href}
                    className="relative py-2 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-ember after:transition-all hover:text-steel-50 hover:after:w-full"
                    {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {phoneHref && (
              <a
                href={phoneHref}
                className="text-[13px] uppercase tracking-wider text-steel-200 transition-colors hover:text-steel-50"
              >
                {phone}
              </a>
            )}

            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 bg-ember px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_10px_24px_-14px_rgba(214,40,40,0.6)] transition-all duration-200 hover:-translate-y-px hover:bg-ember-soft motion-reduce:hover:translate-y-0"
            >
              Request a Quote
              <Icon
                name="arrowRight"
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          </div>

          <MobileNav items={items} phone={phone} phoneHref={phoneHref} />
        </nav>
      </div>
    </header>
  )
}
