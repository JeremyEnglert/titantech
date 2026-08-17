import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { SiteSetting } from '@/payload-types'

async function fetchSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayload({ config: configPromise })
  try {
    return (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as SiteSetting
  } catch {
    // Before the global has ever been saved the read throws rather than
    // returning an empty doc; the header and footer handle null.
    return null
  }
}

export const getSiteSettings = unstable_cache(fetchSiteSettings, ['site-settings'], {
  tags: ['site-settings'],
})

/** "227 E Valencia Rd, Ste 230" — street and suite on one line. */
export function formatStreet(address: SiteSetting['address'] | null | undefined) {
  if (!address) return null
  return [address.street, address.suite].filter(Boolean).join(', ') || null
}

/** "Tucson, AZ 85706" */
export function formatCityLine(address: SiteSetting['address'] | null | undefined) {
  if (!address) return null
  const cityState = [address.city, address.state].filter(Boolean).join(', ')
  return [cityState, address.zip].filter(Boolean).join(' ') || null
}

/** Digits only, for a tel: href. */
export function telHref(phone: string | null | undefined) {
  if (!phone) return null
  const digits = phone.replace(/[^\d]/g, '')
  return digits ? `tel:${digits}` : null
}
