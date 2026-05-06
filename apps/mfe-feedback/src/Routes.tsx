import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import './index.css'

import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { cn } from './lib/utils'
import { useFeedbackUiStore, type SentimentFilter } from './feedbackStore'

type FeedbackSentiment = 'positive' | 'neutral' | 'negative'

type FeedbackItem = {
  id: string
  createdAt: string
  customer: string
  message: string
  sentiment: FeedbackSentiment
}

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
    message: "Super expérience, réponse instantanée et contenu très pertinent.",
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

type CreateFeedbackInput = Pick<FeedbackItem, 'customer' | 'message' | 'sentiment'>

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

function matchesFilter(item: FeedbackItem, filter: SentimentFilter) {
  if (filter === 'all') return true
  return item.sentiment === filter
}

function PageHeader() {
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
        <FilterChip
          active={sentiment === 'all'}
          onClick={() => setSentiment('all')}
        >
          Tous
        </FilterChip>
        <FilterChip
          active={sentiment === 'positive'}
          onClick={() => setSentiment('positive')}
        >
          Positifs
        </FilterChip>
        <FilterChip
          active={sentiment === 'neutral'}
          onClick={() => setSentiment('neutral')}
        >
          Neutres
        </FilterChip>
        <FilterChip
          active={sentiment === 'negative'}
          onClick={() => setSentiment('negative')}
        >
          Négatifs
        </FilterChip>
        <Button asChild>
          <Link to="new">Nouveau</Link>
        </Button>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border border-border px-3 py-2 text-sm transition-colors',
        active ? 'bg-primary-light' : 'bg-card hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

function FeedbackListPage() {
  const sentiment = useFeedbackUiStore((s) => s.sentiment)
  const { data, isLoading, isError } = useQuery({
    queryKey: feedbackKey,
    queryFn: mockListFeedback,
  })

  const items = (data ?? []).filter((i) => matchesFilter(i, sentiment))

  return (
    <div className="space-y-4">
      <PageHeader />

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
      )}
    </div>
  )
}

function NewFeedbackPage() {
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
      queryClient.setQueryData<FeedbackItem[]>(feedbackKey, (old) => [
        optimistic,
        ...(old ?? []),
      ])
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

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <Input
              value={customer}
              onChange={(e) => setCustomer(e.currentTarget.value)}
              placeholder="Acme Retail"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              placeholder="Décris le ressenti / problème…"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sentiment</label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={sentiment === 'positive' ? 'secondary' : 'ghost'}
                onClick={() => setSentiment('positive')}
              >
                Positif
              </Button>
              <Button
                type="button"
                variant={sentiment === 'neutral' ? 'secondary' : 'ghost'}
                onClick={() => setSentiment('neutral')}
              >
                Neutre
              </Button>
              <Button
                type="button"
                variant={sentiment === 'negative' ? 'secondary' : 'ghost'}
                onClick={() => setSentiment('negative')}
              >
                Négatif
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => navigate('..')}>
              Annuler
            </Button>
            <Button
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                await mutation.mutateAsync({
                  customer: customer.trim(),
                  message: message.trim(),
                  sentiment,
                })
                navigate('..')
              }}
            >
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FeedbackRoutes() {
  return (
    <Routes>
      <Route index element={<FeedbackListPage />} />
      <Route path="new" element={<NewFeedbackPage />} />
    </Routes>
  )
}
