import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink, Monitor, Moon, Sun } from 'lucide-react'

import { useTheme, type ThemeMode } from '@/shared/theme/theme'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const nextTheme: ThemeMode =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(nextTheme)}>
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">Thème : {theme}</span>
    </Button>
  )
}

export default function ShellHeader({
  sidebarCollapsed,
  onToggleSidebar,
}: {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Ouvrir la sidebar' : 'Réduire la sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {sidebarCollapsed ? 'Ouvrir' : 'Réduire'}
            </span>
          </Button>
          <Link to="/" className="font-semibold tracking-tight">
            CX Hub
          </Link>
          <Badge>Demo MFE</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground"
            href="https://www.smart-tribune.com/"
            target="_blank"
            rel="noreferrer"
          >
            Smart Tribune
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
