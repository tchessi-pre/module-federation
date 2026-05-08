import type { RangeKey } from '@/shared/state/analyticsStore'

export type VolumePoint = { day: string; volume: number }

export type Kpis = {
  csat: number
  nps: number
  deflectionRate: number
  volumeByDay: VolumePoint[]
}

export const kpiKey = (range: RangeKey) => ['analytics', 'kpis', range] as const
