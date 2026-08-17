import type { Block } from 'payload'

/**
 * A file-upload field for the form builder, which ships without one.
 *
 * The plugin stores every submission answer as `{ field, value }` where value
 * is a string, so this field's value is the id of a `quote-attachments`
 * document. The browser uploads the file to that collection first and submits
 * the resulting id — see `src/components/form-fields/file-upload-field.tsx`.
 */
export const fileUploadField: Block = {
  slug: 'fileUpload',
  labels: { singular: 'File Upload', plural: 'File Uploads' },
  admin: { disableBlockName: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name (lowercase, no spaces)',
          required: true,
          defaultValue: 'attachment',
          admin: { width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          defaultValue: 'Drawing, STEP file or photo',
          localized: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Field Width (percentage)',
          admin: { width: '50%' },
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Required',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'helpText',
      type: 'text',
      label: 'Help text',
      defaultValue: 'PDF, STEP, IGES, DXF, STL, ZIP or a photo. Up to 10MB.',
    },
  ],
}
