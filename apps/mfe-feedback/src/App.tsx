import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, Route, Routes } from 'react-router-dom'

import { Button } from './components/ui/button'
import FeedbackRoutes from './Routes'
import { ThemeProvider, useTheme, type ThemeMode } from './theme'

const queryClient = new QueryClient()

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

function StandaloneLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold">MFE Feedback</div>
            <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
              Liste
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/*" element={<FeedbackRoutes />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StandaloneLayout />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
