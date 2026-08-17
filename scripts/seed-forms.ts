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
      'Thanks — your request is in. We review feasibility, recommend materials, and come back with pricing and a lead time.',
    ),
    emails: [
      {
        emailTo: notifyTo,
        emailFrom: notifyFrom,
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
        label: 'What do you need made?',
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
          { label: 'Aluminum', value: 'aluminum' },
          { label: 'Steel', value: 'steel' },
          { label: 'Stainless', value: 'stainless' },
          { label: 'Brass / Bronze', value: 'brass' },
          { label: 'Titanium', value: 'titanium' },
          { label: 'Plastic', value: 'plastic' },
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
          { label: '3-axis milling', value: '3-axis' },
          { label: '4th / 5th axis', value: 'multi-axis' },
          { label: 'Turning', value: 'turning' },
          { label: 'Laser engraving', value: 'engraving' },
          { label: 'Repair / rework', value: 'repair' },
        ],
      },
      {
        blockType: 'fileUpload',
        name: 'attachment',
        label: 'Drawing, STEP file or photo',
        width: 100,
        helpText: 'PDF, STEP, IGES, DXF, STL, ZIP or a photo. Up to 10MB.',
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
        ...seedContext,
      })
      console.log(`  updated "${form.title}" (${form.fields.length} fields)`)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
      const created = await payload.create({ collection: 'forms', data: form as any, ...seedContext })
      console.log(`  created "${form.title}" (${created.id})`)
    }
  }

  console.log(`  notifications → ${notifyTo} (from ${notifyFrom})`)
})
