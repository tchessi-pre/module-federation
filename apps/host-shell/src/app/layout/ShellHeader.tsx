import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink, Monitor, Moon, Sun } from 'lucide-react'

import { useTheme, type ThemeMode } from '@cxhub/shared/theme'
import { Button } from '@cxhub/shared/ui/button'
import { Badge } from '@cxhub/shared/ui/badge'

function ThemeIconButton() {
  const { theme, setTheme } = useTheme()

  const nextTheme: ThemeMode =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Thème : ${theme}. Passer à ${nextTheme}.`}
      className="h-9 w-9 p-0"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
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
          <div className="h-6 w-px bg-border" />
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1 font-semibold tracking-tight hover:bg-muted"
          >
            <span className="text-foreground">CX Hub</span>
            <Badge variant="success">Demo</Badge>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeIconButton />
          <Button asChild variant="ghost" size="sm">
            <a href="https://www.smart-tribune.com/" target="_blank" rel="noreferrer">
              <span className="hidden sm:inline">Smart Tribune</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
