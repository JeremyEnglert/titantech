import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const GRAPHITE_900 = '#0b0c0e'
const STEEL_50 = '#e6e9ee'
const STEEL_300 = '#7c828d'
const EMBER = '#d62828'

// Satori needs real font data and does not read woff2 reliably, so these are
// the static TTFs Google serves to legacy user agents.
const SAIRA_BOLD =
  'https://fonts.gstatic.com/s/sairacondensed/v12/EJRLQgErUN8XuHNEtX81i9TmEkrnGc5g8A.ttf'
const SAIRA_BLACK =
  'https://fonts.gstatic.com/s/sairacondensed/v12/EJRLQgErUN8XuHNEtX81i9TmEkrnIcxg8A.ttf'
const MONO_MEDIUM =
  'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf'

/**
 * The Titantech gear mark, inlined rather than fetched from /public.
 *
 * Sigma fetches its logo over HTTP, which makes every OG render depend on the
 * site's own URL resolving correctly — exactly the variable that is wrong or
 * unset in the environments where you most want a preview to work. A string
 * constant cannot fail that way.
 */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${EMBER}">
<circle cx="50" cy="50" r="40" fill="none" stroke="${EMBER}" stroke-width="7"/>
<rect x="46" y="2" width="8" height="12" rx="1"/><rect x="46" y="86" width="8" height="12" rx="1"/>
<rect x="2" y="46" width="12" height="8" rx="1"/><rect x="86" y="46" width="12" height="8" rx="1"/>
<rect x="46" y="2" width="8" height="12" rx="1" transform="rotate(45 50 50)"/>
<rect x="46" y="86" width="8" height="12" rx="1" transform="rotate(45 50 50)"/>
<rect x="46" y="2" width="8" height="12" rx="1" transform="rotate(-45 50 50)"/>
<rect x="46" y="86" width="8" height="12" rx="1" transform="rotate(-45 50 50)"/>
<rect x="46" y="30" width="8" height="40" rx="1"/><rect x="34" y="40" width="8" height="30" rx="1"/>
<rect x="58" y="40" width="8" height="30" rx="1"/>
<path d="M22 74 L40 56 H60 L78 74" fill="none" stroke="${EMBER}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString('base64')}`

async function loadFonts() {
  const [bold, black, mono] = await Promise.all([
    fetch(SAIRA_BOLD).then((r) => r.arrayBuffer()),
    fetch(SAIRA_BLACK).then((r) => r.arrayBuffer()),
    fetch(MONO_MEDIUM).then((r) => r.arrayBuffer()),
  ])

  return [
    { name: 'Saira Condensed', data: bold, style: 'normal' as const, weight: 700 as const },
    { name: 'Saira Condensed', data: black, style: 'normal' as const, weight: 900 as const },
    { name: 'JetBrains Mono', data: mono, style: 'normal' as const, weight: 500 as const },
  ]
}

/**
 * The machined CAD grid, rebuilt for Satori.
 *
 * The site draws it with repeating linear-gradients, which Satori does not
 * support — it renders as a flat rectangle. Explicit hairline divs are the
 * workaround, and 630px of height only needs a couple of dozen of them.
 */
function MachinedGrid() {
  const step = 56
  const columns = Math.ceil(OG_SIZE.width / step)
  const rows = Math.ceil(OG_SIZE.height / step)
  const line = 'rgba(124,130,141,0.13)'

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      {Array.from({ length: columns }, (_, i) => (
        <div
          key={`c${i}`}
          style={{
            position: 'absolute',
            left: i * step,
            top: 0,
            // Explicit height, not top/bottom: Satori's layout engine does not
            // stretch an absolutely-positioned box from opposing insets, so a
            // top/bottom pair collapses the div to nothing and the grid
            // silently disappears.
            height: OG_SIZE.height,
            width: 1,
            background: line,
            display: 'flex',
          }}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={`r${i}`}
          style={{
            position: 'absolute',
            top: i * step,
            left: 0,
            width: OG_SIZE.width,
            height: 1,
            background: line,
            display: 'flex',
          }}
        />
      ))}
    </div>
  )
}

function pickTitleSize(title: string): number {
  if (title.length > 85) return 58
  if (title.length > 60) return 68
  if (title.length > 38) return 82
  return 96
}

export async function generateDefaultOG({
  title,
  eyebrow,
}: {
  title: string
  eyebrow?: string
}) {
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: GRAPHITE_900,
          color: STEEL_50,
        }}
      >
        <MachinedGrid />

        {/* The hero's ember glow, top right. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'radial-gradient(760px 520px at 84% 10%, rgba(214,40,40,0.30), transparent 66%)',
          }}
        />

        {/* Brand lockup */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 72,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- inline data URI rendered by Satori */}
          <img src={logoDataUri} alt="" width={64} height={64} />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Saira Condensed',
                fontWeight: 900,
                fontSize: 34,
                letterSpacing: '0.12em',
                lineHeight: 1,
              }}
            >
              TITANTECH
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'JetBrains Mono',
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: '0.5em',
                color: EMBER,
                marginTop: 6,
              }}
            >
              CNC
            </div>
          </div>
        </div>

        {/* Title block */}
        <div
          style={{
            position: 'absolute',
            left: 72,
            right: 72,
            bottom: 84,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 26 }}>
              <div style={{ width: 44, height: 2, background: EMBER, display: 'flex' }} />
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 500,
                  fontSize: 18,
                  letterSpacing: '0.2em',
                  color: STEEL_300,
                  marginLeft: 18,
                }}
              >
                {eyebrow.toUpperCase()}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              fontFamily: 'Saira Condensed',
              fontWeight: 900,
              fontSize: pickTitleSize(title),
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              maxWidth: 1010,
            }}
          >
            {title}
          </div>
        </div>

        {/* Hairline rule + spec strip along the bottom, echoing the site's
            band dividers. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: OG_SIZE.width,
            height: 1,
            background: 'rgba(124,130,141,0.28)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 30,
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontWeight: 500,
            fontSize: 17,
            letterSpacing: '0.16em',
            color: STEEL_300,
          }}
        >
          5-AXIS · TURNING · ±.0005&quot; · TUCSON, AZ
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  )
}
