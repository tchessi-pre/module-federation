import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { StatusCard } from '@cxhub/shared/common/status-card'

import { SavPageHeader } from './components/page/SavPageHeader'
import { TicketKpis } from './components/tickets/TicketKpis'
import { NewTicketCard } from './components/tickets/NewTicketCard'
import { TicketDetailsCard } from './components/tickets/TicketDetailsCard'
import { TicketsCard } from './components/tickets/TicketsCard'
import { countTickets, type TicketFilter } from './lib/tickets'
import {
  mockCreateSavTicket,
  mockListSavTickets,
  mockSetSavTicketStatus,
  savTicketsKey,
} from './data'
import type { CreateSavTicketInput, SavTicket, TicketStatus } from './types'

function useNow(intervalMs: number) {
  const [now, setNow] = React.useState(0)

  React.useEffect(() => {
    const first = window.setTimeout(() => setNow(Date.now()), 0)
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
    }
  }, [intervalMs])

  return now
}

export default function SavPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = React.useState<TicketFilter>('all')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [isNewTicketOpen, setIsNewTicketOpen] = React.useState(false)
  const now = useNow(60_000)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: savTicketsKey,
    queryFn: mockListSavTickets,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateSavTicketInput) => mockCreateSavTicket(input),
    onSuccess: (created) => {
      queryClient.setQueryData<SavTicket[]>(savTicketsKey, (old) => [created, ...(old ?? [])])
      setSelectedId(created.id)
    },
  })

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: TicketStatus }) => mockSetSavTicketStatus(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<SavTicket[]>(savTicketsKey, (old) =>
        (old ?? []).map((t) => (t.id === updated.id ? updated : t)),
      )
    },
  })

  const tickets = data ?? []
  const selected = selectedId ? tickets.find((t) => t.id === selectedId) ?? null : null
  const visibleTickets = tickets.filter((t) => (filter === 'all' ? true : t.status === filter))
  const counts = countTickets(tickets)

  const createErrorMessage = createMutation.isError
    ? createMutation.error instanceof Error
      ? createMutation.error.message
      : 'Erreur lors de la création.'
    : null

  const statusErrorMessage = statusMutation.isError
    ? statusMutation.error instanceof Error
      ? statusMutation.error.message
      : 'Erreur lors de la mise à jour.'
    : null

  return (
    <div className="space-y-4">
      <SavPageHeader
        isLoading={isLoading}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: savTicketsKey })}
        isNewTicketOpen={isNewTicketOpen}
        onToggleNewTicket={() => setIsNewTicketOpen((v) => !v)}
      />

      {isLoading ? (
        <StatusCard title="Chargement…" description="Récupération des tickets SAV." />
      ) : isError ? (
        <StatusCard
          title="Erreur"
          tone="danger"
          description={error instanceof Error ? error.message : 'Impossible de charger les tickets.'}
        />
      ) : (
        <>
          <TicketKpis counts={counts} />
          <TicketsCard
            filter={filter}
            onFilterChange={setFilter}
            tickets={visibleTickets}
            selectedId={selectedId}
            now={now}
            onSelect={setSelectedId}
          />

          {isNewTicketOpen ? (
            <div className="grid grid-cols-1 gap-4">
              <NewTicketCard
                isPending={createMutation.isPending}
                errorMessage={createErrorMessage}
                onCreate={async (input) => {
                  await createMutation.mutateAsync(input)
                  setIsNewTicketOpen(false)
                }}
              />
            </div>
          ) : (
            <TicketDetailsCard
              ticket={selected}
              isPending={statusMutation.isPending}
              errorMessage={statusErrorMessage}
              onSetStatus={(id, status) => statusMutation.mutate({ id, status })}
            />
          )}
        </>
      )}
    </div>
  )
}
