import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@cxhub/shared/ui/card';

import { TicketFilters } from './TicketFilters';
import { TicketList } from './TicketList';
import type { TicketFilter } from '../../lib/tickets';
import type { SavTicket } from '../../types';

export function TicketsCard({
	filter,
	onFilterChange,
	tickets,
	selectedId,
	now,
	onSelect,
}: {
	filter: TicketFilter;
	onFilterChange: (next: TicketFilter) => void;
	tickets: SavTicket[];
	selectedId: string | null;
	now: number;
	onSelect: (id: string) => void;
}) {
	return (
		<Card>
			<CardHeader className='flex-row items-center justify-between gap-3'>
				<CardTitle>Tickets</CardTitle>
				<TicketFilters value={filter} onChange={onFilterChange} />
			</CardHeader>
			<CardContent className='space-y-3'>
				<TicketList
					tickets={tickets}
					selectedId={selectedId}
					now={now}
					onSelect={onSelect}
				/>
			</CardContent>
		</Card>
	);
}
