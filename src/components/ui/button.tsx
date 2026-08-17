import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Machined buttons: square corners, condensed uppercase display type, and a
// 1px lift on hover that settles on press. The ember variant carries an inset
// top highlight so it reads as a milled face rather than a flat rectangle.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-display font-bold uppercase tracking-wider transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 active:translate-y-0 motion-reduce:hover:translate-y-0",
  {
    variants: {
      variant: {
        default:
          'bg-ember text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_10px_24px_-14px_rgba(214,40,40,0.6)] hover:-translate-y-px hover:bg-ember-soft hover:shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_14px_30px_-12px_rgba(214,40,40,0.75)]',
        outline:
          'hairline bg-graphite-800/60 text-steel-100 hover:-translate-y-px hover:border-steel-300 hover:text-steel-50',
        secondary: 'bg-graphite-700 text-steel-50 hover:-translate-y-px hover:bg-graphite-600',
        ghost: 'text-steel-200 hover:bg-graphite-800 hover:text-steel-50',
        link: 'text-ember underline-offset-4 hover:underline',
        destructive: 'bg-ember-deep text-white hover:bg-ember',
      },
      size: {
        default: 'px-5 py-2.5 text-sm',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-7 py-4 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
