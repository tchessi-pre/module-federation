import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '../lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  asChild,
  className,
  size = 'md',
  variant = 'default',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
        size === 'md' && 'h-10 px-4 py-2',
        size === 'sm' && 'h-9 px-3',
        variant === 'default' &&
          'bg-primary text-white hover:opacity-90 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'secondary' &&
          'bg-secondary text-white hover:opacity-90 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'danger' &&
          'bg-danger text-white hover:opacity-90 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'ghost' && 'bg-transparent text-foreground hover:bg-muted',
        className,
      )}
      {...props}
    />
  )
}
