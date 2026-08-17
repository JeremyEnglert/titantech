import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      // Media lives on Vercel Blob in every deployed environment, and
      // next/image refuses any host it has not been told about — which shows
      // up as a silently empty image frame rather than an error.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // The dark map is composed from CARTO's raster basemap tiles.
      { protocol: 'https', hostname: 'basemaps.cartocdn.com' },
    ],
  },
}

export default withPayload(nextConfig)
