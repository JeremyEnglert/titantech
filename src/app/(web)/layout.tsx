import type { Metadata } from 'next'
import { Saira_Condensed, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LivePreviewListener } from '@/components/live-preview-listener'
import { LocalBusinessSchema } from '@/components/local-business-schema'
import { siteConfig } from '@/utilities/site-config'
import { mergeOpenGraph } from '@/utilities/merge-open-graph'

// Saira Condensed carries the display headlines; JetBrains Mono is the body
// face and the site default. Deliberately not Inter/system-ui — the monospace
// is the voice of the whole design.
const sairaCondensed = Saira_Condensed({
  variable: '--font-saira-condensed',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: mergeOpenGraph(),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sairaCondensed.variable} ${jetBrainsMono.variable} bg-machined`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-ember focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:uppercase focus:tracking-wider focus:text-graphite-900"
        >
          Skip to content
        </a>
        <LivePreviewListener />
        <LocalBusinessSchema />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
