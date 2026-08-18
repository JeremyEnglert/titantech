import type { MenuLocation } from '../src/collections/Menus'
import { getSeedPayload, runSeed, seedContext } from './lib/payload-client'

type SeedItem = { label: string; url: string; newTab?: boolean }
type SeedMenu = { location: MenuLocation; name: string; items: SeedItem[] }

// The design's anchor nav (#about, #services…) becomes real routes now that
// the site is multi-page. "Request a Quote" is deliberately absent: it is the
// header CTA, not a nav item, and listing it twice dilutes it.
const menus: SeedMenu[] = [
  {
    location: 'main',
    name: 'Main Navigation',
    items: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Services', url: '/services' },
      { label: 'Contact', url: '/contact' },
    ],
  },
  {
    location: 'footer-services',
    name: 'Footer — Services',
    items: [
      { label: '5-Axis Machining', url: '/services#five-axis-machining' },
      { label: 'CNC Milling', url: '/services#cnc-milling' },
      { label: 'CNC Turning', url: '/services#cnc-turning' },
      { label: 'Laser Engraving', url: '/services#laser-engraving' },
      { label: 'Prototype to Production', url: '/services#prototype-to-production' },
      { label: 'Difficult Materials', url: '/services#difficult-materials' },
    ],
  },
  {
    location: 'footer-connect',
    name: 'Footer — Connect',
    items: [{ label: 'Request a Quote', url: '/quote' }],
  },
]

runSeed('Seed menus', async () => {
  const payload = await getSeedPayload()

  for (const menu of menus) {
    const data = {
      name: menu.name,
      location: menu.location,
      items: menu.items.map((item) => ({
        label: item.label,
        linkType: 'custom' as const,
        url: item.url,
        newTab: Boolean(item.newTab),
      })),
    }

    const existing = await payload.find({
      collection: 'menus',
      where: { location: { equals: menu.location } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'menus',
        id: existing.docs[0].id,
        data,
        ...seedContext(),
      })
      console.log(`  updated ${menu.name} (${menu.items.length} items)`)
    } else {
      await payload.create({ collection: 'menus', data, ...seedContext() })
      console.log(`  created ${menu.name} (${menu.items.length} items)`)
    }
  }

})
