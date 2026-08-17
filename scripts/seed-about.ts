import { equipment, industries, quoteCtaBand, statItems, valuePropItems } from './lib/content'
import { findMediaId, photoStems } from './lib/find-media'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed about page', async () => {
  const payload = await getSeedPayload()

  const mill = await findMediaId(payload, photoStems.mill)
  const lathe = await findMediaId(payload, photoStems.lathe)

  const equipmentItems = []
  for (const machine of equipment) {
    equipmentItems.push({
      title: machine.title,
      detail: machine.detail,
      image: await findMediaId(payload, machine.stem),
    })
  }

  await upsertPage(payload, {
    slug: 'about',
    title: 'About',
    meta: {
      title: 'About Titantech CNC — Precision CNC Machine Shop in Tucson, AZ',
      description:
        'A precision CNC machine shop in Tucson built for complex, tight-tolerance work. Multi-axis Haas equipment, advanced CAM programming, and inspection in-house.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Why Titantech',
        title: 'Built for complex work.',
        intro:
          'Modern CNC equipment, advanced CAM programming and multi-axis capability allow us to take on demanding components that require more than basic machining.',
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'mediaWithText',
        image: mill,
        imagePosition: 'left',
        eyebrow: 'The shop',
        title: 'Programming, machining and inspection under one roof.',
        body: textToLexical(
          'Nothing gets farmed out to a shop we cannot walk into. The person who quotes your component is the person who programs and runs it, which is why we can tell you on the phone what a part will take instead of calling you back tomorrow.\n\nIt also means an ambiguity on the print gets caught at the screen — during CAM, while the fix still costs time rather than material and a scrapped first article.',
        ),
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'valueProps',
        eyebrow: 'How we work',
        title: 'What lets us take the hard jobs.',
        body: textToLexical(
          'Complex components fail on the details — a positional relationship across three faces, a finish requirement on a blended surface, a material that work-hardens the moment the strategy is wrong. Those are what we build around.',
        ),
        image: lathe,
        items: valuePropItems,
        background: 'tint',
        topDivider: true,
      },
      {
        blockType: 'stats',
        items: statItems,
        background: 'tint',
        topDivider: false,
        joinPrevious: true,
      },
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Equipment',
        title: 'The machines behind the work',
        items: equipmentItems,
        columns: '3',
        background: 'none',
        topDivider: true,
        blockSettings: { anchorId: 'equipment' },
      },
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Industries',
        title: 'Who we machine for',
        items: industries,
        columns: 'auto',
        background: 'tint',
        topDivider: true,
      },
      {
        blockType: 'richText',
        width: 'narrow',
        content: textToLexical(
          'Who we work with\n\nEngineers, buyers and sourcing teams who need a component that has to be right — aerospace and defense hardware, semiconductor and robotics parts, energy components, and the R&D work that turns into production once it proves out.\n\nWe are equally set up for a single qualifying prototype and for a repeat production order. The programs, fixturing and inspection carry across, so the part you approve is the part you keep receiving.\n\nWhat we need from you\n\nA drawing or a STEP file and a quantity. If a tolerance genuinely matters, call it out — knowing which features are critical lets us put the time where it counts and keep it off the ones that do not.\n\nIf you have not settled on a material, say so. Recommending one is part of the quote.',
        ),
        background: 'none',
        topDivider: true,
      },
      quoteCtaBand,
    ],
  })
})
