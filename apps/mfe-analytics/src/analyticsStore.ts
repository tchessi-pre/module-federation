import { create } from 'zustand'

export type RangeKey = '7d' | '30d' | '90d'

type AnalyticsUiState = {
  range: RangeKey
  setRange: (range: RangeKey) => void
}

export const useAnalyticsUiStore = create<AnalyticsUiState>((set) => ({
  range: '30d',
  setRange: (range) => set({ range }),
}))
