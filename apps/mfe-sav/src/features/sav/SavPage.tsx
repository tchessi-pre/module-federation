import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle, StatusCard } from '@/shared/ui/card'

import {
  mockCreateSavTicket,
  mockListSavTickets,
  mockSetSavTicketStatus,
  savTicketsKey,
} from './data'
import type { CreateSavTicketInput, SavTicket, TicketPriority, TicketStatus } from './types'

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

function StatusPill({ status }: { status: TicketStatus }) {
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

function PriorityPill({ priority }: { priority: TicketPriority }) {
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        props.className,
      )}
    />
  )
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'flex min-h-24 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        props.className,
      )}
    />
  )
}

export default function SavPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = React.useState<'all' | TicketStatus>('all')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [now, setNow] = React.useState(0)

  const [customer, setCustomer] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<TicketPriority>('medium')
  const [channel, setChannel] = React.useState<CreateSavTicketInput['channel']>('web')

  React.useEffect(() => {
    const first = window.setTimeout(() => setNow(Date.now()), 0)
    const id = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
    }
  }, [])

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
  const visibleTickets = tickets.filter((t) => (filter === 'all' ? true : t.status === filter))
  const selected = selectedId ? tickets.find((t) => t.id === selectedId) ?? null : null

  const counts = tickets.reduce(
    (acc, t) => {
      acc.total += 1
      acc[t.status] += 1
      return acc
    },
    { total: 0, open: 0, in_progress: 0, pending_customer: 0, resolved: 0, closed: 0 } as Record<
      'total' | TicketStatus,
      number
    >,
  )

  const canCreate =
    customer.trim().length >= 2 &&
    subject.trim().length >= 5 &&
    description.trim().length >= 10 &&
    !createMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">SAV</h1>
          <p className="text-sm text-foreground/70">
            Gestion des tickets (mock) : liste, filtres, création, et mise à jour de statut.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: savTicketsKey })}
            disabled={isLoading}
            aria-label="Rafraîchir"
            title="Rafraîchir"
            className="h-9 w-9 p-0"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </div>

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{counts.total}</div>
                <div className="text-sm text-foreground/70">tickets</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ouverts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{counts.open}</div>
                <div className="text-sm text-foreground/70">à traiter</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>En cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{counts.in_progress}</div>
                <div className="text-sm text-foreground/70">assignés</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Attente client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{counts.pending_customer}</div>
                <div className="text-sm text-foreground/70">en attente</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle>Tickets</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('all')}
                >
                  Tous
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'open' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('open')}
                >
                  Ouverts
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'in_progress' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('in_progress')}
                >
                  En cours
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'pending_customer' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('pending_customer')}
                >
                  Attente client
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'resolved' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('resolved')}
                >
                  Résolus
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'closed' ? 'secondary' : 'ghost'}
                  onClick={() => setFilter('closed')}
                >
                  Fermés
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleTickets.length === 0 ? (
                <div className="text-sm text-foreground/70">Aucun ticket pour ce filtre.</div>
              ) : (
                <div className="space-y-2">
                  {visibleTickets.map((t) => {
                    const isSelected = selectedId === t.id
                    const due = new Date(t.slaDueAt).getTime()
                    const isOverdue = due < now && t.status !== 'closed'
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedId(t.id)}
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
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Nouveau ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="Client">
                  <TextInput
                    value={customer}
                    onChange={(e) => setCustomer(e.currentTarget.value)}
                    placeholder="Acme Retail"
                  />
                </Field>
                <Field label="Sujet">
                  <TextInput
                    value={subject}
                    onChange={(e) => setSubject(e.currentTarget.value)}
                    placeholder="Ex: Retour produit / échange / remboursement…"
                  />
                </Field>
                <Field label="Description">
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    placeholder="Décris le problème et le contexte…"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Priorité">
                    <select
                      className="h-10 w-full rounded-md border border-border bg-card px-2 text-sm"
                      value={priority}
                      onChange={(e) => setPriority(e.currentTarget.value as TicketPriority)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </Field>
                  <Field label="Canal">
                    <select
                      className="h-10 w-full rounded-md border border-border bg-card px-2 text-sm"
                      value={channel}
                      onChange={(e) => setChannel(e.currentTarget.value as CreateSavTicketInput['channel'])}
                    >
                      <option value="web">Web</option>
                      <option value="email">Email</option>
                      <option value="chat">Chat</option>
                      <option value="phone">Téléphone</option>
                    </select>
                  </Field>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCustomer('')
                      setSubject('')
                      setDescription('')
                      setPriority('medium')
                      setChannel('web')
                    }}
                    disabled={createMutation.isPending}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={async () => {
                      const input: CreateSavTicketInput = {
                        customer: customer.trim(),
                        subject: subject.trim(),
                        description: description.trim(),
                        priority,
                        channel,
                      }
                      await createMutation.mutateAsync(input)
                      setCustomer('')
                      setSubject('')
                      setDescription('')
                      setPriority('medium')
                      setChannel('web')
                    }}
                    disabled={!canCreate}
                  >
                    Créer
                  </Button>
                </div>
                {createMutation.isError ? (
                  <div className="text-sm text-danger">
                    {createMutation.error instanceof Error
                      ? createMutation.error.message
                      : 'Erreur lors de la création.'}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!selected ? (
                  <div className="text-sm text-foreground/70">
                    Sélectionne un ticket dans la liste.
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{selected.subject}</div>
                      <div className="text-sm text-foreground/70">
                        {selected.customer} · {selected.id}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={selected.status} />
                      <PriorityPill priority={selected.priority} />
                      <span className="text-sm text-foreground/70">canal {selected.channel}</span>
                    </div>

                    <div className="whitespace-pre-wrap rounded-md border border-border bg-card p-3 text-sm">
                      {selected.description}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={selected.status === 'open' ? 'secondary' : 'ghost'}
                        onClick={() => statusMutation.mutate({ id: selected.id, status: 'open' })}
                        disabled={statusMutation.isPending}
                      >
                        Ouvrir
                      </Button>
                      <Button
                        size="sm"
                        variant={selected.status === 'in_progress' ? 'secondary' : 'ghost'}
                        onClick={() => statusMutation.mutate({ id: selected.id, status: 'in_progress' })}
                        disabled={statusMutation.isPending}
                      >
                        En cours
                      </Button>
                      <Button
                        size="sm"
                        variant={selected.status === 'pending_customer' ? 'secondary' : 'ghost'}
                        onClick={() =>
                          statusMutation.mutate({ id: selected.id, status: 'pending_customer' })
                        }
                        disabled={statusMutation.isPending}
                      >
                        Attente client
                      </Button>
                      <Button
                        size="sm"
                        variant={selected.status === 'resolved' ? 'secondary' : 'ghost'}
                        onClick={() => statusMutation.mutate({ id: selected.id, status: 'resolved' })}
                        disabled={statusMutation.isPending}
                      >
                        Résolu
                      </Button>
                      <Button
                        size="sm"
                        variant={selected.status === 'closed' ? 'secondary' : 'ghost'}
                        onClick={() => statusMutation.mutate({ id: selected.id, status: 'closed' })}
                        disabled={statusMutation.isPending}
                      >
                        Fermé
                      </Button>
                    </div>

                    {statusMutation.isError ? (
                      <div className="text-sm text-danger">
                        {statusMutation.error instanceof Error
                          ? statusMutation.error.message
                          : 'Erreur lors de la mise à jour.'}
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
