import type { Field } from 'payload'
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkableCollections } from '@/fields/link'

// Every rich text field in the project picks one of three tiers. A tier is the
// whole policy for a surface: which marks, which headings, whether images are
// allowed. Adding a feature to a tier reaches every field on that tier at
// once, so "what is allowed where" has one answer per tier rather than one
// per field.
//
// Tiers list their features EXPLICITLY instead of spreading `defaultFeatures`.
// That spread ships ~20 features, so each editor ends up subtracting from a
// grab bag rather than stating what it wants — and it silently reintroduces
// an UNCONFIGURED LinkFeature offering every collection (including ones with
// no public route, which render as a dead '#') plus a RelationshipFeature that
// has no JSX converter and renders nothing at all.

const marks = () => [
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  InlineCodeFeature(),
]

const lists = () => [UnorderedListFeature(), OrderedListFeature()]

/** The one link configuration: collections `resolveDocHref` can actually route. */
const restrictedLink = () => LinkFeature({ enabledCollections: [...linkableCollections] })

type TierOptions = { enableImages?: boolean }

const tiers = {
  // Long-form page prose — the richText block. Full toolkit minus h1, which
  // belongs to the page's hero or banner.
  editorial: () => [
    ParagraphFeature(),
    ...marks(),
    ...lists(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    AlignFeature(),
    IndentFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    restrictedLink(),
    UploadFeature({ collections: { media: { fields: [] } } }),
    InlineToolbarFeature(),
  ],

  // Short copy inside a block's own layout — a card, a spec row, an intro.
  // No headings: the surrounding block supplies its own heading, and one here
  // would compete with it. Images off unless the caller opts in.
  body: ({ enableImages }: TierOptions = {}) => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    ...lists(),
    restrictedLink(),
    InlineToolbarFeature(),
    ...(enableImages ? [UploadFeature({ collections: { media: { fields: [] } } })] : []),
  ],

  // Utility prose with no inserts at all — form intros and confirmations.
  plain: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    ...lists(),
    restrictedLink(),
    InlineToolbarFeature(),
  ],
}

export type RichTextTier = keyof typeof tiers

export const richTextEditor = (tier: RichTextTier, options: TierOptions = {}) =>
  lexicalEditor({ features: () => tiers[tier](options) })

type RichTextFieldOptions = {
  tier: RichTextTier
  name: string
  label?: string
  required?: boolean
  description?: string
  enableImages?: boolean
}

export function richTextField({
  tier,
  name,
  label,
  required = false,
  description,
  enableImages,
}: RichTextFieldOptions): Field {
  return {
    name,
    type: 'richText',
    label,
    required,
    ...(description ? { admin: { description } } : {}),
    editor: richTextEditor(tier, { enableImages }),
  }
}

type BodyOptions = {
  name?: string
  label?: string
  required?: boolean
  description?: string
  enableImages?: boolean
}

/**
 * The `body` tier's preset. Its own function because it is by far the
 * most-used field in the project, and its `body`/`Body` defaults are part of
 * the stored shape.
 */
export function bodyRichTextField(options: BodyOptions = {}): Field {
  return richTextField({
    tier: 'body',
    name: options.name ?? 'body',
    label: options.label ?? 'Body',
    required: options.required ?? false,
    description: options.description,
    enableImages: options.enableImages,
  })
}
