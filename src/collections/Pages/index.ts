import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticated-or-published'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../utilities/populate-published-at'
import { generatePreviewPath } from '../../utilities/generate-preview-path'
import { revalidateDelete, revalidatePage } from './hooks/revalidate-page'
import { CapabilityGridBlock } from '@/blocks/capability-grid/config'
import { ContactCardsBlock } from '@/blocks/contact-cards/config'
import { CtaBandBlock } from '@/blocks/cta-band/config'
import { FormBlock } from '@/blocks/form/config'
import { HeroBlock } from '@/blocks/hero/config'
import { MediaWithTextBlock } from '@/blocks/media-with-text/config'
import { PageBannerBlock } from '@/blocks/page-banner/config'
import { RichTextBlock } from '@/blocks/rich-text/config'
import { ServiceCardsBlock } from '@/blocks/service-cards/config'
import { StatsBlock } from '@/blocks/stats/config'
import { ValuePropsBlock } from '@/blocks/value-props/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'blocks',
              // Ordered the way a page is usually built: the two <h1> blocks
              // first, then content, then the closing calls to action.
              blocks: [
                HeroBlock,
                PageBannerBlock,
                ServiceCardsBlock,
                ValuePropsBlock,
                StatsBlock,
                CapabilityGridBlock,
                MediaWithTextBlock,
                RichTextBlock,
                FormBlock,
                CtaBandBlock,
                ContactCardsBlock,
              ],
              required: false,
              label: false,
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaDescriptionField({}),
            MetaImageField({
              relationTo: 'media',
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'seo.title',
              descriptionPath: 'seo.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}