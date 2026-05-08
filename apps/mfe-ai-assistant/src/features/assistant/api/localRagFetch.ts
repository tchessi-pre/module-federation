import type { FetchFunction } from '@ai-sdk/provider-utils'

import { retrieve } from '@/rag'

function getLastUserText(messages: Array<{ role?: string; content?: unknown }>) {
  const last = [...messages].reverse().find((m) => m.role === 'user')
  if (!last) return ''
  if (typeof last.content === 'string') return last.content.trim()
  return String(last.content ?? '').trim()
}

export function createLocalRagFetch(getTopK: () => number): FetchFunction {
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
