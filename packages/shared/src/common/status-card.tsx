import * as React from 'react'

import { cn } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type StatusCardTone = 'default' | 'danger'

export function StatusCard({
  title,
  description,
  tone = 'default',
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  tone?: StatusCardTone
  className?: string
}) {
  return (
    <Card className={cn(tone === 'danger' && 'border-danger/40', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-sm text-foreground/70">{description}</CardContent>
      ) : null}
    </Card>
  )
}
