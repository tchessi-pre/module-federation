import { Button } from '@cxhub/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@cxhub/shared/ui/card'

import { PriorityPill, StatusPill } from '../pills'
import { ticketStatusActionOptions } from '../../lib/tickets'
import type { SavTicket, TicketStatus } from '../../types'

export function TicketDetailsCard({
  ticket,
  isPending,
  errorMessage,
  onSetStatus,
}: {
  ticket: SavTicket | null
  isPending: boolean
  errorMessage: string | null
  onSetStatus: (id: string, status: TicketStatus) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!ticket ? (
          <div className="text-sm text-foreground/70">Sélectionne un ticket dans la liste.</div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="text-sm font-semibold">{ticket.subject}</div>
              <div className="text-sm text-foreground/70">
                {ticket.customer} · {ticket.id}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={ticket.status} />
              <PriorityPill priority={ticket.priority} />
              <span className="text-sm text-foreground/70">canal {ticket.channel}</span>
            </div>

            <div className="whitespace-pre-wrap rounded-md border border-border bg-card p-3 text-sm">
              {ticket.description}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ticketStatusActionOptions.map((opt) => (
                <Button
                  key={opt.status}
                  size="sm"
                  variant={ticket.status === opt.status ? 'secondary' : 'ghost'}
                  onClick={() => onSetStatus(ticket.id, opt.status)}
                  disabled={isPending}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            {errorMessage ? <div className="text-sm text-danger">{errorMessage}</div> : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}
