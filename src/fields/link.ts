import type { Field } from 'payload'

/**
 * What a link can point at: every collection with a public route, plus media —
 * editors link to uploaded PDFs (capability sheets, terms) from both block
 * buttons and rich text, and `resolveDocHref` resolves those to the file URL.
 *
 * Shared by the block link fields and by LinkFeature, so the admin can never
 * offer a target the resolver doesn't know how to route.
 */
export const linkableCollections = ['pages', 'posts', 'media'] as const

type LinkFieldOptions = {
  includeLabel?: boolean
  labelText?: string
  labelDescription?: string
  labelRequired?: boolean
  includeNewTab?: boolean
  // `required` can't express "url OR doc, depending on linkType", so the
  // requirement is enforced by validators on both fields instead.
  requireDestination?: boolean
}

/**
 * Returns the fields flat, for spreading into an array row that already has
 * its own label/appearance fields. Use `linkGroup` for the single-link case.
 *
 * The stored shape deliberately mirrors what Lexical's link drawer writes
 * (`linkType`/`url`/`doc`/`newTab`) so one resolver serves block links and
 * rich-text link nodes alike.
 */
export function linkRowFields(options: LinkFieldOptions = {}): Field[] {
  const {
    includeLabel = true,
    labelText = 'Button Text',
    labelDescription,
    labelRequired = false,
    includeNewTab = true,
    requireDestination = false,
  } = options

  return [
    ...(includeLabel
      ? [
          {
            name: 'label',
            type: 'text' as const,
            label: labelText,
            required: labelRequired,
            ...(labelDescription ? { admin: { description: labelDescription } } : {}),
          },
        ]
      : []),
    {
      // Radio rather than select, to match how the Lexical drawer renders it.
      name: 'linkType',
      type: 'radio',
      label: 'Link Type',
      defaultValue: 'custom',
      options: [
        { label: 'Custom URL', value: 'custom' },
        { label: 'Internal Link', value: 'internal' },
      ],
      admin: {
        layout: 'horizontal',
        description:
          'A custom URL also covers tel: and mailto: links. An internal link survives the target page being renamed.',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Enter a URL',
      admin: {
        // Not `=== 'custom'`: rows seeded before this field existed have no
        // linkType at all, and the URL field has to stay visible for them.
        condition: (_, siblingData) => siblingData?.linkType !== 'internal',
        placeholder: '/services, tel:5206681600, or https://…',
      },
      ...(requireDestination
        ? {
            validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
              if (siblingData?.linkType === 'internal') return true
              return value ? true : 'This field is required.'
            },
          }
        : {}),
    },
    {
      name: 'doc',
      type: 'relationship',
      label: 'Choose a document to link to',
      relationTo: [...linkableCollections],
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === 'internal',
      },
      ...(requireDestination
        ? {
            validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
              if (siblingData?.linkType !== 'internal') return true
              return value ? true : 'This field is required.'
            },
          }
        : {}),
    },
    ...(includeNewTab
      ? [{ name: 'newTab', type: 'checkbox' as const, label: 'Open in new tab' }]
      : []),
  ] as Field[]
}

type LinkGroupOptions = LinkFieldOptions & {
  name?: string
  label?: string
  description?: string
}

export function linkGroup(options: LinkGroupOptions = {}): Field {
  const { name = 'button', label = 'Button', description, ...fieldOptions } = options

  return {
    name,
    type: 'group',
    label,
    ...(description ? { admin: { description } } : {}),
    fields: linkRowFields(fieldOptions),
  }
}

/** Menu-item shape: a label plus a destination, with an optional description. */
export function menuLinkFields(): Field[] {
  return [
    { name: 'label', type: 'text', label: 'Label', required: true },
    ...linkRowFields({ includeLabel: false, requireDestination: false }),
  ]
}
