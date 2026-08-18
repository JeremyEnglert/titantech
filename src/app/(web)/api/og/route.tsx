import { generateDefaultOG } from '@/utilities/og-image'

// Satori and sharp both need Node APIs; the edge runtime cannot render this.
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title')?.trim() || 'Complex parts. Precision machined.'
  // Defaults to what the shop does rather than its name — the name is
  // already set in the lockup at the top of the card.
  const eyebrow = searchParams.get('eyebrow')?.trim() || 'Precision CNC Machining · Tucson, AZ'

  return generateDefaultOG({ title, eyebrow })
}
