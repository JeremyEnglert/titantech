import type { Field } from 'payload'

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

export function blockFields(contentFields: Field[], extraSettingsFields?: Field[]): Field[] {
  return [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: contentFields,
        },
        {
          label: 'Settings',
          fields: [
            ...(extraSettingsFields ?? []),
            {
              name: 'blockSettings',
              type: 'group',
              label: false,
              admin: {
                hideGutter: true,
              },
              fields: [
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
                        description:
                          'Makes the gap above this block larger than the standard one.',
                      },
                    },
                    {
                      name: 'spacingBottom',
                      type: 'select',
                      label: 'Extra Spacing Bottom',
                      defaultValue: '0',
                      options: extraSpacingOptions,
                      admin: {
                        description:
                          'Makes the gap below this block larger than the standard one.',
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
          ],
        },
      ],
    },
  ]
}
