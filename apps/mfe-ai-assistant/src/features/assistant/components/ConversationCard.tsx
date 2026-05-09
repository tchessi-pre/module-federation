import { Card, CardContent, CardHeader, CardTitle } from '@cxhub/shared/ui/card'
import { cn } from '@cxhub/shared/utils'

type ChatMessage = {
  id: string
  role: string
  content: string
}

export default function ConversationCard({ messages }: { messages: ChatMessage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-foreground/70">Pose une question sur la démo (MFE, perf, RAG…).</div>
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
  )
}
