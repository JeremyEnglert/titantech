'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HeroButton = {
  label: string
  link: string
  variant: 'default' | 'secondary' | 'outline'
}

export type HeroProps = {
  title: string
  subtitle?: string
  content?: React.ReactNode
  alignment?: 'left' | 'center' | 'right'
  media?: {
    id: string
    alt: string
    url: string
    width?: number
    height?: number
  }
  buttons?: HeroButton[]
  backgroundType?: 'light' | 'dark' | 'custom'
  backgroundColor?: string
  disableInnerContainer?: boolean
}

export function Hero({
  title,
  subtitle,
  content,
  alignment = 'center',
  media,
  buttons = [],
  backgroundType = 'light',
  backgroundColor,
  disableInnerContainer = false,
}: HeroProps) {
  const textAlignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const containerClasses = cn(
    // The hero paints its own background, so its breathing room is interior
    // padding inside the paint — no external rhythm class.
    'py-16 md:py-24 w-full',
    {
      'bg-background text-foreground': backgroundType === 'light',
      'bg-slate-900 text-white': backgroundType === 'dark',
      [backgroundColor || '']: backgroundType === 'custom',
    }
  )

  const contentClasses = cn(
    'flex flex-col gap-6',
    {
      'items-center': alignment === 'center',
      'items-start': alignment === 'left',
      'items-end': alignment === 'right',
    },
    textAlignment[alignment]
  )

  const innerContainer = (
    <div className={contentClasses}>
      {title && (
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>
      )}

      {subtitle && (
        <p className="text-xl md:text-2xl max-w-3xl">
          {subtitle}
        </p>
      )}

      {content && (
        <div className="prose prose-lg dark:prose-invert max-w-3xl">
          {content}
        </div>
      )}

      {buttons && buttons.length > 0 && (
        <div className={cn('flex gap-4 mt-4', {
          'justify-center': alignment === 'center',
          'justify-start': alignment === 'left',
          'justify-end': alignment === 'right',
        })}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              asChild
            >
              <Link href={button.link}>
                {button.label}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {media && media.url && (
        <div className="mt-8 w-full max-w-3xl">
          <Image
            src={media.url}
            alt={media.alt || ''}
            width={media.width || 1920}
            height={media.height || 1080}
            className="w-full h-auto rounded-lg shadow-md"
            priority
          />
        </div>
      )}
    </div>
  )

  return (
    <section className={containerClasses}>
      {disableInnerContainer ? (
        innerContainer
      ) : (
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          {innerContainer}
        </div>
      )}
    </section>
  )
}
