import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { sectionSettingsFields } from '@/fields/section-settings'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
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
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
            },
            {
              name: 'items',
              type: 'array',
              label: 'Stats',
              minRows: 1,
              maxRows: 6,
              admin: {
                components: { RowLabel: '@/components/admin/stats-row-label' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      admin: { placeholder: 'Tolerance' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Value',
                      required: true,
                      admin: { placeholder: '±.0005' },
                    },
                    {
                      name: 'accentSuffix',
                      type: 'text',
                      label: 'Accent Suffix',
                      admin: {
                        description: 'Shown in ember directly after the value, e.g. " or +.',
                        placeholder: '+',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [...sectionSettingsFields(), ...blockSettingsFields()],
        },
      ],
    },
  ],
}
