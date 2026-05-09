import { Button } from '@cxhub/shared/ui/button'

import { ticketFilterOptions, type TicketFilter } from '../../lib/tickets'

export function TicketFilters({
  value,
  onChange,
}: {
  value: TicketFilter
  onChange: (next: TicketFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ticketFilterOptions.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={value === opt.value ? 'secondary' : 'ghost'}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
