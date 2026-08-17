import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { linkGroup } from '@/fields/link'
import { richTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const MediaWithTextBlock: Block = {
  slug: 'mediaWithText',
  labels: {
    singular: 'Media With Text',
    plural: 'Media With Text',
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
              name: 'image',
              type: 'upload',
              label: 'Image',
              relationTo: 'media',
              admin: {
                description: 'Shown in a 4:3 hairline frame. Leave empty to show a placeholder.',
              },
            },
            {
              name: 'imagePosition',
              type: 'select',
              label: 'Image Position',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                description: 'Which side the image sits on from the large breakpoint up.',
              },
            },
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              admin: { description: 'The short line above the heading.' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
            },
            richTextField({
              tier: 'body',
              name: 'body',
              label: 'Body',
            }),
            linkGroup({
              name: 'button',
              label: 'Button',
              description: 'Optional.',
            }),
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
