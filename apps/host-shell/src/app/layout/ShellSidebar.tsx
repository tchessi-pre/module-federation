import { NavLink } from 'react-router-dom'
import { BarChart3, Bot, LayoutDashboard, MessageSquare } from 'lucide-react'

import { cn } from '../../lib/utils'

function NavItem({
  to,
  label,
  icon,
  collapsed,
}: {
  to: string
  label: string
  icon: React.ReactNode
  collapsed: boolean
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md py-2 text-sm transition-[padding,background-color,color] duration-200 ease-out hover:bg-muted',
          collapsed ? 'justify-center px-2' : 'px-3',
          isActive && 'bg-primary text-white shadow-sm',
        )
      }
      end={to === '/'}
      aria-label={collapsed ? label : undefined}
    >
      {icon}
      <span
        className={cn(
          'truncate transition-[max-width,opacity,transform] duration-200 ease-out',
          collapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-[160px] translate-x-0 opacity-100',
        )}
      >
        {label}
      </span>
    </NavLink>
  )
}

export default function ShellSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        'col-span-12 rounded-lg border border-border bg-card p-3 shadow-sm transition-all duration-200 ease-out md:col-span-3',
        collapsed && 'md:col-span-1',
      )}
    >
      <nav className="flex flex-col gap-1">
        <NavItem
          to="/"
          label="Dashboard"
          collapsed={collapsed}
          icon={<LayoutDashboard className="h-4 w-4" />}
        />
        <NavItem
          to="/feedback"
          label="Feedback"
          collapsed={collapsed}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <NavItem
          to="/analytics"
          label="Analytics"
          collapsed={collapsed}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <NavItem
          to="/assistant"
          label="AI Assistant"
          collapsed={collapsed}
          icon={<Bot className="h-4 w-4" />}
        />
      </nav>
    </aside>
  )
}
