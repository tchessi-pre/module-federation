import { RefreshCw } from 'lucide-react';

import { IconButton } from '@/shared/ui/icon-button';

export function SavPageHeader({
	isLoading,
	onRefresh,
}: {
	isLoading: boolean;
	onRefresh: () => void;
}) {
	return (
		<div className='flex flex-wrap items-start justify-between gap-3'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold tracking-tight'>SAV</h1>
				<p className='text-sm text-foreground/70'>
					Gestion des tickets (mock) : liste, filtres, création, et mise à jour
					de statut.
				</p>
			</div>
			<div className='flex flex-wrap items-center gap-2'>
				<IconButton
					label='Rafraîchir'
					variant='ghost'
					size='sm'
					onClick={onRefresh}
					disabled={isLoading}
					spinning={isLoading}
				>
					<RefreshCw className='h-4 w-4' />
				</IconButton>
			</div>
		</div>
	);
}
