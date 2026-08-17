import { textToLexical } from './text-to-lexical'

/**
 * Copy shared between pages, so a capability can never say one thing on the
 * home page and another on /services.
 *
 * Positioning: a modern precision CNC shop doing complex, tight-tolerance,
 * multi-axis work — NOT a general machine shop. The words an engineer, buyer
 * or sourcing lead scans for are the ones that have to be present: 5-axis,
 * complex geometries, tight tolerances, CNC turning, advanced materials,
 * prototype-to-production, quick-turn.
 *
 * Every factual claim traces to something the client supplied: the equipment
 * list (UMC-500SS, VF-2SS, TL-1P), the material grades, the industries, and
 * ±0.0005". Nothing beyond that is invented — no certifications, capacities,
 * client names or years in business.
 */

export type ServiceSeed = {
  anchor: string
  icon: string
  title: string
  short: string
  long: string
}

// 5-axis leads: it is the capability the client most wants buyers to see, and
// the one that separates them from a general shop.
export const services: ServiceSeed[] = [
  {
    anchor: 'five-axis-machining',
    icon: 'multiAxis',
    title: 'Advanced 5-Axis CNC Machining',
    short:
      'Complex geometries, angled features, multi-sided components and tight positional relationships machined in fewer setups.',
    long: 'Complex geometries, angled features, multi-sided components and tight positional relationships machined in fewer setups. Our 5-axis capability allows us to tackle intricate components while improving accuracy, repeatability and surface consistency.\n\nEvery time a part comes out of the vise and goes back in, it picks up error. Machining in a single setup removes those handoffs — which is what holds true position across the whole envelope rather than only within one face, and what keeps surface finish consistent across blended faces.',
  },
  {
    anchor: 'cnc-milling',
    icon: 'mill',
    title: '3-Axis & 3+2 CNC Milling',
    short:
      'High-speed vertical milling for brackets, plates, housings, manifolds and fixtures — accurate, repeatable, production-ready.',
    long: 'High-speed vertical milling on our Haas VF-2SS, with 3+2 positioning for features that sit off the primary face. Brackets, plates, housings, manifolds, fixtures and adapter blocks — the precision components a machine, an assembly or a line cannot run without.\n\nWe program, cut and inspect every job in-house, so what we quote is what we run. That matters most on repeat work: the second batch comes off the same program, on the same setup, to the same numbers as the first.',
  },
  {
    anchor: 'cnc-turning',
    icon: 'lathe',
    title: 'CNC Turning',
    short:
      'Precision lathe work for shafts, bushings, spacers and round stock — concentric, on-spec, production-ready.',
    long: 'Shafts, bushings, spacers, pins, standoffs, threaded bodies and anything else that starts as round stock, turned on our Haas TL-1P. Turned work is judged on concentricity and finish, and both are set long before the tool touches metal — in the workholding, the tooling, and the feeds we choose.\n\nWe run turning as one-off prototypes and as repeat production, and we are equally set up for either.',
  },
  {
    anchor: 'laser-engraving',
    icon: 'laser',
    title: 'Laser Engraving & Part Marking',
    short:
      'Permanent part numbers, serial numbers, logos, identification marks and traceability information on machined components.',
    long: 'Permanent part numbers, serial numbers, logos, identification marks and traceability information on machined components — marked into the material rather than printed on and worn off.\n\nMarking is usually the last operation on a part we already machined, which keeps it registered to the features it refers to. We also mark customer-supplied components.',
  },
  {
    anchor: 'prototype-to-production',
    icon: 'customPart',
    title: 'Prototype to Production',
    short:
      'One-off prototypes through repeat production runs, from your print or STEP file to finished, inspected components.',
    long: 'Send a drawing or a STEP file and we will tell you what it takes to make it: where a feature will drive cost, where a material change buys you margin, and where the print calls for a tolerance the part does not need.\n\nThe same programs, fixturing and inspection carry from the first article through to repeat production, so a part that qualifies as a prototype is the part you receive at quantity.',
  },
  {
    anchor: 'difficult-materials',
    icon: 'repair',
    title: 'Difficult Materials',
    short:
      'Stainless, tool steels, titanium and engineering plastics — machined with the tooling and strategies each one demands.',
    long: 'Hardened tool steels, work-hardening stainless, titanium and engineering plastics each fail in their own way, and each needs its own tooling, feeds and workholding to hold size and finish.\n\nWe machine across that range routinely. If you are unsure what a component should be made from, say so on the RFQ — recommending a material is part of the quote.',
  },
]

