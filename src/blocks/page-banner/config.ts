import type { Block } from 'payload'

import { blockSettingsFields } from '@/fields/block-settings'
import { sectionSettingsFields } from '@/fields/section-settings'

/**
 * The compact `<h1>` header for interior pages. The home page uses the full
 * hero instead — this is the same voice at a third of the height.
 */
export const PageBannerBlock: Block = {
  slug: 'pageBanner',
  labels: {
    singular: 'Page Banner',
    plural: 'Page Banners',
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
              admin: { placeholder: 'About Titantech' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: { description: 'The page heading. Rendered as the page’s only h1.' },
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro',
              admin: { description: 'Optional. One or two sentences under the heading.' },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            // Meets the sticky header like the hero does, so it paints nothing
            // and carries its own hairline at the bottom instead of the top.
            ...sectionSettingsFields({ defaultBackground: 'none', defaultTopDivider: false }),
            ...blockSettingsFields(),
          ],
        },
      ],
    },
  ],
}
