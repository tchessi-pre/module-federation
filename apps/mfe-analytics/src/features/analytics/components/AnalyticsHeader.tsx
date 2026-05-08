import { useAnalyticsUiStore } from '@/shared/state/analyticsStore'
import RangeChip from './RangeChip'

export default function AnalyticsHeader() {
  const range = useAnalyticsUiStore((s) => s.range)
  const setRange = useAnalyticsUiStore((s) => s.setRange)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-foreground/70">
          KPIs mock + mini chart SVG. Range géré par Zustand, data par TanStack Query.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <RangeChip active={range === '7d'} onClick={() => setRange('7d')}>
          7 jours
        </RangeChip>
        <RangeChip active={range === '30d'} onClick={() => setRange('30d')}>
          30 jours
        </RangeChip>
        <RangeChip active={range === '90d'} onClick={() => setRange('90d')}>
          90 jours
        </RangeChip>
      </div>
    </div>
  )
}
