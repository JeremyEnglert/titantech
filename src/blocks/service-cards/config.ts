import type { Block } from 'payload'

import { iconOptions } from '@/components/icons'
import { blockSettingsFields } from '@/fields/block-settings'
import { linkGroup } from '@/fields/link'
import { bodyRichTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const ServiceCardsBlock: Block = {
  slug: 'serviceCards',
  labels: {
    singular: 'Service Cards',
    plural: 'Service Cards',
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
              admin: { placeholder: 'Capabilities' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              admin: { placeholder: 'What we machine' },
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              admin: {
                description:
                  'Sits to the right of the heading on desktop, under it on mobile. Two short sentences at most.',
              },
            },
          ],
        },
        {
          label: 'Cards',
          fields: [
            {
              name: 'cards',
              type: 'array',
              label: 'Cards',
              minRows: 1,
              admin: {
                components: { RowLabel: '@/components/admin/service-cards-row-label' },
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: iconOptions,
                  admin: {
                    description:
                      'Drawn inline so it can flip from steel to ember on hover — see components/icons.tsx.',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                bodyRichTextField(),
                // No button label: the card title IS the link text, and its
                // stretched overlay makes the whole card the click target.
                linkGroup({
                  name: 'link',
                  label: 'Card Link',
                  includeLabel: false,
                  description: 'Optional. When set, the whole card becomes clickable.',
                }),
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'columns',
              type: 'select',
              label: 'Columns',
              defaultValue: 'auto',
              options: [
                { label: 'Auto', value: 'auto' },
                { label: '2 columns', value: '2' },
                { label: '3 columns', value: '3' },
                { label: '4 columns', value: '4' },
              ],
              admin: {
                description:
                  'Auto is the design’s 3-up grid, narrowed when there are fewer cards than columns.',
              },
            },
            ...sectionSettingsFields(),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
