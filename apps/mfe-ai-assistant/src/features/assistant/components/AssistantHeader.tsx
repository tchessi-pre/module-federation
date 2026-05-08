import { Button } from '@/components/ui/button'

export default function AssistantHeader({
  topK,
  setTopK,
  showScores,
  toggleScores,
  status,
  onStop,
  onReset,
}: {
  topK: 1 | 2 | 3 | 4
  setTopK: (value: 1 | 2 | 3 | 4) => void
  showScores: boolean
  toggleScores: () => void
  status: string
  onStop: () => void
  onReset: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
        <p className="text-sm text-foreground/70">
          UI streaming avec Vercel AI SDK + RAG local (LangChain Document, embeddings via
          Transformers.js, cache IndexedDB).
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
          <Button variant="danger" size="sm" onClick={onStop}>
            Stop
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={onReset} disabled={status === 'streaming'}>
          Reset
        </Button>
      </div>
    </div>
  )
}
