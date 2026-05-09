import { Button } from '@cxhub/shared/ui/button'
import { Card, CardContent } from '@cxhub/shared/ui/card'
import { Input } from '@cxhub/shared/ui/input'
import { Textarea } from '@cxhub/shared/ui/textarea'
import type { FeedbackSentiment } from '../types'

export default function NewFeedbackForm({
  customer,
  message,
  sentiment,
  canSubmit,
  onChangeCustomer,
  onChangeMessage,
  onChangeSentiment,
  onCancel,
  onSubmit,
}: {
  customer: string
  message: string
  sentiment: FeedbackSentiment
  canSubmit: boolean
  onChangeCustomer: (value: string) => void
  onChangeMessage: (value: string) => void
  onChangeSentiment: (value: FeedbackSentiment) => void
  onCancel: () => void
  onSubmit: () => Promise<void>
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Client</label>
          <Input
            value={customer}
            onChange={(e) => onChangeCustomer(e.currentTarget.value)}
            placeholder="Acme Retail"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={message}
            onChange={(e) => onChangeMessage(e.currentTarget.value)}
            placeholder="Décris le ressenti / problème…"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sentiment</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={sentiment === 'positive' ? 'secondary' : 'ghost'}
              onClick={() => onChangeSentiment('positive')}
            >
              Positif
            </Button>
            <Button
              type="button"
              variant={sentiment === 'neutral' ? 'secondary' : 'ghost'}
              onClick={() => onChangeSentiment('neutral')}
            >
              Neutre
            </Button>
            <Button
              type="button"
              variant={sentiment === 'negative' ? 'secondary' : 'ghost'}
              onClick={() => onChangeSentiment('negative')}
            >
              Négatif
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={() => void onSubmit()}>
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
