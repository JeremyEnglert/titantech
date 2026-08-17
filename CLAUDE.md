# Titantech CNC

Payload CMS + Next.js site for a precision machining job shop in Tucson, AZ.
The source design is `design/titantech-v1-industrial-metal.html` — a static
Tailwind mockup that remains the reference for every visual decision.

## Conventions

- Use kebab-case for non-collection file names (`service-cards.tsx`, not `ServiceCards.tsx`). Collection files use PascalCase matching their plural name (`Menus.ts`, `QuoteAttachments.ts`) since they map to database collections.
- No barrel files — import directly from source files, never re-export via `index.ts`.
- Comments explain "why", not "what" — skip comments that restate the code.
- Prefer clarity over brevity in naming — no abbreviations except: `id`, `url`, `api`, `props`, `params`, `env`.
- Always use auto-generated Payload types from `@/payload-types` — never recreate them manually. Derive block props with `Extract<NonNullable<Page['content']>[number], { blockType: 'x' }>`.
- Block configs go in `src/blocks/{name}/config.ts`, UI components go in `src/components/{name}.tsx` — never put React components in `src/blocks/`.
- Block slugs are camelCase (`serviceCards`); every block sets `labels: { singular, plural }` and `admin: { disableBlockName: true }`.
- Every array field of substance gets a `RowLabel` component in `src/components/admin/`. Run `pnpm payload generate:importmap` after adding one.

## Spacing

- Every page block is either **transparent** (paints no background — the body's machined grid shows through) or **painted** (paints a tint, a deep panel, or the brushed-steel band). The choice is one editor field, `background`, defined in `src/fields/section-settings.ts`.
- `src/components/section-shell.tsx` is the single place that rule is applied: transparent → `default-block-margin`, painted → `painted-block-padding`. **Blocks must never apply their own outer `py-*`/`my-*`.** Touching margins collapse into ONE gap, so every gap on the page is the same size, and painted blocks stack flush.
- The render-blocks wrapper carries zero spacing; the editor's Extra Spacing renders there as a LARGER margin that outbids the standard gap via collapse (the options mean "bigger total gap", not "added space"). Margin collapsing requires normal block flow: never make the blocks container flex/grid or give it `gap`/`space-y`.

## Design system

- **Dark only.** There is no light mode and no theme toggle. The palette lives on `:root` in `src/app/(web)/globals.css` — raw `--graphite-*` / `--steel-*` / `--ember*` values, aliased into Tailwind through `@theme inline`, then mapped onto the shadcn semantic tokens.
- Tailwind v4, CSS-first. **There is no `tailwind.config.ts`** — do not create one.
- Page container: `mx-auto w-full max-w-7xl px-5 sm:px-8`. `SectionShell` applies it; blocks should not repeat it. **Never use the Tailwind `container` class** — in v4 it is unconfigured and does almost nothing.
- **Square corners everywhere.** `--radius` is `0px`; machined edges are the whole point. No `rounded-*`.
- Every border is the CAD hairline (`--border`, steel at 18%) via the `hairline` / `hairline-t` / `hairline-b` utilities.
- Grids of cells draw their internal borders with `gap-px bg-graphite-500/30 hairline` over `bg-graphite-850` cells — not with per-cell borders.
- Type: `font-display` is Saira Condensed (headlines, buttons, stat figures — uppercase, tight tracking, heavy weights); `font-mono` is JetBrains Mono and is the **body default**. Numbers that must column-align get `tabular`.
- Ember is the only accent. Use it sparingly: the short rule before an eyebrow, stat suffixes, the primary CTA, hover states, the focus ring.
- Icons are inline SVG in `src/components/icons.tsx`, selected by name through a Payload `select` fed by `iconOptions`. They inherit `currentColor`, which is what lets a card recolour its icon on hover — an uploaded SVG through `next/image` cannot.

## Rich text

Rich text is configured in **tiers**, never per field: `editorial` (long-form page prose), `body` (short copy inside a block's own layout), `plain` (no inserts). Use `richTextField({ tier, name })` / `bodyRichTextField()` from `src/fields/rich-text-tiers.ts`. Never hand-roll a `lexicalEditor()` on a field, and **never spread `defaultFeatures`** — it silently reintroduces an unrestricted link drawer offering collections with no public route, plus a relationship node that has no renderer and draws nothing.

## Seeding

Seed scripts are standalone `tsx` scripts in `scripts/`, run via `pnpm seed:*`.

- `loadEnv()` must run **before** the dynamic `await import('../src/payload.config')`.
- Upsert by slug (`find` → `update` or `create`), never blind-create.
- **`context: { disableRevalidate: true }` on every write** — the revalidate hooks call `revalidatePath`/`revalidateTag`, which throw outside a Next request context.
- Set `_status: 'published'` explicitly; use `depth: 0` on reads used only for id extraction.
- Rich text values are Lexical JSON — build them with `scripts/lib/text-to-lexical.ts`. A plain string is rejected or renders empty.
- After seeding menus, clear `.next/cache`: `getMenu`'s `unstable_cache` persists to disk and survives a server restart.

## Environment

`DATABASE_URI` (or `MONGODB_URI`, which Vercel's Atlas integration injects), `PAYLOAD_SECRET`, `NEXT_PUBLIC_URL`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`, `QUOTE_NOTIFICATION_EMAIL`.

Media falls back to local disk when `BLOB_READ_WRITE_TOKEN` is unset, and email falls back to Payload's console logger when `RESEND_API_KEY` is unset, so a fresh clone runs with nothing but Mongo.
