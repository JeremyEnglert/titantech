import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

/**
 * Name, address and phone live here rather than in the blocks that display
 * them. The header, footer, contact cards and the LocalBusiness JSON-LD all
 * read the same record, so a phone number can never be right in three places
 * and stale in a fourth.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: { group: 'Global' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'businessName', type: 'text', label: 'Business Name', required: true },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: { description: 'One line, used in the footer and as an OG description fallback.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: 'Phone', required: true },
                { name: 'email', type: 'text', label: 'Email', required: true },
              ],
            },
            {
              name: 'address',
              type: 'group',
              label: 'Address',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'street', type: 'text', label: 'Street' },
                    { name: 'suite', type: 'text', label: 'Suite' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', label: 'City' },
                    { name: 'state', type: 'text', label: 'State' },
                    { name: 'zip', type: 'text', label: 'ZIP' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'latitude', type: 'number', label: 'Latitude' },
                    { name: 'longitude', type: 'number', label: 'Longitude' },
                  ],
                },
              ],
            },
            {
              name: 'hours',
              type: 'group',
              label: 'Hours',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'days', type: 'text', label: 'Days', admin: { placeholder: 'Mon–Fri' } },
                    { name: 'open', type: 'text', label: 'Opens', admin: { placeholder: '7:00am' } },
                    { name: 'close', type: 'text', label: 'Closes', admin: { placeholder: '5:00pm' } },
                  ],
                },
                {
                  name: 'schemaHours',
                  type: 'text',
                  label: 'Structured data hours',
                  admin: {
                    description:
                      'Schema.org openingHours format, e.g. "Mo-Fr 07:00-17:00". Used only in the JSON-LD Google reads.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'array',
              label: 'Social Links',
              admin: { components: { RowLabel: '@/components/admin/social-row-label' } },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Platform',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'LinkedIn', value: 'linkedin' },
                  ],
                  required: true,
                },
                { name: 'url', type: 'text', label: 'URL', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (context?.disableRevalidate) return doc
        try {
          revalidateTag('site-settings', 'max')
        } catch {
          // Seed scripts run outside a request context, where this throws.
        }
        return doc
      },
    ],
  },
}
