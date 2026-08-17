import { spawnSync } from 'node:child_process'

// Order matters: the page seeds look up forms by title, and the header/footer
// read the menus and site settings the earlier steps create.
const steps = [
  'seed:site-settings',
  'seed:forms',
  'seed:menus',
  'seed:home',
  'seed:about',
  'seed:services',
  'seed:contact',
  'seed:quote',
]

for (const step of steps) {
  const result = spawnSync('pnpm', [step], { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`\n${step} failed — stopping.`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nAll seeds complete. Clear .next/cache so the menu cache picks up the new nav.')
