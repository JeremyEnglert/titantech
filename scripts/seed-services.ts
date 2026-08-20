import {
  equipment,
  industries,
  materialGroups,
  quoteCtaBand,
  serviceCardRows,
  services,
  statItems,
} from './lib/content'
import { findMediaId, photoStems } from './lib/find-media'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed services page', async () => {
  const payload = await getSeedPayload()

  // Pair each capability with the machine that actually performs it, rather
  // than decorating every section with the same photo.
  const byAnchor: Record<string, string | null> = {
    'five-axis-machining': await findMediaId(payload, photoStems.fiveAxis),
    'cnc-milling': await findMediaId(payload, photoStems.mill),
    'cnc-turning': await findMediaId(payload, photoStems.lathe),
  }

  const equipmentItems = []
  for (const machine of equipment) {
    equipmentItems.push({
      title: machine.title,
      detail: machine.detail,
      image: await findMediaId(payload, machine.stem),
    })
  }

  await upsertPage(payload, {
    slug: 'services',
    title: 'Services',
    meta: {
      title: '5-Axis CNC Machining, Milling & Turning Services | Tucson, AZ',
      description:
        'Advanced 5-axis CNC machining, 3-axis milling, CNC turning, laser engraving and part marking. Complex, tight-tolerance components from prototype to production in Tucson, AZ.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Capabilities',
        title: 'What we machine',
        intro:
          'Precision 3-axis and 5-axis CNC milling and CNC turning for complex, tight-tolerance components — programmed, cut and inspected in-house.',
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
      ...services.map((service, index) => ({
        blockType: 'mediaWithText' as const,
        image: byAnchor[service.anchor] ?? undefined,
        imagePosition: index % 2 === 0 ? ('left' as const) : ('right' as const),
        eyebrow: `0${index + 1}`,
        title: service.title,
        body: textToLexical(service.long),
        background: index % 2 === 0 ? ('none' as const) : ('tint' as const),
        topDivider: true,
        blockSettings: { anchorId: service.anchor },
      })),
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Equipment',
        title: 'The machines behind the work',
        intro:
          'Modern Haas CNC equipment, programmed and maintained in-house. What each machine is for, and what it lets us take on.',
        items: equipmentItems,
        columns: '3',
        background: 'none',
        topDivider: true,
        blockSettings: { anchorId: 'equipment' },
      },
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Materials',
        title: 'Materials we machine',
        intro:
          'Common production grades through demanding alloys and engineering plastics. If what you need is not listed, ask — the answer is usually yes.',
        items: materialGroups,
        columns: '3',
        background: 'tint',
        topDivider: true,
        blockSettings: { anchorId: 'materials' },
      },
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Industries',
        title: 'Who we machine for',
        items: industries,
        columns: 'auto',
        background: 'none',
        topDivider: true,
        blockSettings: { anchorId: 'industries' },
      },
      {
        blockType: 'richText',
        width: 'narrow',
        content: textToLexical(
          '## Tolerances\n\nWe hold tight tolerances where a drawing calls for them. Not every feature needs one, and quoting a whole component at its tightest tolerance is how a shop ends up expensive for no reason — so call out the dimensions that are critical and we will put the time there.\n\nInspection happens in-house alongside programming and machining, which is what lets us catch a problem while the setup is still on the machine.\n\n## What to send\n\nA drawing or a STEP file and a quantity is enough to start. If the component has a critical fit, a surface finish requirement, or a material you have already qualified, include it — those are the constraints that change how a part is programmed and fixtured.\n\nIf you have not settled on a material, say so. Recommending one is part of the quote.'
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
