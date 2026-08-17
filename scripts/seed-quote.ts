import { getSeedPayload, runSeed } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'
import { upsertPage } from './lib/upsert-page'

runSeed('Seed quote page', async () => {
  const payload = await getSeedPayload()

  const forms = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Request a Quote' } },
    limit: 1,
    depth: 0,
  })
  const formId = forms.docs[0]?.id
  if (!formId) throw new Error('Quote form not found — run `pnpm seed:forms` first.')

  await upsertPage(payload, {
    slug: 'quote',
    title: 'Request a Quote',
    meta: {
      title: 'Request a Quote — Titantech CNC | Tucson, AZ',
      description:
        'Send a drawing, STEP file, or a photo with dimensions. We review feasibility, recommend materials, and turn around pricing and lead time.',
    },
    content: [
      {
        blockType: 'pageBanner',
        eyebrow: 'Ready when you are',
        title: 'Send us a print. Get a quote back fast.',
        intro:
          "Email your drawing, STEP file, or even a photo and a few dimensions. We'll review feasibility, recommend materials, and turn around pricing and lead time.",
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'form',
        title: 'Request a quote',
        intro: textToLexical(
          'The more you can tell us up front, the tighter the number comes back. If you only have a photo and a rough idea, send that — we will ask for what is missing.',
        ),
        form: formId,
        aside: {
          title: 'What happens next',
          body: textToLexical(
            'We review the part for feasibility, flag anything on the drawing that will drive cost, and come back with pricing and a lead time. Urgent job? Call 520-668-1600 and we will pull it forward.\n\nFiles too large to attach can go straight to titantechcnc@gmail.com.',
          ),
        },
        layout: 'split',
        background: 'none',
        topDivider: false,
      },
      {
        blockType: 'contactCards',
        eyebrow: 'Or reach us directly',
        cards: [
          {
            icon: 'phone',
            label: 'Phone',
            value: '520-668-1600',
            link: { linkType: 'custom', url: 'tel:5206681600' },
          },
          {
            icon: 'mail',
            label: 'Email',
            value: 'titantechcnc@gmail.com',
            link: { linkType: 'custom', url: 'mailto:titantechcnc@gmail.com' },
          },
          { icon: 'clock', label: 'Hours', value: 'Mon–Fri', secondary: '7:00am – 5:00pm' },
        ],
        background: 'deep',
        topDivider: true,
      },
    ],
  })
})
