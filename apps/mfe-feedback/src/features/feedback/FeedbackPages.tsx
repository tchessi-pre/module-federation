import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/shared/ui/button'
import { StatusCard } from '@/shared/ui/card'
import { useFeedbackUiStore, type SentimentFilter } from '@/shared/state/feedbackStore'

import FeedbackHeader from '@/features/feedback/components/FeedbackHeader'
import FeedbackListContent from '@/features/feedback/components/FeedbackListContent'
import NewFeedbackForm from '@/features/feedback/components/NewFeedbackForm'
import type { CreateFeedbackInput, FeedbackItem, FeedbackSentiment } from '@/features/feedback/types'
import { feedbackKey, mockCreateFeedback, mockListFeedback } from '@/features/feedback/data'

function matchesFilter(item: FeedbackItem, filter: SentimentFilter) {
  if (filter === 'all') return true
  return item.sentiment === filter
}

export function FeedbackListPage() {
  const sentiment = useFeedbackUiStore((s) => s.sentiment)
  const { data, isLoading, isError } = useQuery({
    queryKey: feedbackKey,
    queryFn: mockListFeedback,
  })

  const items = (data ?? []).filter((i) => matchesFilter(i, sentiment))

  return (
    <div className="space-y-4">
      <FeedbackHeader />

      {isLoading ? (
        <StatusCard title="Chargement…" description="Récupération des feedbacks." />
      ) : isError ? (
        <StatusCard title="Erreur" description="Impossible de charger la liste." tone="danger" />
      ) : (
        <FeedbackListContent items={items} />
      )}
    </div>
  )
}

export function NewFeedbackPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [customer, setCustomer] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [sentiment, setSentiment] = React.useState<FeedbackSentiment>('neutral')

  const mutation = useMutation({
    mutationFn: (input: CreateFeedbackInput) => mockCreateFeedback(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: feedbackKey })
      const previous = queryClient.getQueryData<FeedbackItem[]>(feedbackKey)
      const optimistic: FeedbackItem = {
        id: `optimistic_${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        ...input,
      }
      queryClient.setQueryData<FeedbackItem[]>(feedbackKey, (old) => [optimistic, ...(old ?? [])])
      return { previous }
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(feedbackKey, ctx.previous)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: feedbackKey })
    },
  })

  const canSubmit =
    customer.trim().length >= 2 && message.trim().length >= 10 && !mutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Nouveau feedback</h1>
          <p className="text-sm text-foreground/70">Optimistic update côté client.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('..')}>
          Retour
        </Button>
      </div>

      <NewFeedbackForm
        customer={customer}
        message={message}
        sentiment={sentiment}
        canSubmit={canSubmit}
        onChangeCustomer={setCustomer}
        onChangeMessage={setMessage}
        onChangeSentiment={setSentiment}
        onCancel={() => navigate('..')}
        onSubmit={async () => {
          await mutation.mutateAsync({
            customer: customer.trim(),
            message: message.trim(),
            sentiment,
          })
          navigate('..')
        }}
      />
    </div>
  )
}
