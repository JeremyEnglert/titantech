import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { resendAdapter } from '@payloadcms/email-resend'

import { siteConfig } from './utilities/site-config'
import { richTextEditor } from './fields/rich-text-tiers'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Menus } from './collections/Menus'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { QuoteAttachments } from './collections/QuoteAttachments'
import { SiteSettings } from './globals/site-settings'
import { fileUploadField } from './forms/fields/file-upload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Vercel's MongoDB Atlas integration injects MONGODB_URI; the project's own
// convention (and every other Materiell site) is DATABASE_URI. Accept either
// rather than renaming one of them.
const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || ''

// Media lives on Vercel Blob in every deployed environment. Locally the token
// is usually absent, and falling back to disk means `pnpm seed:media` works on
// a fresh clone with nothing but Mongo running.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const resendKey = process.env.RESEND_API_KEY

export default buildConfig({
  admin: {
    user: Users.slug,
    // Payload defaults to Gravatar, which sends a hash of every admin user's
    // email to gravatar.com on each page load. `default` uses the built-in
    // initials avatar instead — no third-party request.
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // The site-wide default editor is the editorial tier. Individual fields pick
  // their own tier via richTextField() — see fields/rich-text-tiers.ts for why
  // defaultFeatures is never spread.
  editor: richTextEditor('editorial'),
  collections: [Pages, Posts, Menus, Users, Media, QuoteAttachments],
  globals: [SiteSettings],
  email: resendKey
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Titantech CNC',
        apiKey: resendKey,
      })
    : undefined,
  plugins: [
    ...(blobToken
      ? [
          vercelBlobStorage({
            collections: { media: true, 'quote-attachments': true },
            token: blobToken,
          }),
        ]
      : []),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    formBuilderPlugin({
      fields: {
        // The plugin has no file field, and "email your drawing or STEP file"
        // is the single most important thing this site asks a visitor to do.
        payment: false,
        fileUpload: fileUploadField,
      },
      formOverrides: {
        admin: { group: 'Forms' },
      },
      formSubmissionOverrides: {
        admin: { group: 'Forms' },
        fields: ({ defaultFields }) =>
          defaultFields.map((field) => {
            // The plugin ships `form` unindexed. Every "submissions for this
            // form" read then collection-scans the whole table.
            if (field.type === 'relationship' && field.name === 'form') {
              return { ...field, index: true }
            }
            return field
          }),
      },
    }),
    seoPlugin({
      generateTitle: ({ doc }) => doc.title,
      generateDescription: ({ doc }) => doc.excerpt,
      generateURL: ({ doc }) => (doc?.slug ? `${siteConfig.url}/${doc.slug}` : siteConfig.url),
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: databaseUri,
  }),
  sharp,
})
