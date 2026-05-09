
import { Badge } from '@cxhub/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@cxhub/shared/ui/card'

export default function KpiCard({
  title,
  value,
  badge,
}: {
  title: string
  value: string
  badge: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Badge>{badge}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}
