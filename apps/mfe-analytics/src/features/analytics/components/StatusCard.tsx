import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatusCard({
  title,
  description,
  tone = 'default',
}: {
  title: string
  description: string
  tone?: 'default' | 'danger'
}) {
  return (
    <Card className={cn(tone === 'danger' && 'border-danger/40')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/70">{description}</CardContent>
    </Card>
  )
}
