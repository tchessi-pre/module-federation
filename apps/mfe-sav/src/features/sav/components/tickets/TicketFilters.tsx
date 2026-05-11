import { Button } from '@cxhub/shared/ui/button'
import { ChevronDown } from 'lucide-react'

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
          onClick={() => onChange(value === opt.value ? 'all' : opt.value)}
          aria-label={opt.icon ? opt.label : undefined}
          title={opt.icon ? opt.label : undefined}
        >
          {opt.icon === 'dropdown' ? (
            <ChevronDown
              className={`h-4 w-4 transition-transform ${value === opt.value ? 'rotate-180' : 'rotate-0'
                }`}
            />
          ) : (
            opt.label
          )}
        </Button>
      ))}
    </div>
  )
}
