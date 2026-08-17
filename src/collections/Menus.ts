import type { CollectionConfig, Field } from 'payload'
import { revalidateTag } from 'next/cache'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { menuLinkFields } from '@/fields/link'

export const menuLocations = [
  { label: 'Main Navigation (Header)', value: 'main' },
  { label: 'Footer — Services', value: 'footer-services' },
  { label: 'Footer — Connect', value: 'footer-connect' },
] as const

export type MenuLocation = (typeof menuLocations)[number]['value']

const rowLabel = { components: { RowLabel: '@/components/admin/menu-item-row-label' } }

const itemFields: Field[] = menuLinkFields()

const childItems: Field = {
  name: 'children',
  type: 'array',
  label: 'Sub-items',
  labels: { singular: 'Sub-item', plural: 'Sub-items' },
  admin: { initCollapsed: true, ...rowLabel },
  fields: itemFields,
}

function safeRevalidate(doc: unknown) {
  try {
    revalidateTag('menus', 'max')
    const { location } = doc as { location?: unknown }
    if (typeof location === 'string') revalidateTag(`menu:${location}`, 'max')
  } catch {
    // Outside a Next.js request context (e.g. seed scripts) revalidateTag throws.
  }
}

export const Menus: CollectionConfig = {
  slug: 'menus',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Global',
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'updatedAt'],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    {
      name: 'location',
      type: 'select',
      label: 'Location',
      options: [...menuLocations],
      // Each location can only be claimed by one menu. Because the field isn't
      // required, Mongo's index is sparse, so unlimited blank-location menus
      // are still allowed.
      unique: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      admin: { initCollapsed: true, ...rowLabel },
      fields: [...itemFields, childItems],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (!context?.disableRevalidate) safeRevalidate(doc)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { context } }) => {
        if (!context?.disableRevalidate) safeRevalidate(doc)
        return doc
      },
    ],
  },
}
