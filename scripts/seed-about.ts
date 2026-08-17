import { quoteCtaBand, statItems, valuePropItems } from './lib/content'
import { findMediaId, photoStems } from './lib/find-media'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed about page', async () => {
  const payload = await getSeedPayload()

  const mill = await findMediaId(payload, photoStems.mill)
  const lathe = await findMediaId(payload, photoStems.lathe)

  await upsertPage(payload, {
    slug: 'about',
    title: 'About',
    meta: {
      title: 'About Titantech CNC — Family-Run Machine Shop in Tucson',
      description:
        'A family-run precision machining shop in Tucson, AZ with 20+ years of combined experience. Programming, cutting and inspection all happen in-house.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Why Titantech',
        title: 'A small shop with serious capability.',
        intro:
          "We're a family-run machine shop in Tucson with 20+ years of combined experience behind the spindle. Big enough to hold real tolerances on automotive and general parts — small enough to actually pick up the phone.",
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'mediaWithText',
        image: mill,
        imagePosition: 'left',
        eyebrow: 'The shop',
        title: 'Everything happens under one roof.',
        body: textToLexical(
          'Programming, cutting, and inspection all happen here. Nothing gets farmed out to a shop we cannot walk into, which is why we can tell you on the phone what a part is going to take instead of calling you back tomorrow.\n\nThat also means the person who quoted your job is the person who runs it. When something on the print is ambiguous, it gets caught at the screen — not after the first article is already scrap.',
        ),
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'valueProps',
        eyebrow: 'How we work',
        title: 'Three things we do not compromise on.',
        body: textToLexical(
          'A job shop lives or dies on whether it does what it said it would. These are the commitments we hold ourselves to on every part that goes out the door.',
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
        blockType: 'richText',
        width: 'narrow',
        content: textToLexical(
          'Who we work with\n\nMost of what we run is automotive and general machining — shops, fabricators, restorers, equipment owners and manufacturers who need a part that is no longer available, or a run of parts that has to match every time.\n\nWe are equally comfortable with a single replacement bushing and a repeating production order. Small jobs are not a favor we do between the real work; they are the real work.\n\nWhat we need from you\n\nA drawing, a STEP file, or a photo with a few dimensions is enough to start. If you have a tolerance that actually matters, call it out — knowing which feature is critical lets us put the time where it counts and keep it off the ones that do not.\n\nIf you are not sure what material you need, say so. Recommending one is part of the quote.',
        ),
        background: 'none',
        topDivider: true,
      },
      quoteCtaBand,
    ],
  })
})
