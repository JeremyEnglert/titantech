import { textToLexical } from './text-to-lexical'

/**
 * Copy shared between pages, so the six capabilities can never say one thing
 * on the home page and another on /services.
 *
 * Everything here is grounded in what the source design already claims —
 * Haas VF-2SS mills and CNC lathes, ±0.0005", 3/4/5-axis, 20+ years combined,
 * family-run, Tucson, Mon–Fri 7–5. No certifications, machine models, client
 * names or capacities beyond that have been invented.
 */

export type ServiceSeed = {
  anchor: string
  icon: string
  title: string
  short: string
  long: string
}

export const services: ServiceSeed[] = [
  {
    anchor: 'three-axis-milling',
    icon: 'mill',
    title: '3-Axis Milling',
    short:
      'Workhorse milling on our Haas VF-2SS for brackets, plates, housings and fixtures — accurate, repeatable, fast.',
    long: 'Most of what leaves this shop starts on the Haas VF-2SS. Brackets, plates, housings, manifolds, fixtures and adapter blocks — the everyday parts a machine, a vehicle or a line cannot run without.\n\nWe program, cut and inspect every job in-house, so what we quote is what we run. That matters most on repeat work: the second batch comes off the same program, on the same setup, to the same numbers as the first.',
  },
  {
    anchor: 'multi-axis-machining',
    icon: 'multiAxis',
    title: '4th & 5th Axis Machining',
    short:
      'Complex, multi-sided geometry in fewer setups — tighter tolerances and cleaner features on intricate parts.',
    long: 'Every time a part comes out of the vise and goes back in, it picks up a little error. Fourth- and fifth-axis work removes those handoffs: the part is indexed under the spindle instead of re-fixtured on the bench.\n\nThe result is a tighter, cleaner part — compound angles, features on faces that a 3-axis setup cannot reach, and true position that holds across the whole envelope rather than only within one face. Fewer setups also means less labor in the part, which usually shows up in the quote.',
  },
  {
    anchor: 'cnc-turning',
    icon: 'lathe',
    title: 'CNC Turning',
    short:
      'Precision lathe work for shafts, bushings, spacers and round stock — concentric, on-spec, production-ready.',
    long: 'Shafts, bushings, spacers, pins, standoffs, threaded bodies and anything else that starts as round stock. Turned work is judged on concentricity and finish, and both are set long before the tool touches metal — in the workholding, the tooling, and the feeds we choose.\n\nWe run turning as one-off replacements and as production batches, and we are equally happy doing either.',
  },
  {
    anchor: 'laser-engraving',
    icon: 'laser',
    title: 'Laser Engraving',
    short:
      'Permanent marking, part numbers, logos and serialization — crisp, durable engraving on metal and plastics.',
    long: 'Part numbers, revision marks, serial ranges, logos, scales and instruction plates — marked permanently into metal and plastics rather than printed on and worn off.\n\nEngraving is often the last operation on a part we already machined, which keeps the marking registered to the features it refers to. We also engrave customer-supplied parts.',
  },
  {
    anchor: 'custom-parts',
    icon: 'customPart',
    title: 'Custom Parts Manufacturing',
    short:
      'From a napkin sketch or a CAD file to finished parts — prototypes and short runs built to your print.',
    long: 'Send a print, a STEP file, or a photo of the broken part with a few dimensions written next to it. All three are a legitimate starting point, and all three land in the same place: a part that fits.\n\nWe will tell you where a feature is going to be expensive to hold, where a material change would save you money, and where the drawing says something the part does not need. Then we make it. Prototypes, one-offs, and short production runs.',
  },
  {
    anchor: 'repair-rework',
    icon: 'repair',
    title: 'Repair & Rework Services',
    short:
      'Salvage damaged components, re-machine worn features and modify existing parts — back in service, not in the scrap bin.',
    long: 'A worn bore, a galled shaft, a stripped thread or a bracket that needs one more hole is not necessarily a new part. Re-machining the damaged feature is very often faster and cheaper than replacing the whole component — especially when the original is obsolete or on a long lead time.\n\nBring us the part. We will tell you honestly whether it is worth saving.',
  },
]

export const serviceCardRows = (variant: 'short' | 'long') =>
  services.map((service) => ({
    icon: service.icon,
    title: service.title,
    body: textToLexical(variant === 'short' ? service.short : service.long),
  }))

/** The three "why us" props, verbatim from the design. */
export const valuePropItems = [
  {
    marker: 'A1',
    title: 'Available & fast to respond',
    body: 'When you need parts, you need them now. We answer quotes quickly, keep you updated through the job, and hit the lead times we promise — no chasing, no silence.',
  },
  {
    marker: 'A2',
    title: 'Competitive without cutting corners',
    body: 'Fair, transparent pricing that respects your budget — and quality that never gets value-engineered away. You get top-tier precision at a number that makes sense.',
  },
  {
    marker: 'A3',
    title: 'Experienced hands on every part',
    body: 'Seasoned machinists program, run, and inspect every job in-house. Two decades of combined experience means we catch problems on the screen — long before they hit the metal.',
  },
].map((item) => ({ ...item, body: textToLexical(item.body) }))

export const statItems = [
  { label: 'Tolerance', value: '±.0005', accentSuffix: '"' },
  { label: 'Experience', value: '20', accentSuffix: '+' },
  { label: 'Axes', value: '5', accentSuffix: '' },
  { label: 'Materials', value: '6', accentSuffix: '+' },
]

export const contactCardRows = [
  { icon: 'phone', label: 'Phone', value: '520-668-1600', link: { linkType: 'custom' as const, url: 'tel:5206681600' } },
  {
    icon: 'mail',
    label: 'Email',
    value: 'titantechcnc@gmail.com',
    link: { linkType: 'custom' as const, url: 'mailto:titantechcnc@gmail.com' },
  },
  { icon: 'clock', label: 'Hours', value: 'Mon–Fri', secondary: '7:00am – 5:00pm' },
  { icon: 'pin', label: 'Location', value: '227 E Valencia Rd, Ste 230\nTucson, AZ 85706' },
]

export const mapEmbedUrl =
  'https://www.google.com/maps?q=227+E+Valencia+Rd+Ste+230,+Tucson,+AZ+85706&output=embed'

/** The closing call-to-action band, verbatim from the design. */
export const quoteCtaBand = {
  blockType: 'ctaBand' as const,
  eyebrow: 'Ready when you are',
  title: 'Send us a print.\nGet a quote back fast.',
  body: textToLexical(
    "Email your drawing, STEP file, or even a photo and a few dimensions. We'll review feasibility, recommend materials, and turn around pricing and lead time.",
  ),
  buttons: [
    {
      label: 'Request a Quote',
      linkType: 'custom' as const,
      url: '/quote',
      variant: 'default' as const,
    },
    {
      label: 'Call 520-668-1600',
      linkType: 'custom' as const,
      url: 'tel:5206681600',
      variant: 'outline' as const,
    },
  ],
  background: 'sheen' as const,
  topDivider: true,
}
