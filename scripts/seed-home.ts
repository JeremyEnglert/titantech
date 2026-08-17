import {
  contactCardRows,
  quoteCtaBand,
  serviceCardRows,
  statItems,
  valuePropItems,
} from './lib/content'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed home page', async () => {
  const payload = await getSeedPayload()

  await upsertPage(payload, {
    slug: 'home',
    title: 'Home',
    meta: {
      title: 'Titantech CNC — Precision Machining | Tucson, AZ',
      description:
        'Precision machining job shop in Tucson, AZ. 3-axis milling, 4th & 5th axis machining, CNC turning, laser engraving and custom parts to ±0.0005". Request a quote.',
    },
    content: [
      {
        blockType: 'hero',
        eyebrow: 'Tucson, AZ  /  Lat 32.1°N  Lon 110.9°W',
        title: 'Precision parts,',
        titleAccent: 'machined',
        titleAfter: 'to spec.',
        body: textToLexical(
          'Titantech CNC is a Tucson precision machining job shop running modern Haas VF-2SS mills and CNC lathes. We deliver tight-tolerance automotive and general parts — fast quotes, fast lead times, no compromise on quality.',
        ),
        specs: [
          { label: 'Tolerance', value: '±0.0005', accentSuffix: '"' },
          { label: 'Lead time', value: 'Quick-turn' },
          { label: 'Axis', value: '3 · 4 · 5' },
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
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'serviceCards',
        eyebrow: 'Capabilities',
        title: 'What we machine',
        intro:
          'One shop, full coverage — from one-off prototypes to repeatable production runs. Every job is programmed, cut, and inspected in-house.',
        cards: serviceCardRows('short').map((card) => ({
          ...card,
          link: { linkType: 'custom', url: '/services' },
        })),
        columns: 'auto',
        background: 'none',
        topDivider: false,
        blockSettings: { anchorId: 'services' },
      },
      {
        blockType: 'valueProps',
        eyebrow: 'Why Titantech',
        title: 'A small shop with serious capability.',
        body: textToLexical(
          "We're a family-run machine shop in Tucson with 20+ years of combined experience behind the spindle. Big enough to hold real tolerances on automotive and general parts — small enough to actually pick up the phone.",
        ),
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
      quoteCtaBand,
      {
        blockType: 'contactCards',
        eyebrow: 'Contact',
        title: 'Get in touch',
        cards: contactCardRows,
        background: 'deep',
        topDivider: true,
        blockSettings: { anchorId: 'contact' },
      },
    ],
  })
})
