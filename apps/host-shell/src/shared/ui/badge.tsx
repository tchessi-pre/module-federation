import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-muted text-foreground',
        variant === 'success' && 'bg-success/15 text-success border-success/30',
        variant === 'warning' && 'bg-warning/15 text-warning border-warning/30',
        variant === 'danger' && 'bg-danger/15 text-danger border-danger/30',
        className,
      )}
      {...props}
    />
  )
}
