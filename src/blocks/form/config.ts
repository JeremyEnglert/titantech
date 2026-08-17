import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { sectionSettingsFields } from '@/fields/section-settings'
import { richTextField } from '@/fields/rich-text-tiers'

export const FormBlock: Block = {
  slug: 'form',
  labels: { singular: 'Form', plural: 'Forms' },
  admin: { disableBlockName: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Title' },
            richTextField({
              tier: 'plain',
              name: 'intro',
              label: 'Intro',
              description: 'Shown above the fields.',
            }),
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              label: 'Form',
              required: true,
            },
            {
              name: 'aside',
              type: 'group',
              label: 'Aside',
              admin: {
                description:
                  'Optional panel beside the form — used on the quote page for the phone/email fallback.',
              },
              fields: [
                { name: 'title', type: 'text', label: 'Title' },
                richTextField({ tier: 'plain', name: 'body', label: 'Body' }),
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'split',
              options: [
                { label: 'Split — form beside the heading', value: 'split' },
                { label: 'Stacked — heading above the form', value: 'stacked' },
              ],
            },
            ...sectionSettingsFields(),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
