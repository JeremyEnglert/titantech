import { quoteCtaBand, serviceCardRows, services, statItems } from './lib/content'
import { findMediaId, photoStems } from './lib/find-media'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed services page', async () => {
  const payload = await getSeedPayload()

  // Pair each capability with the machine that actually performs it, rather
  // than decorating every section with the same photo.
  const byAnchor: Record<string, string | null> = {
    'three-axis-milling': await findMediaId(payload, photoStems.mill),
    'multi-axis-machining': await findMediaId(payload, photoStems.fiveAxis),
    'cnc-turning': await findMediaId(payload, photoStems.lathe),
  }

  await upsertPage(payload, {
    slug: 'services',
    title: 'Services',
    meta: {
      title: 'CNC Machining Services — Milling, Turning, Engraving | Tucson, AZ',
      description:
        '3-axis milling, 4th & 5th axis machining, CNC turning, laser engraving, custom parts and repair work — all programmed, cut and inspected in-house in Tucson, AZ.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Capabilities',
        title: 'What we machine',
        intro:
          'One shop, full coverage — from one-off prototypes to repeatable production runs. Every job is programmed, cut, and inspected in-house.',
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'serviceCards',
        cards: serviceCardRows('short'),
        columns: 'auto',
        background: 'none',
        topDivider: false,
      },
      // Each capability gets a full section with its own anchor, so the footer
      // links (/services#cnc-turning) land on real content rather than a card.
      ...services.flatMap((service, index) => [
        {
          blockType: 'mediaWithText' as const,
          image: byAnchor[service.anchor] ?? undefined,
          imagePosition: index % 2 === 0 ? ('left' as const) : ('right' as const),
          eyebrow: `0${index + 1}`,
          title: service.title,
          body: textToLexical(service.long),
          background: index % 2 === 0 ? ('none' as const) : ('tint' as const),
          topDivider: true,
          blockSettings: { anchorId: service.anchor },
        },
      ]),
      {
        blockType: 'richText',
        width: 'narrow',
        content: textToLexical(
          'Materials we run\n\n- Aluminum\n- Steel\n- Stainless\n- Brass and bronze\n- Titanium\n- Engineering plastics\n\nIf what you need is not on that list, ask. Most of the time the answer is yes, and when it is not we will tell you straight rather than learning it on your part.\n\nTolerances\n\nWe hold to ±0.0005" where a drawing calls for it. Not every feature needs that, and quoting a whole part at its tightest tolerance is how job shops end up expensive for no reason — so tell us which dimensions are critical and we will put the time there.',
        ),
        background: 'none',
        topDivider: true,
      },
      {
        blockType: 'stats',
        eyebrow: 'By the numbers',
        items: statItems,
        background: 'none',
        topDivider: true,
      },
      quoteCtaBand,
    ],
  })
})
