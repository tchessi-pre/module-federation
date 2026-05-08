import * as React from 'react'

import { cn } from '@/shared/lib/utils'

export default function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border border-border px-3 py-2 text-sm transition-colors',
        active ? 'border-transparent bg-primary text-white shadow-sm' : 'bg-card hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
