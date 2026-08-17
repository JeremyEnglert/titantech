import React from 'react'

import { Icon } from '@/components/icons'
import { formatCityLine, formatStreet, getSiteSettings } from '@/lib/get-site-settings'
import { cn } from '@/lib/utils'

/**
 * A muted dark map, composed from static CARTO "dark matter" raster tiles.
 *
 * The Google Maps embed this replaces renders full-colour — cream roads, blue
 * water, orange POI pins — which fights every other surface on the site. CARTO's
 * dark basemap is near-monochrome graphite and needs no API key.
 *
 * Static tiles rather than MapLibre on purpose: this map answers "where is the
 * shop", which is one fixed view. Panning it is not worth ~230KB of JS on a
 * contact page, and "Get directions" hands the visitor to the app that actually
 * does navigation. Attribution is required by CARTO and OpenStreetMap.
 */

const TILE_SIZE = 256
const COLUMNS = 7
const ROWS = 4

/** Web Mercator: lat/lon → fractional tile coordinates at a zoom level. */
function tileCoordinates(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom
  const latRad = (lat * Math.PI) / 180
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  }
}

export type LocationMapProps = {
  /**
   * 14 is deliberate. The shop sits in a light-industrial stretch of south
   * Tucson, so anything tighter crops to bare lots and reads as the middle of
   * nowhere; 14 puts the pin on a labelled East Valencia Road with Nogales
   * Highway, Campbell Avenue and the Santa Cruz wash around it.
   */
  zoom?: number
  className?: string
}

export async function LocationMap({ zoom = 14, className }: LocationMapProps) {
  const settings = await getSiteSettings()
  const lat = settings?.address?.latitude
  const lon = settings?.address?.longitude

  // Without coordinates there is no map to draw — better nothing than an
  // ocean tile at 0,0.
  if (typeof lat !== 'number' || typeof lon !== 'number') return null

  const center = tileCoordinates(lat, lon, zoom)
  const originX = Math.floor(center.x) - Math.floor(COLUMNS / 2)
  const originY = Math.floor(center.y) - Math.floor(ROWS / 2)

  // Where the shop sits inside the mosaic, in pixels. Pinning the mosaic at the
  // container's midpoint and translating back by this puts the shop dead centre
  // at any container width — which the server cannot know.
  //
  // Rounded to whole pixels: a fractional translate lands every tile on a
  // subpixel boundary, and the browser's resampling leaves a visible hairline
  // seam down each tile edge. The cost is up to half a pixel of pin drift.
  const offsetX = Math.round((center.x - originX) * TILE_SIZE)
  const offsetY = Math.round((center.y - originY) * TILE_SIZE)

  const tiles = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLUMNS }, (_, column) => ({
      x: originX + column,
      y: originY + row,
    })),
  ).flat()

  const street = formatStreet(settings?.address)
  const cityLine = formatCityLine(settings?.address)
  const addressQuery = encodeURIComponent([street, cityLine].filter(Boolean).join(', '))
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`

  return (
    <div className={cn('relative overflow-hidden hairline bg-graphite-900', className)}>
      <div
        className="absolute"
        style={{
          width: COLUMNS * TILE_SIZE,
          height: ROWS * TILE_SIZE,
          left: '50%',
          top: '50%',
          transform: `translate(${-offsetX}px, ${-offsetY}px)`,
          // Dark Matter is tuned as a backdrop for data overlays, so its road
          // casings and labels sit very low-contrast against a near-black
          // ground. A modest lift brings the street grid and its names forward
          // without washing the tiles out or shifting hue.
          filter: 'brightness(1.3) contrast(1.06)',
        }}
        aria-hidden="true"
      >
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, ${TILE_SIZE}px)` }}
        >
          {tiles.map((tile) => (
            // eslint-disable-next-line @next/next/no-img-element -- raster map tiles, already exactly sized; next/image would proxy 21 of them for no gain
            <img
              key={`${tile.x}-${tile.y}`}
              src={`https://basemaps.cartocdn.com/dark_all/${zoom}/${tile.x}/${tile.y}@2x.png`}
              width={TILE_SIZE}
              height={TILE_SIZE}
              alt=""
              loading="lazy"
              decoding="async"
              className="block h-64 w-64 max-w-none border-0 align-top"
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="relative flex size-11 items-center justify-center">
          <span className="absolute inset-0 animate-pulse bg-ember/20" aria-hidden="true" />
          <span className="relative grid size-9 place-items-center hairline border-ember bg-graphite-900 text-ember">
            <Icon name="pin" className="size-5" />
          </span>
        </span>
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 inline-flex items-center gap-2 hairline bg-graphite-900/90 px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-steel-100 backdrop-blur-sm transition-colors hover:border-ember hover:text-ember"
      >
        Get directions
        <Icon name="arrowRight" className="size-3.5" />
      </a>

      <p className="absolute bottom-1 right-2 text-[9px] text-steel-300/70">
        ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-steel-200"
        >
          OpenStreetMap
        </a>{' '}
        ©{' '}
        <a
          href="https://carto.com/attributions"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-steel-200"
        >
          CARTO
        </a>
      </p>
    </div>
  )
}
