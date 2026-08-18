import { getSeedPayload, runSeed, seedContext } from './lib/payload-client'

// Every NAP fact on the site comes from here — header, footer, contact cards
// and the LocalBusiness JSON-LD all read this record.
const settings = {
  businessName: 'Titantech CNC',
  tagline:
    'Precision 5-axis CNC machining in Tucson, AZ. Complex, tight-tolerance components from prototype to production.',
  phone: '520-668-1600',
  email: 'titantechcnc@gmail.com',
  address: {
    street: '227 E Valencia Rd',
    suite: 'Ste 230',
    city: 'Tucson',
    state: 'AZ',
    zip: '85706',
    // Geocoded from the street address (Nominatim), not the design's rounded
    // 32.1°N / 110.9°W eyebrow — that is ~3km out and would pin the wrong block.
    latitude: 32.1340845,
    longitude: -110.9648856,
  },
  hours: {
    days: 'Mon–Fri',
    open: '7:00am',
    close: '5:00pm',
    schemaHours: 'Mo-Fr 07:00-17:00',
  },
}

runSeed('Seed site settings', async () => {
  const payload = await getSeedPayload()

  await payload.updateGlobal({
    slug: 'site-settings',
    data: settings,
    ...seedContext(),
  })

  console.log(`  ${settings.businessName} · ${settings.phone} · ${settings.address.city}`)
})
