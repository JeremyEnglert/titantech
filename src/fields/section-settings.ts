import type { Field } from 'payload'

/**
 * The design separates sections two ways: some sit directly on the machined
 * page grid, others paint a surface over it (a graphite tint, a deep panel, a
 * brushed-steel band). That choice also decides the block's spacing — a
 * painted block's air is interior padding, a transparent block's air is a
 * collapsing margin — so it is one field, not two, and `SectionShell` reads it.
 *
 * Every band in the design is also separated from the one above by a CAD
 * hairline, which is why `topDivider` defaults to true.
 */
export const sectionBackgroundOptions = ['none', 'tint', 'deep', 'sheen'] as const

export type SectionBackground = (typeof sectionBackgroundOptions)[number]

type SectionSettingsOptions = {
  defaultBackground?: SectionBackground
  defaultTopDivider?: boolean
}

export function sectionSettingsFields(options: SectionSettingsOptions = {}): Field[] {
  const { defaultBackground = 'none', defaultTopDivider = true } = options

  return [
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: defaultBackground,
      options: [
        { label: 'None — machined grid', value: 'none' },
        { label: 'Graphite tint', value: 'tint' },
        { label: 'Deep graphite panel', value: 'deep' },
        { label: 'Brushed steel band', value: 'sheen' },
      ],
      admin: {
        description:
          'Anything other than "None" paints a surface, which also switches this block from an outer gap to interior padding.',
      },
    },
    {
      name: 'topDivider',
      type: 'checkbox',
      label: 'Hairline divider above',
      defaultValue: defaultTopDivider,
      admin: {
        description: 'Draws the thin CAD rule that separates bands in the design.',
      },
    },
    {
      name: 'joinPrevious',
      type: 'checkbox',
      label: 'Continue the block above',
      defaultValue: false,
      admin: {
        description:
          'Removes the space above this block so it reads as part of the previous one — e.g. a stat row sitting directly under the section it belongs to. Without this, two painted blocks each contribute their own interior padding and the seam gets twice as tall as a normal gap.',
      },
    },
  ]
}
