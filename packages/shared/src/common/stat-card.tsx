import * as React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function StatCard({
  title,
  value,
  hint,
}: {
  title: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint ? <div className="text-sm text-foreground/70">{hint}</div> : null}
      </CardContent>
    </Card>
  )
}
