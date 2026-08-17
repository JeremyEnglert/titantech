import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { linkRowFields } from '@/fields/link'
import { bodyRichTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  labels: {
    singular: 'CTA Band',
    plural: 'CTA Bands',
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
              admin: {
                description: 'The short line above the headline, set in ember with a rule beside it.',
                placeholder: 'Ready when you are',
              },
            },
            {
              // A `textarea` rather than `text`: an <input> cannot hold the
              // newline this field's line-break rendering depends on.
              name: 'title',
              type: 'textarea',
              label: 'Title',
              required: true,
              admin: {
                description:
                  'A line break in this field renders as a line break on the page — press Enter where the headline should split.',
                placeholder: 'Send us a print.\nGet a quote back fast.',
              },
            },
            bodyRichTextField({
              description: 'A short paragraph beneath the headline.',
            }),
            {
              name: 'buttons',
              type: 'array',
              label: 'Buttons',
              maxRows: 2,
              admin: {
                components: { RowLabel: '@/components/admin/cta-band-button-row-label' },
              },
              fields: [
                ...linkRowFields(),
                {
                  name: 'variant',
                  type: 'select',
                  label: 'Style',
                  defaultValue: 'default',
                  options: [
                    { label: 'Ember (primary)', value: 'default' },
                    { label: 'Outline', value: 'outline' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            ...sectionSettingsFields({ defaultBackground: 'sheen' }),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
