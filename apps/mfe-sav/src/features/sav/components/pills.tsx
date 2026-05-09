import { cn } from '@/shared/lib/utils'

import type { TicketPriority, TicketStatus } from '../types'

function statusLabel(status: TicketStatus) {
  if (status === 'open') return 'Ouvert'
  if (status === 'in_progress') return 'En cours'
  if (status === 'pending_customer') return 'Attente client'
  if (status === 'resolved') return 'Résolu'
  return 'Fermé'
}

function priorityLabel(priority: TicketPriority) {
  if (priority === 'low') return 'Low'
  if (priority === 'medium') return 'Medium'
  if (priority === 'high') return 'High'
  return 'Urgent'
}

export function StatusPill({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        status === 'open' && 'border-primary/30 bg-primary/10 text-primary',
        status === 'in_progress' && 'border-secondary/30 bg-secondary/10 text-secondary',
        status === 'pending_customer' && 'border-warning/30 bg-warning/10 text-warning',
        status === 'resolved' && 'border-success/30 bg-success/10 text-success',
        status === 'closed' && 'border-border bg-muted text-foreground',
      )}
    >
      {statusLabel(status)}
    </span>
  )
}

export function PriorityPill({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        priority === 'low' && 'border-border bg-muted text-foreground',
        priority === 'medium' && 'border-primary/20 bg-primary/10 text-primary',
        priority === 'high' && 'border-warning/30 bg-warning/10 text-warning',
        priority === 'urgent' && 'border-danger/30 bg-danger/10 text-danger',
      )}
    >
      {priorityLabel(priority)}
    </span>
  )
}
