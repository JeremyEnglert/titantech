import { getSeedPayload, runSeed, seedContext } from './lib/payload-client'
import { textToLexical } from './lib/text-to-lexical'

const notifyTo = process.env.QUOTE_NOTIFICATION_EMAIL || 'titantechcnc@gmail.com'
const notifyFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// `{{*:table}}` is the form-builder's own token for "every answer, as a
// table" — it keeps the notification correct when a field is added later.
const notificationBody = textToLexical(
  'A new submission came in from the Titantech CNC website.\n\n{{*:table}}',
)

const forms = [
  {
    title: 'Contact',
    submitButtonLabel: 'Send Message',
    confirmationType: 'message' as const,
    confirmationMessage: textToLexical(
      'Thanks — your message is in. We answer quickly during shop hours, Mon–Fri 7am to 5pm.',
    ),
    emails: [
      {
        emailTo: notifyTo,
        emailFrom: notifyFrom,
        // Reply goes to the person who filled the form, not back to the
        // sending address — quotes@ is send-only, so a reply there vanishes.
        replyTo: '{{email}}',
        subject: 'Website contact — {{name}}',
        message: notificationBody,
      },
    ],
    fields: [
      { blockType: 'text', name: 'name', label: 'Name', width: 50, required: true },
      { blockType: 'email', name: 'email', label: 'Email', width: 50, required: true },
      { blockType: 'text', name: 'phone', label: 'Phone', width: 50 },
      { blockType: 'text', name: 'company', label: 'Company', width: 50 },
      { blockType: 'textarea', name: 'message', label: 'How can we help?', width: 100, required: true },
    ],
  },
  {
    title: 'Request a Quote',
    submitButtonLabel: 'Request a Quote',
    confirmationType: 'message' as const,
    confirmationMessage: textToLexical(
      'Thanks — your request is in. We review manufacturability, material requirements and tolerances, and come back with pricing and a lead time.',
    ),
    emails: [
      {
        emailTo: notifyTo,
        emailFrom: notifyFrom,
        replyTo: '{{email}}',
        subject: 'Quote request — {{name}} ({{company}})',
        message: notificationBody,
      },
    ],
    fields: [
      { blockType: 'text', name: 'name', label: 'Name', width: 50, required: true },
      { blockType: 'text', name: 'company', label: 'Company', width: 50 },
      { blockType: 'email', name: 'email', label: 'Email', width: 50, required: true },
      { blockType: 'text', name: 'phone', label: 'Phone', width: 50 },
      {
        blockType: 'textarea',
        name: 'partDescription',
        label: 'Describe the component',
        width: 100,
        required: true,
      },
      { blockType: 'number', name: 'quantity', label: 'Quantity', width: 50 },
      {
        blockType: 'select',
        name: 'material',
        label: 'Material',
        width: 50,
        options: [
          { label: 'Stainless steel', value: 'stainless' },
          { label: 'Aluminum', value: 'aluminum' },
          { label: 'Alloy / tool steel', value: 'tool-steel' },
          { label: 'Copper / brass', value: 'copper-brass' },
          { label: 'Engineering plastic', value: 'plastic' },
          { label: 'Titanium / other alloy', value: 'titanium' },
          { label: 'Not sure — advise me', value: 'unsure' },
        ],
      },
      { blockType: 'text', name: 'targetDate', label: 'Needed by', width: 50 },
      {
        blockType: 'select',
        name: 'axis',
        label: 'Machining required',
        width: 50,
        options: [
          { label: 'Not sure', value: 'unsure' },
          { label: '5-axis machining', value: '5-axis' },
          { label: '3-axis milling', value: 'milling' },
          { label: 'CNC turning', value: 'turning' },
          { label: 'Laser engraving / part marking', value: 'marking' },
        ],
      },
      {
        blockType: 'fileUpload',
        name: 'attachment',
        label: 'Drawing or STEP file',
        width: 100,
        helpText: 'PDF, STEP, IGES, DXF, DWG, STL or ZIP. Up to 10MB.',
      },
    ],
  },
]

runSeed('Seed forms', async () => {
  const payload = await getSeedPayload()

  for (const form of forms) {
    const existing = await payload.find({
      collection: 'forms',
      where: { title: { equals: form.title } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'forms',
        id: existing.docs[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- form-builder block unions aren't expressible in seed data
        data: form as any,
        ...seedContext(),
      })
      console.log(`  updated "${form.title}" (${form.fields.length} fields)`)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
      const created = await payload.create({ collection: 'forms', data: form as any, ...seedContext() })
      console.log(`  created "${form.title}" (${created.id})`)
    }
  }

  console.log(`  notifications → ${notifyTo} (from ${notifyFrom})`)
})
