import { Outlet } from 'react-router-dom'

import { useShellStore } from '@/shared/state/shellStore'
import ShellHeader from './layout/ShellHeader'
import ShellSidebar from './layout/ShellSidebar'

export default function ShellLayout() {
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <ShellHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />

      <div className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 px-4 py-6">
        <div className="grid h-full min-h-0 w-full grid-cols-12 gap-4">
          <ShellSidebar collapsed={sidebarCollapsed} />

          <main className="scrollbar-none col-span-12 min-h-0 overflow-y-auto md:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
