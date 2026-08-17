import React from 'react'

import { getSiteSettings } from '@/lib/get-site-settings'
import { siteConfig } from '@/utilities/site-config'

/**
 * LocalBusiness structured data. For a job shop competing on "CNC machining
 * near me", this is the single highest-leverage SEO artefact on the site — it
 * is what feeds the knowledge panel and the local pack.
 *
 * Everything comes from the site-settings global so the marked-up NAP can
 * never drift from the NAP rendered in the footer and contact block.
 */
export async function LocalBusinessSchema() {
  const settings = await getSiteSettings()
  if (!settings) return null

  const { address, hours, social } = settings

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MachineShop',
    name: settings.businessName,
    description: settings.tagline ?? siteConfig.description,
    url: siteConfig.url,
    telephone: settings.phone,
    email: settings.email,
    ...(address?.street
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: [address.street, address.suite].filter(Boolean).join(', '),
            addressLocality: address.city,
            addressRegion: address.state,
            postalCode: address.zip,
            addressCountry: 'US',
          },
        }
      : {}),
    ...(typeof address?.latitude === 'number' && typeof address?.longitude === 'number'
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: address.latitude,
            longitude: address.longitude,
          },
        }
      : {}),
    ...(hours?.schemaHours ? { openingHours: hours.schemaHours } : {}),
    ...(address?.city && address?.state
      ? { areaServed: { '@type': 'City', name: `${address.city}, ${address.state}` } }
      : {}),
    ...(social?.length ? { sameAs: social.map((item) => item.url) } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // The value is our own serialized object, never user-supplied markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
