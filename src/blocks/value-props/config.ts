import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { bodyRichTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const ValuePropsBlock: Block = {
  slug: 'valueProps',
  labels: {
    singular: 'Value Props',
    plural: 'Value Props',
  },
  admin: { disableBlockName: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              admin: { placeholder: 'Why Titantech' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              admin: { placeholder: 'A small shop with serious capability.' },
            },
            bodyRichTextField({
              description: 'The short paragraph under the heading, in the left column.',
            }),
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              admin: {
                description:
                  'Optional 4:3 shop-floor photo. Leaving it empty renders the placeholder box.',
              },
            },
          ],
        },
        {
          label: 'Items',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              admin: {
                components: { RowLabel: '@/components/admin/value-props-row-label' },
              },
              fields: [
                {
                  name: 'marker',
                  type: 'text',
                  label: 'Marker',
                  admin: {
                    description: 'The oversized ember index beside the row, e.g. A1.',
                    placeholder: 'A1',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                bodyRichTextField(),
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            ...sectionSettingsFields({ defaultBackground: 'tint' }),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
