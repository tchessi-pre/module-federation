import { create } from 'zustand'

type AssistantState = {
  topK: 1 | 2 | 3 | 4
  showScores: boolean
  setTopK: (k: 1 | 2 | 3 | 4) => void
  toggleScores: () => void
}

export const useAssistantStore = create<AssistantState>((set) => ({
  topK: 3,
  showScores: false,
  setTopK: (topK) => set({ topK }),
  toggleScores: () => set((s) => ({ showScores: !s.showScores })),
}))
