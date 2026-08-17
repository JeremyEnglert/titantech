import type { Block } from 'payload'

import { iconOptions } from '@/components/icons'
import { blockSettingsFields } from '@/fields/block-settings'
import { sectionSettingsFields } from '@/fields/section-settings'

/**
 * One grid, three jobs: materials (category + grades), industries served
 * (bare titles), and equipment (photo + machine + what it does). They share a
 * shape — a labelled cell in the hairline grid — so they share a block rather
 * than three near-identical ones that would drift apart.
 */
export const CapabilityGridBlock: Block = {
  slug: 'capabilityGrid',
  labels: {
    singular: 'Capability Grid',
    plural: 'Capability Grids',
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
              admin: { placeholder: 'Materials' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              admin: { placeholder: 'What we cut' },
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
          label: 'Items',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              minRows: 1,
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/capability-grid-row-label' },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'detail',
                  type: 'textarea',
                  label: 'Detail',
                  admin: {
                    description:
                      'Optional. The supporting line under the title — grades, specs, or what the machine does. Leave empty for a title-only tile, e.g. an industry served.',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  admin: {
                    description:
                      'Optional 4:3 photo at the top of the tile — used for equipment. When set, it replaces the icon.',
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: iconOptions,
                  admin: {
                    description:
                      'Optional. Drawn inline so it inherits the ember accent — see components/icons.tsx. Ignored when an image is set.',
                  },
                },
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
                  'Auto picks the column count that leaves the fewest gaps in the last row — a gap shows as an empty lit cell.',
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
