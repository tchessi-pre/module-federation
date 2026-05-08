import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useFeedbackUiStore, type SentimentFilter } from '../../feedbackStore'

import FeedbackHeader from './components/FeedbackHeader'
import FeedbackListContent from './components/FeedbackListContent'
import NewFeedbackForm from './components/NewFeedbackForm'
import type { CreateFeedbackInput, FeedbackItem, FeedbackSentiment } from './types'

const feedbackKey = ['feedback', 'list'] as const

const mockDb: FeedbackItem[] = [
  {
    id: 'fb_001',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customer: 'Acme Retail',
    message:
      "J'ai trouvé la base de connaissances rapidement, mais la recherche pourrait mieux tolérer les fautes.",
    sentiment: 'neutral',
  },
  {
    id: 'fb_002',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customer: 'Bright Telecom',
    message: 'Super expérience, réponse instantanée et contenu très pertinent.',
    sentiment: 'positive',
  },
  {
    id: 'fb_003',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    customer: 'Nova Airlines',
    message: "Je n'ai pas trouvé la procédure de remboursement, trop de clics.",
    sentiment: 'negative',
  },
]

async function mockListFeedback(): Promise<FeedbackItem[]> {
  await new Promise((r) => setTimeout(r, 250))
  return [...mockDb].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

async function mockCreateFeedback(input: CreateFeedbackInput): Promise<FeedbackItem> {
  await new Promise((r) => setTimeout(r, 400))
  const item: FeedbackItem = {
    id: `fb_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...input,
  }
  mockDb.unshift(item)
  return item
}

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
        <Card>
          <CardHeader>
            <CardTitle>Chargement…</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            Récupération des feedbacks.
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            Impossible de charger la liste.
          </CardContent>
        </Card>
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
