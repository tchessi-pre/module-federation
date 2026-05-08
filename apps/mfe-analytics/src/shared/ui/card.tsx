import * as React from 'react'

import { cn } from '@/shared/lib/utils'

type StatusCardTone = 'default' | 'danger'

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold leading-none', className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 pt-0', className)} {...props} />
}

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
