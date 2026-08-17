import type { Block } from 'payload'

import { iconOptions } from '@/components/icons'
import { blockSettingsFields } from '@/fields/block-settings'
import { linkGroup } from '@/fields/link'
import { sectionSettingsFields } from '@/fields/section-settings'

export const ContactCardsBlock: Block = {
  slug: 'contactCards',
  labels: {
    singular: 'Contact Cards',
    plural: 'Contact Cards',
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
                description: 'The short line above the heading.',
                placeholder: 'Contact',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              admin: { placeholder: 'Get in touch' },
            },
            {
              name: 'cards',
              type: 'array',
              label: 'Cards',
              minRows: 1,
              admin: {
                components: { RowLabel: '@/components/admin/contact-card-row-label' },
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [...iconOptions],
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: {
                    description: 'The small uppercase kicker above the value.',
                    placeholder: 'Phone',
                  },
                },
                {
                  // A `textarea` rather than `text`: an <input> cannot hold the
                  // newlines a multi-line address needs.
                  name: 'value',
                  type: 'textarea',
                  label: 'Value',
                  required: true,
                  admin: {
                    description:
                      'The large display value. A line break here renders as a line break, so a street address can sit on two lines.',
                    placeholder: '520-668-1600',
                  },
                },
                {
                  name: 'secondary',
                  type: 'text',
                  label: 'Secondary Line',
                  admin: {
                    description: 'Optional smaller line beneath the value.',
                    placeholder: '7:00am – 5:00pm',
                  },
                },
                linkGroup({
                  name: 'link',
                  label: 'Link',
                  description:
                    'Optional. When set, the value becomes a link — a tel: or mailto: URL, or an internal page.',
                  includeLabel: false,
                }),
              ],
            },
            {
              name: 'showMap',
              type: 'checkbox',
              label: 'Show the location map',
              defaultValue: false,
              admin: {
                description:
                  'Draws a muted dark map centred on the address in Site Settings, with a "Get directions" link.',
              },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            ...sectionSettingsFields({ defaultBackground: 'deep' }),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
