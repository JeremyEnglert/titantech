import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

/**
 * Customer drawings, STEP files and photos submitted through the quote form.
 *
 * Anyone can create (that is the whole point of a public quote form) but only
 * an authenticated user can list, update or delete. Note the limit of that
 * guarantee: the underlying Vercel Blob object is served from a public,
 * unguessable URL, so access control here protects the *index* of files, not
 * each file. Customer prints are often proprietary — if that ever needs to be
 * a real boundary, move this collection to an S3/R2 adapter with
 * `signedDownloads` enabled and keep the rest of this file as-is.
 */
export const QuoteAttachments: CollectionConfig = {
  slug: 'quote-attachments',
  labels: { singular: 'Quote Attachment', plural: 'Quote Attachments' },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Forms',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'submittedBy', 'createdAt'],
    description: 'Files customers attached to a quote request.',
  },
  fields: [
    {
      name: 'submittedBy',
      type: 'text',
      label: 'Submitted by',
      admin: {
        readOnly: true,
        description: 'Captured from the quote form so an orphaned file can still be traced.',
      },
    },
  ],
  upload: {
    // Print and CAD formats a job shop actually receives, plus photos of a
    // part on a bench — which is explicitly invited by the quote copy.
    mimeTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'image/jpeg',
      'image/png',
      'image/heic',
      'model/step',
      'model/iges',
      'model/stl',
      'image/vnd.dxf',
      'application/acad',
    ],
    // Deliberately no image resizing: a customer's drawing must survive
    // upload byte-for-byte, and re-encoding a print to webp would destroy it.
    disableLocalStorage: false,
  },
}
