import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { richTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  admin: { disableBlockName: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            richTextField({
              tier: 'editorial',
              name: 'content',
              label: 'Content',
              required: true,
            }),
            {
              name: 'width',
              type: 'select',
              label: 'Width',
              defaultValue: 'narrow',
              options: [
                { label: 'Narrow — comfortable reading measure', value: 'narrow' },
                { label: 'Full — the whole container', value: 'full' },
              ],
              admin: {
                description:
                  'Narrow keeps long-form copy at a readable line length; full lets it run the width of the section.',
              },
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
