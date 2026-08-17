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
  // SEED_TARGET has to reach each child, or seed:all would target
  // production while every step it spawns quietly seeded local.
  const result = spawnSync('pnpm', [step], { stdio: 'inherit', env: process.env })
  if (result.status !== 0) {
    console.error(`\n${step} failed — stopping.`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nAll seeds complete.')