export const serviceCardRows = (variant: 'short' | 'long') =>
  services.map((service) => ({
    icon: service.icon,
    title: service.title,
    body: textToLexical(variant === 'short' ? service.short : service.long),
  }))

/** Material grades, exactly as the client supplied them. */
export const materialGroups = [
  { title: 'Stainless Steel', detail: '303, 304, 316, 17-4 PH, 420' },
  { title: 'Aluminum', detail: '6061, 7050 and other grades' },
  { title: 'Alloy & Tool Steel', detail: '4140, A2, DC53, 1018' },
  { title: 'Copper & Brass', detail: 'Free-machining and high-conductivity grades' },
  { title: 'Engineering Plastics', detail: 'PEEK, Ultem, Delrin, Nylon' },
  { title: 'Advanced Materials', detail: 'Titanium and other demanding alloys' },
]

export const industries = [
  'Aerospace',
  'Defense',
  'Semiconductor',
  'Robotics & Automation',
  'Energy',
  'R&D / Prototyping',
  'Advanced Manufacturing',
].map((title) => ({ title }))

/** The three machines on the floor, and what each one is for. */
export const equipment = [
  {
    stem: 'haas-umc-500ss',
    title: 'Haas UMC-500SS',
    detail:
      '5-axis CNC machining. Complex, multi-sided geometry in a single setup — the machine behind our tightest positional work.',
  },
  {
    stem: 'haas-vf-2ss-mill',
    title: 'Haas VF-2SS',
    detail:
      'High-speed vertical CNC milling. Fast, repeatable 3-axis and 3+2 work across prototypes and production runs.',
  },
  {
    stem: 'haas-tl-1p-lathe',
    title: 'Haas TL-1P',
    detail: 'Precision CNC turning. Concentric shafts, bushings, spacers and threaded bodies.',
  },
]

/** "Built for complex work" — capability, not price. */
export const valuePropItems = [
  {
    marker: 'A1',
    title: 'Multi-axis capability',
    body: 'Haas 5-axis and high-speed vertical machining under one roof, so intricate components are cut in fewer setups — better accuracy, better repeatability, better surface consistency.',
  },
  {
    marker: 'A2',
    title: 'Advanced CAM programming',
    body: 'Demanding geometries are programmed and verified before a tool ever moves. Problems get caught on the screen, where fixing them costs time instead of material.',
  },
  {
    marker: 'A3',
    title: 'Experienced hands on every part',
    body: 'Seasoned machinists program, run, and inspect every job in-house. Two decades of combined experience means the part that ships is the part on the print.',
  },
].map((item) => ({ ...item, body: textToLexical(item.body) }))

export const statItems = [
  { label: 'Tolerance', value: '±.0005', accentSuffix: '"' },
  { label: 'Axes', value: '5', accentSuffix: '' },
  { label: 'Experience', value: '20', accentSuffix: '+' },
  { label: 'Materials', value: '15', accentSuffix: '+' },
]

export const contactCardRows = [
  {
    icon: 'phone',
    label: 'Phone',
    value: '520-668-1600',
    link: { linkType: 'custom' as const, url: 'tel:5206681600' },
  },
  {
    icon: 'mail',
    label: 'Email',
    value: 'titantechcnc@gmail.com',
    link: { linkType: 'custom' as const, url: 'mailto:titantechcnc@gmail.com' },
  },
  { icon: 'clock', label: 'Hours', value: 'Mon–Fri', secondary: '7:00am – 5:00pm' },
  { icon: 'pin', label: 'Location', value: '227 E Valencia Rd, Ste 230\nTucson, AZ 85706' },
]

/** The closing call to action. */
export const quoteCtaBand = {
  blockType: 'ctaBand' as const,
  eyebrow: 'Ready when you are',
  title: 'Send us a print.\nGet a quote back fast.',
  body: textToLexical(
    "Send your drawing, STEP file and quantity. We'll review manufacturability, material requirements, tolerances and lead time and get back to you quickly.",
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
