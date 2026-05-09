import { Link } from 'react-router-dom'

import { Button } from '@cxhub/shared/ui/button'
import { useFeedbackUiStore } from '@/shared/state/feedbackStore'
import FilterChip from './FilterChip'

export default function FeedbackHeader() {
  const sentiment = useFeedbackUiStore((s) => s.sentiment)
  const setSentiment = useFeedbackUiStore((s) => s.setSentiment)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
        <p className="text-sm text-foreground/70">
          Démo TanStack Query (cache + mutation optimiste) et Zustand (filtres).
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={sentiment === 'all'} onClick={() => setSentiment('all')}>
          Tous
        </FilterChip>
        <FilterChip active={sentiment === 'positive'} onClick={() => setSentiment('positive')}>
          Positifs
        </FilterChip>
        <FilterChip active={sentiment === 'neutral'} onClick={() => setSentiment('neutral')}>
          Neutres
        </FilterChip>
        <FilterChip active={sentiment === 'negative'} onClick={() => setSentiment('negative')}>
          Négatifs
        </FilterChip>
        <Button asChild>
          <Link to="new">Nouveau</Link>
        </Button>
      </div>
    </div>
  )
}
