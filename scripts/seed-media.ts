import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getSeedPayload, runSeed, seedContext } from './lib/payload-client'

/**
 * Client-supplied shop photography. Alt text names the actual machine in the
 * frame — for a job shop these are the credential, and "shop photo 3" tells a
 * screen-reader user (and a search engine) nothing.
 */
const photos = [
  {
    file: 'haas-umc-500ss.png',
    alt: 'Haas UMC-500SS five-axis machining centre on the Titantech CNC shop floor, mid-cut with the tool changer loaded',
    caption: 'Haas UMC-500SS — five-axis machining',
  },
  {
    file: 'haas-tl-1p-lathe.png',
    alt: 'Haas TL-1P CNC toolroom lathe set up for turning work at Titantech CNC in Tucson',
    caption: 'Haas TL-1P — CNC turning',
  },
  {
    file: 'haas-vf-6ss-mill.png',
    alt: 'Haas VF-6SS vertical machining centre with vises fixtured on the table for a milling run',
    caption: 'Haas VF-6SS — vertical milling',
  },
]

const photoDir = path.resolve(process.cwd(), 'design/photos')

runSeed('Seed media', async () => {
  const payload = await getSeedPayload()

  for (const photo of photos) {
    // Dedupe by filename so a re-run updates rather than piling up copies.
    // Payload converts to webp on upload, so the stored name loses the .png.
    const stem = photo.file.replace(/\.png$/, '')
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { like: stem } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt: photo.alt, caption: photo.caption },
        ...seedContext,
      })
      console.log(`  updated ${photo.file}`)
      continue
    }

    const data = await readFile(path.join(photoDir, photo.file))
    const created = await payload.create({
      collection: 'media',
      data: { alt: photo.alt, caption: photo.caption },
      file: {
        data,
        mimetype: 'image/png',
        name: photo.file,
        size: data.byteLength,
      },
      ...seedContext,
    })
    console.log(`  created ${photo.file} (${created.id})`)
  }
})
