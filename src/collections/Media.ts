import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const webp = { format: 'webp' as const, options: { quality: 80 } }

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Global',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'What the image shows, for screen readers and search. Describe the subject, not the file — "Haas VF-2SS cutting an aluminum bracket", not "shop photo 3".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional. Shown beneath the image where a block supports it.',
      },
    },
  ],
  upload: {
    formatOptions: webp,
    // The starter shipped only an `og` size, which leaves content imagery with
    // no srcset — a 4000px shop photo would download in full on a phone.
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: webp },
      { name: 'card', width: 900, formatOptions: webp },
      { name: 'wide', width: 1600, formatOptions: webp },
      { name: 'og', width: 1200, height: 630, formatOptions: webp },
    ],
  },
}
