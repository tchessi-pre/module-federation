import { cn } from '@cxhub/shared/utils'

import { PriorityPill, StatusPill } from '../pills'
import type { SavTicket } from '../../types'

export function TicketList({
  tickets,
  selectedId,
  now,
  onSelect,
}: {
  tickets: SavTicket[]
  selectedId: string | null
  now: number
  onSelect: (id: string) => void
}) {
  if (tickets.length === 0) {
    return <div className="text-sm text-foreground/70">Aucun ticket pour ce filtre.</div>
  }

  return (
    <div className="space-y-2">
      {tickets.map((t) => {
        const isSelected = selectedId === t.id
        const due = new Date(t.slaDueAt).getTime()
        const isOverdue = due < now && t.status !== 'closed'
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              'flex w-full items-start justify-between gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted',
              isSelected && 'border-primary/40 bg-primary/5',
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{t.subject}</span>
                <StatusPill status={t.status} />
                <PriorityPill priority={t.priority} />
                {isOverdue ? (
                  <span className="inline-flex items-center rounded-md border border-danger/30 bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                    SLA dépassé
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-foreground/70">
                {t.customer} · canal {t.channel}
                {t.assignee ? ` · assigné à ${t.assignee}` : ' · non assigné'}
              </div>
            </div>
            <div className="text-xs text-foreground/60">{t.id}</div>
          </button>
        )
      })}
    </div>
  )
}
