import { create } from 'zustand'

type ShellState = {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useShellStore = create<ShellState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({
      sidebarCollapsed: !s.sidebarCollapsed,
    })),
}))
