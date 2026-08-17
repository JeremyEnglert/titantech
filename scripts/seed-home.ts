import {
  contactCardRows,
  equipment,
  industries,
  materialGroups,
  quoteCtaBand,
  serviceCardRows,
  statItems,
  valuePropItems,
} from './lib/content'
import { findMediaId, photoStems } from './lib/find-media'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed home page', async () => {
  const payload = await getSeedPayload()

  // Five-axis is the capability the page leads on, so it carries the hero.
  const fiveAxis = await findMediaId(payload, photoStems.fiveAxis)
  const mill = await findMediaId(payload, photoStems.mill)

  const equipmentItems = []
  for (const machine of equipment) {
    equipmentItems.push({
      title: machine.title,
      detail: machine.detail,
      image: await findMediaId(payload, machine.stem),
    })
  }

  await upsertPage(payload, {
    slug: 'home',
    title: 'Home',
    meta: {
      title: 'Titantech CNC — 5-Axis Precision CNC Machining | Tucson, AZ',
      description:
        'Precision 3-axis, 3+2 and 5-axis CNC milling and CNC turning for complex, tight-tolerance components to ±0.0005". Prototype to production in stainless, aluminum, tool steels, titanium and engineering plastics.',
    },
    content: [
      {
        blockType: 'hero',
        eyebrow: 'Tucson, AZ  /  Precision CNC Machining',
        title: 'Complex parts.',
        titleAccent: 'Precision',
        titleAfter: 'machined.',
        body: textToLexical(
          'TitanTech CNC provides precision 3-axis, 3+2 and 5-axis CNC milling and CNC turning for complex, tight-tolerance components. From one-off prototypes to repeat production, we machine demanding geometries across stainless steels, aluminum, tool steels, engineering plastics and other advanced materials.',
        ),
        // The capability strip the client specified. These read as a scannable
        // row rather than labelled stats, so most carry no label.
        specs: [
          { value: '5-Axis Machining' },
          { value: 'CNC Turning' },
          { label: 'Tolerances', value: '±.0005', accentSuffix: '"' },
          { value: 'Quick-Turn' },
        ],
        buttons: [
          { label: 'Request a Quote', linkType: 'custom', url: '/quote', variant: 'default' },
          {
            label: 'Call 520-668-1600',
            linkType: 'custom',
            url: 'tel:5206681600',
            variant: 'outline',
          },
        ],
        image: fiveAxis,
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'serviceCards',
        eyebrow: 'Capabilities',
        title: 'What we machine',
        intro:
          'Multi-axis milling, turning, marking and material expertise under one roof — from a single prototype through repeat production. Every job is programmed, cut, and inspected in-house.',
        cards: serviceCardRows('short').map((card) => ({
          ...card,
          link: { linkType: 'custom', url: '/services' },
        })),
        columns: 'auto',
        background: 'none',
        topDivider: false,
        blockSettings: { anchorId: 'capabilities' },
      },
      {
        blockType: 'capabilityGrid',
        eyebrow: 'Equipment',
        title: 'The machines behind the work',
        intro:
          'Modern Haas CNC equipment, programmed and maintained in-house. What each machine is for, and what it lets us take on.',
        items: equipmentItems,
        columns: '3',
        background: 'tint',
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
        background: 'none',
        topDivider: true,
        blockSettings: { anchorId: 'materials' },
      },
      {
        blockType: 'valueProps',
        eyebrow: 'Why Titantech',
        title: 'Built for complex work.',
        body: textToLexical(
          'Modern CNC equipment, advanced CAM programming and multi-axis capability allow us to take on demanding components that require more than basic machining.',
        ),
        image: mill,
        items: valuePropItems,
        background: 'tint',
        topDivider: true,
        blockSettings: { anchorId: 'about' },
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
        eyebrow: 'Industries',
        title: 'Who we machine for',
        items: industries,
        columns: 'auto',
        background: 'none',
        topDivider: true,
        blockSettings: { anchorId: 'industries' },
      },
      quoteCtaBand,
      {
        blockType: 'contactCards',
        eyebrow: 'Contact',
        title: 'Get in touch',
        cards: contactCardRows,
        showMap: true,
        background: 'deep',
        topDivider: true,
        blockSettings: { anchorId: 'contact' },
      },
    ],
  })
})
