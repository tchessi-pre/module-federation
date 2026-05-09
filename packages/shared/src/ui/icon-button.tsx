import * as React from 'react'

import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './button'

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  label: string
  spinning?: boolean
  children: React.ReactNode
}

export function IconButton({ label, spinning, className, children, ...props }: IconButtonProps) {
  return (
    <Button
      aria-label={label}
      title={label}
      className={cn('h-9 w-9 p-0', className)}
      {...props}
    >
      <span className={cn('inline-flex', spinning && 'animate-spin')}>{children}</span>
    </Button>
  )
}
