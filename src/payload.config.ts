import sharp from 'sharp'
import {
  lexicalEditor,
  HeadingFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo';

import { siteConfig } from './utilities/site-config'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url) 
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      InlineToolbarFeature(),
      HorizontalRuleFeature(),
    ],
  }),
  collections: [Pages, Posts, Users, Media],
  plugins: [
    s3Storage({
      collections: {
        media: true, // Enable for your media collection
      },
      bucket: process.env.R2_BUCKET as string,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        },
        endpoint: process.env.R2_ENDPOINT as string,
        region: 'auto', // R2 uses 'auto' as the region
        forcePathStyle: true, // Required for R2
      },
    }),
    seoPlugin({
      generateTitle: ({ doc }) => doc.title,
      generateDescription: ({ doc }) => doc.excerpt,
      generateURL: ({ doc }) => {
        if (doc?.slug) {
          return `${siteConfig.url}/${doc.slug}`
        }
        return siteConfig.url
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
}) 