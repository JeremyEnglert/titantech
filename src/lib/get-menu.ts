import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Menu } from '@/payload-types'
import type { MenuLocation } from '@/collections/Menus'
import { type ResolvedLink, resolveLink } from '@/lib/resolve-link'

export type ResolvedMenuItem = ResolvedLink & {
  label: string
  children: ResolvedMenuItem[]
}

async function fetchMenu(location: string): Promise<Menu | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'menus',
    where: { location: { equals: location } },
    // depth 1 so internal links carry the target's slug — resolveLink cannot
    // route a bare id.
    depth: 1,
    limit: 1,
  })
  return (result.docs[0] as Menu) ?? null
}

/**
 * NOTE: this cache persists to `.next/cache` on disk, so a server restart does
 * NOT clear it. After seeding or importing menus, delete `.next/cache` (or
 * edit and save the menu once in the admin) or the old nav will keep rendering.
 */
export function getMenu(location: MenuLocation) {
  return unstable_cache(() => fetchMenu(location), ['menu', location], {
    tags: ['menus', `menu:${location}`],
  })()
}

type RawMenuItem = {
  label?: string | null
  children?: RawMenuItem[] | null
} & Record<string, unknown>

function resolveMenuItems(items: RawMenuItem[] | null | undefined): ResolvedMenuItem[] {
  if (!items?.length) return []

  return items.flatMap((item) => {
    const resolved = resolveLink(item, item.label)
    // A menu row with no destination is a half-finished edit, not a heading —
    // dropping it beats rendering an anchor that goes nowhere.
    if (!resolved || !item.label) return []

    return [
      {
        ...resolved,
        label: item.label,
        children: resolveMenuItems(item.children),
      },
    ]
  })
}

export async function getResolvedMenu(location: MenuLocation): Promise<ResolvedMenuItem[]> {
  const menu = await getMenu(location)
  if (!menu) return []
  return resolveMenuItems(menu.items as RawMenuItem[] | null | undefined)
}
