
import type { TicketCounts } from '../../lib/tickets'
import { StatCard } from '@cxhub/shared/ui/stat-card'

export function TicketKpis({ counts }: { counts: TicketCounts }) {
  const items = [
    { title: 'Total', value: counts.total, hint: 'tickets' },
    { title: 'Ouverts', value: counts.open, hint: 'à traiter' },
    { title: 'En cours', value: counts.in_progress, hint: 'assignés' },
    { title: 'Attente client', value: counts.pending_customer, hint: 'en attente' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {items.map((it) => (
        <StatCard key={it.title} title={it.title} value={it.value} hint={it.hint} />
      ))}
    </div>
  )
}
