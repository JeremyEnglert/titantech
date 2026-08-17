import type { Payload } from 'payload'

/**
 * Look a seeded photo up by filename stem. Uploads are converted to webp, so
 * the stored filename loses its original extension — matching on the stem is
 * what survives that.
 *
 * Returns null rather than throwing: every image field on the site is
 * optional, and a page seed should still produce a page if the photo hasn't
 * been uploaded yet.
 */
export async function findMediaId(payload: Payload, stem: string): Promise<string | null> {
  const result = await payload.find({
    collection: 'media',
    where: { filename: { like: stem } },
    limit: 1,
    depth: 0,
  })

  const id = result.docs[0]?.id
  if (!id) {
    console.warn(`  ! no media found for "${stem}" — run \`pnpm seed:media\` first`)
    return null
  }
  return String(id)
}

/** The three client shop photos, by the machine in frame. */
export const photoStems = {
  fiveAxis: 'haas-umc-500ss',
  lathe: 'haas-tl-1p-lathe',
  mill: 'haas-vf-2ss-mill',
} as const
