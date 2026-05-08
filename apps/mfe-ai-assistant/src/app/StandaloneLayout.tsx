import { Link, Route, Routes } from 'react-router-dom'

import { Button } from '../components/ui/button'
import AssistantRoutes from '../Routes'
import { useTheme, type ThemeMode } from '../theme'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const nextTheme: ThemeMode =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(nextTheme)}>
      Thème : {theme}
    </Button>
  )
}

export default function StandaloneLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold">MFE AI Assistant</div>
            <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
              Chat
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/*" element={<AssistantRoutes />} />
        </Routes>
      </main>
    </div>
  )
}
