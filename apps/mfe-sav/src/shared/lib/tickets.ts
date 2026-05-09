import type { SavTicket, TicketStatus } from '../../features/sav/types'

export type TicketFilter = 'all' | TicketStatus
export type TicketCounts = Record<'total' | TicketStatus, number>

export const ticketFilterOptions: { value: TicketFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'open', label: 'Ouverts' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'pending_customer', label: 'Attente client' },
  { value: 'resolved', label: 'Résolus' },
  { value: 'closed', label: 'Fermés' },
]

export const ticketStatusActionOptions: { status: TicketStatus; label: string }[] = [
  { status: 'open', label: 'Ouvrir' },
  { status: 'in_progress', label: 'En cours' },
  { status: 'pending_customer', label: 'Attente client' },
  { status: 'resolved', label: 'Résolu' },
  { status: 'closed', label: 'Fermé' },
]

export function countTickets(tickets: SavTicket[]): TicketCounts {
  return tickets.reduce(
    (acc, t) => {
      acc.total += 1
      acc[t.status] += 1
      return acc
    },
    { total: 0, open: 0, in_progress: 0, pending_customer: 0, resolved: 0, closed: 0 } as TicketCounts,
  )
}
