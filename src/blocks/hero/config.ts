import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { linkRowFields } from '@/fields/link'
import { bodyRichTextField } from '@/fields/rich-text-tiers'
import { sectionSettingsFields } from '@/fields/section-settings'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
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
                description: 'The coordinate line above the headline.',
                placeholder: 'Tucson, AZ / Lat 32.1°N Lon 110.9°W',
              },
            },
            {
              // Split into three fields rather than one rich text: the accent
              // word is a colour change mid-headline, and the line break before
              // it is part of the layout, not something an editor should have
              // to reproduce with markup.
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: { placeholder: 'Precision parts,' },
            },
            {
              name: 'titleAccent',
              type: 'text',
              label: 'Accent Word',
              admin: {
                description: 'Starts a second line and renders in ember.',
                placeholder: 'machined',
              },
            },
            {
              name: 'titleAfter',
              type: 'text',
              label: 'Title After Accent',
              admin: {
                description: 'Copy that follows the accent word on the same line.',
                placeholder: 'to spec.',
              },
            },
            bodyRichTextField({ label: 'Intro' }),
            {
              name: 'specs',
              type: 'array',
              label: 'Spec Callouts',
              maxRows: 4,
              admin: {
                description: 'The inline spec sheet under the intro. Up to four.',
                components: { RowLabel: '@/components/admin/hero-spec-row-label' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    // Optional: the row doubles as a capability strip
                    // ("5-Axis Machining | CNC Turning | …"), where the value
                    // is the whole point and a label would just repeat it.
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      admin: {
                        description: 'Leave blank to show the value on its own.',
                      },
                    },
                    { name: 'value', type: 'text', label: 'Value', required: true },
                  ],
                },
                {
                  name: 'accentSuffix',
                  type: 'text',
                  label: 'Accent Suffix',
                  admin: {
                    description: 'Appended to the value in ember — a unit mark such as " or °.',
                    placeholder: '"',
                  },
                },
              ],
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Buttons',
              maxRows: 2,
              admin: {
                components: { RowLabel: '@/components/admin/hero-button-row-label' },
              },
              fields: [
                ...linkRowFields({ labelRequired: true, requireDestination: true }),
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
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              admin: {
                description: 'Portrait shop photo. Left empty, the block draws a placeholder frame.',
              },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            // The hero meets the sticky header, so it paints nothing and draws
            // no rule above itself.
            ...sectionSettingsFields({ defaultBackground: 'none', defaultTopDivider: false }),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
