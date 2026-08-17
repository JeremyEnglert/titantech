import type { Field } from 'payload'

import { formatSlug } from '@/fields/slug/formatSlug'

// The standard gap between blocks is owned by the block components themselves
// (the `default-block-margin` utility in globals.css); these options render as
// a LARGER wrapper margin that outbids the standard gap via margin collapse,
// so each one means "a bigger total gap", not "added space".
const extraSpacingOptions = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '8' },
  { label: 'Medium', value: '16' },
  { label: 'Large', value: '24' },
]

const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  label: 'Anchor ID',
  admin: {
    description:
      'Optional. Adds an ID to this block so it can be linked to directly, e.g. an ID of "services" is linked as /page-slug#services.',
    placeholder: 'services',
  },
  hooks: {
    // Editors type headings, not slugs — normalize so the value that lands in
    // the markup is always a valid, linkable anchor.
    beforeValidate: [({ value }) => (typeof value === 'string' ? formatSlug(value) : value)],
  },
}

/**
 * The prose counterpart, for `*Lexical` block registrations. Same group name,
 * so an anchored block stores its ID at the same path whichever editor placed
 * it — but the spacing and hide options are left out, since inside prose the
 * gap belongs to the paragraph rhythm rather than the page spacing system.
 */
export function inlineBlockSettingsFields(): Field[] {
  return [
    {
      name: 'blockSettings',
      type: 'group',
      label: 'Block Settings',
      admin: { hideGutter: true },
      fields: [anchorIdField],
    },
  ]
}

export function blockSettingsFields(): Field[] {
  return [
    {
      name: 'blockSettings',
      type: 'group',
      label: 'Block Settings',
      admin: { hideGutter: true },
      fields: [
        anchorIdField,
        {
          type: 'row',
          fields: [
            {
              name: 'spacingTop',
              type: 'select',
              label: 'Extra Spacing Top',
              defaultValue: '0',
              options: extraSpacingOptions,
              admin: {
                description: 'Makes the gap above this block larger than the standard one.',
              },
            },
            {
              name: 'spacingBottom',
              type: 'select',
              label: 'Extra Spacing Bottom',
              defaultValue: '0',
              options: extraSpacingOptions,
              admin: {
                description: 'Makes the gap below this block larger than the standard one.',
              },
            },
          ],
        },
        {
          name: 'hidden',
          type: 'checkbox',
          label: 'Hide this block',
          defaultValue: false,
          admin: {
            description: 'When enabled, this block will not be displayed on the front-end.',
          },
        },
      ],
    },
  ]
}
