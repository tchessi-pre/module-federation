import { Link, Route, Routes } from 'react-router-dom'

import { useTheme, type ThemeMode } from '@cxhub/shared/theme'
import { Button } from '@cxhub/shared/ui/button'
import SavRoutes from '@/Routes'

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
    >
      Thème
    </Button>
  )
}

export default function StandaloneLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold">MFE SAV</div>
            <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
              Tickets
            </Link>
          </div>
          <ThemeIconButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/*" element={<SavRoutes />} />
        </Routes>
      </main>
    </div>
  )
}
