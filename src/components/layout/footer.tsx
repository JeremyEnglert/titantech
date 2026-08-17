import React from 'react'
import Link from 'next/link'

import { Logo } from '@/components/layout/logo'
import { Icon, type IconName } from '@/components/icons'
import { getResolvedMenu } from '@/lib/get-menu'
import { formatCityLine, formatStreet, getSiteSettings, telHref } from '@/lib/get-site-settings'

const socialIcons: Record<string, IconName> = {
  instagram: 'instagram',
}

export async function Footer() {
  const [services, connect, settings] = await Promise.all([
    getResolvedMenu('footer-services'),
    getResolvedMenu('footer-connect'),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? 'Titantech CNC'
  const street = formatStreet(settings?.address)
  const cityLine = formatCityLine(settings?.address)
  const phoneHref = telHref(settings?.phone)
  const hours = settings?.hours

  return (
    <footer className="relative overflow-hidden hairline-t bg-graphite-850 grain">
      <div className="pointer-events-none absolute inset-0 bg-machined opacity-40" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo businessName={businessName} className="mb-5" />

            {settings?.tagline && (
              <p className="max-w-xs text-sm leading-relaxed text-steel-300">{settings.tagline}</p>
            )}

            {(street || cityLine) && (
              <address className="mt-5 not-italic text-sm leading-relaxed text-steel-200">
                {street}
                {street && cityLine && <br />}
                {cityLine}
              </address>
            )}
          </div>

          {services.length > 0 && (
            <div className="md:col-span-4">
              <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-steel-300">Services</p>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                {services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-steel-200 transition-colors hover:text-ember"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:col-span-3">
            <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-steel-300">Connect</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {settings?.phone && phoneHref && (
                <li>
                  <a href={phoneHref} className="text-steel-200 transition-colors hover:text-ember">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all text-steel-200 transition-colors hover:text-ember"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {hours?.days && hours?.open && hours?.close && (
                <li className="text-steel-300">
                  {hours.days} · {hours.open}–{hours.close}
                </li>
              )}
              {connect.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-steel-200 transition-colors hover:text-ember"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {settings?.social && settings.social.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {settings.social.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${businessName} on ${social.platform}`}
                    className="inline-flex items-center gap-2 hairline px-3 py-2 text-sm capitalize text-steel-100 transition-colors hover:border-ember hover:text-ember"
                  >
                    <Icon name={socialIcons[social.platform] ?? 'arrowRight'} className="size-4" />
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 hairline-t pt-6 text-[12px] text-steel-300 sm:flex-row">
          <p className="uppercase tracking-wider">
            © {new Date().getFullYear()} {businessName}
          </p>
          <p className="flex items-center gap-2 uppercase tracking-wider">
            <span className="inline-block size-1.5 bg-ember" aria-hidden="true" />
            Precision Machining · {settings?.address?.city ?? 'Tucson'},{' '}
            {settings?.address?.state ?? 'AZ'}
          </p>
        </div>
      </div>
    </footer>
  )
}
