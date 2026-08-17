import path from 'node:path'
import { existsSync, rmSync } from 'node:fs'

import { config as loadEnv } from 'dotenv'

loadEnv()

/**
 * Env must be loaded before payload.config is evaluated — the config reads
 * DATABASE_URI and the storage/email tokens at module scope, so a static
 * import here would connect to nothing.
 */
export async function getSeedPayload() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../../src/payload.config')
  return getPayload({ config })
}

/**
 * Every seed write passes this. The collections' afterChange hooks call
 * revalidatePath/revalidateTag, which throw outside a Next request context.
 */
export const seedContext = { context: { disableRevalidate: true } } as const

export function logStep(message: string) {
  console.log(`  · ${message}`)
}

/**
 * Seeds write with `disableRevalidate`, because `revalidateTag` throws outside
 * a Next request context. The cost is that anything read through
 * `unstable_cache` — site settings, menus — keeps serving the pre-seed value,
 * and that cache lives on disk in `.next/cache`, so it survives a dev-server
 * restart. Clearing it here is what makes a seed actually visible; leaving it
 * to a README note means chasing a phantom every time.
 */
function clearNextCache() {
  // Two locations, both real: `next build` writes `.next/cache`, and Next 16's
  // Turbopack dev server writes `.next/dev/cache`. The dev one is on disk, not
  // in memory, so it survives a server restart — which makes a stale seed look
  // like a bug in the code rather than a cold cache.
  const cacheDirs = ['.next/cache', '.next/dev/cache'].map((dir) =>
    path.resolve(process.cwd(), dir),
  )

  cacheDirs.filter(existsSync).forEach((dir) => {
    rmSync(dir, { recursive: true, force: true })
    console.log(`  cleared ${path.relative(process.cwd(), dir)}`)
  })
}

export function runSeed(name: string, fn: () => Promise<void>) {
  console.log(`=== ${name} ===`)
  fn()
    .then(() => {
      clearNextCache()
      console.log(`=== ${name} done ===\n`)
      process.exit(0)
    })
    .catch((error) => {
      console.error(`${name} failed:`, error)
      process.exit(1)
    })
}
