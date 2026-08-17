import { contactCardRows } from './lib/content'
import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed contact page', async () => {
  const payload = await getSeedPayload()

  const forms = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
    depth: 0,
  })
  const formId = forms.docs[0]?.id
  if (!formId) throw new Error('Contact form not found — run `pnpm seed:forms` first.')

  await upsertPage(payload, {
    slug: 'contact',
    title: 'Contact',
    meta: {
      title: 'Contact Titantech CNC — Tucson, AZ',
      description:
        'Call 520-668-1600 or email titantechcnc@gmail.com. 227 E Valencia Rd, Ste 230, Tucson, AZ 85706. Open Mon–Fri, 7am–5pm.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Contact',
        title: 'Get in touch',
        intro:
          'The fastest way to reach us is the phone during shop hours. Everything else lands in the same inbox and gets answered the same day.',
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'contactCards',
        cards: contactCardRows,
        showMap: true,
        background: 'deep',
        topDivider: false,
      },
      {
        blockType: 'form',
        eyebrow: 'Send a message',
        title: 'Tell us what you need.',
        intro: textToLexical(
          'For anything that needs a price, the quote form collects the details we actually need — use that instead and it saves a round trip.',
        ),
        form: formId,
        aside: {
          title: 'Prefer to talk it through?',
          body: textToLexical(
            'Call 520-668-1600, Mon–Fri 7:00am to 5:00pm. If we are on the floor and miss you, leave a message — we return calls the same day.',
          ),
        },
        layout: 'split',
        background: 'none',
        topDivider: true,
      },
    ],
  })
})
