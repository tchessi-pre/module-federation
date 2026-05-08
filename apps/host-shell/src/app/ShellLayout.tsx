import { Outlet } from 'react-router-dom'

import { useShellStore } from '@/shared/state/shellStore'
import ShellHeader from './layout/ShellHeader'
import ShellSidebar from './layout/ShellSidebar'

export default function ShellLayout() {
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ShellHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />

      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-6">
        <ShellSidebar collapsed={sidebarCollapsed} />

        <main className="col-span-12 md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
