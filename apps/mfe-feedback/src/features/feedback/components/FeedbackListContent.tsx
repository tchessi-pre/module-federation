import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import type { FeedbackItem, FeedbackSentiment } from '../types'

function sentimentBadgeVariant(sentiment: FeedbackSentiment) {
  if (sentiment === 'positive') return 'success'
  if (sentiment === 'negative') return 'danger'
  return 'default'
}

function sentimentLabel(sentiment: FeedbackSentiment) {
  if (sentiment === 'positive') return 'Positif'
  if (sentiment === 'negative') return 'Négatif'
  return 'Neutre'
}

export default function FeedbackListContent({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-sm text-foreground/70">
            Aucun feedback pour ce filtre.
          </CardContent>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {item.customer}
                  <Badge variant={sentimentBadgeVariant(item.sentiment)}>
                    {sentimentLabel(item.sentiment)}
                  </Badge>
                </CardTitle>
                <div className="text-xs text-foreground/60">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              {item.message}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
