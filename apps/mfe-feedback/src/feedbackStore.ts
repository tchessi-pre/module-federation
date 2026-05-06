import { create } from 'zustand'

export type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative'

type FeedbackUiState = {
  sentiment: SentimentFilter
  setSentiment: (sentiment: SentimentFilter) => void
}

export const useFeedbackUiStore = create<FeedbackUiState>((set) => ({
  sentiment: 'all',
  setSentiment: (sentiment) => set({ sentiment }),
}))
