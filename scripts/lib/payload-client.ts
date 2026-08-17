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

export function runSeed(name: string, fn: () => Promise<void>) {
  console.log(`=== ${name} ===`)
  fn()
    .then(() => {
      console.log(`=== ${name} done ===\n`)
      process.exit(0)
    })
    .catch((error) => {
      console.error(`${name} failed:`, error)
      process.exit(1)
    })
}
