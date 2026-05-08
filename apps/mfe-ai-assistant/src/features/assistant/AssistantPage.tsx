import * as React from 'react'
import { useChat } from '@ai-sdk/react'
import type { FetchFunction } from '@ai-sdk/provider-utils'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import { retrieve } from '../../rag'
import { useAssistantStore } from '../../assistantStore'

function getLastUserText(messages: Array<{ role?: string; content?: unknown }>) {
  const last = [...messages].reverse().find((m) => m.role === 'user')
  if (!last) return ''
  if (typeof last.content === 'string') return last.content.trim()
  return String(last.content ?? '').trim()
}

function createLocalRagFetch(getTopK: () => number): FetchFunction {
  return async (_input, init) => {
    const signal = init?.signal
    const bodyText = typeof init?.body === 'string' ? init.body : ''
    const bodyJson = bodyText ? (JSON.parse(bodyText) as unknown) : null

    const messages =
      typeof bodyJson === 'object' && bodyJson && 'messages' in bodyJson
        ? ((bodyJson as { messages?: unknown }).messages as unknown[])
        : []

    const safeMessages = Array.isArray(messages) ? messages : []
    const query = getLastUserText(safeMessages as Array<{ role?: string; content?: unknown }>)
    const topK = getTopK()

    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        if (signal?.aborted) {
          controller.close()
          return
        }

        const onAbort = () => controller.close()
        signal?.addEventListener('abort', onAbort, { once: true })

        try {
          const retrieved = await retrieve(query, topK)
          const sources = retrieved
            .map((r, i) => {
              const title = String(r.doc.metadata?.title ?? `Source ${i + 1}`)
              const score = Math.round(r.score * 1000) / 1000
              return `- ${title} (score=${score})`
            })
            .join('\n')

          const answer = [
            "Réponse (démo RAG local, streaming côté client via Vercel AI SDK):",
            '',
            `Question: ${query || '(vide)'}`,
            '',
            'Synthèse:',
            ...retrieved.map((r, i) => `- (${i + 1}) ${r.doc.pageContent}`),
            '',
            'Sources:',
            sources || '- Aucune',
          ].join('\n')

          const chunks = answer.split(/(\s+)/)
          for (const chunk of chunks) {
            if (signal?.aborted) {
              controller.close()
              return
            }
            controller.enqueue(encoder.encode(chunk))
            await new Promise((r) => setTimeout(r, 10))
          }
          controller.close()
        } finally {
          signal?.removeEventListener('abort', onAbort)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }
}

export default function AssistantPage() {
  const topK = useAssistantStore((s) => s.topK)
  const setTopK = useAssistantStore((s) => s.setTopK)
  const showScores = useAssistantStore((s) => s.showScores)
  const toggleScores = useAssistantStore((s) => s.toggleScores)

  const fetch = React.useMemo(() => createLocalRagFetch(() => topK), [topK])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    setMessages,
  } = useChat({
    streamProtocol: 'text',
    fetch,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-foreground/70">
            UI streaming avec Vercel AI SDK + RAG local (LangChain Document,
            embeddings via Transformers.js, cache IndexedDB).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleScores}>
            Scores: {showScores ? 'on' : 'off'}
          </Button>
          <select
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
            value={topK}
            onChange={(e) => setTopK(Number(e.currentTarget.value) as 1 | 2 | 3 | 4)}
          >
            <option value={1}>TopK 1</option>
            <option value={2}>TopK 2</option>
            <option value={3}>TopK 3</option>
            <option value={4}>TopK 4</option>
          </select>
          {status === 'streaming' ? (
            <Button variant="danger" size="sm" onClick={() => stop()}>
              Stop
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            disabled={status === 'streaming'}
          >
            Reset
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            {error.message}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-sm text-foreground/70">
              Pose une question sur la démo (MFE, perf, RAG…).
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-md border border-border p-3',
                    m.role === 'user' ? 'bg-primary-light' : 'bg-card',
                  )}
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-foreground/60">
                    {m.role}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>Prompt</CardTitle>
          <div className="text-sm text-foreground/60">{status}</div>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ex: Comment tu garantis l'autonomie des MFEs ?"
            />
            <div className="flex items-center justify-end gap-2">
              <Button type="submit" disabled={status === 'streaming' || input.trim().length === 0}>
                Envoyer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
