import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom'

import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { cn } from './lib/utils'
import { useShellStore } from './store'
import { ThemeProvider, useTheme, type ThemeMode } from './theme'

const FeedbackRoutes = React.lazy(() => import('feedback/Routes'))
const AnalyticsRoutes = React.lazy(() => import('analytics/Routes'))
const AssistantRoutes = React.lazy(() => import('assistant/Routes'))

class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}

function RemoteBoundary({ children }: { children: React.ReactNode }) {
  return (
    <RemoteErrorBoundary
      fallback={
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Micro-frontend indisponible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            Vérifie que le remote est démarré et que son remoteEntry est
            accessible.
          </CardContent>
        </Card>
      }
    >
      <React.Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Chargement…</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Récupération du micro-frontend.
            </CardContent>
          </Card>
        }
      >
        {children}
      </React.Suspense>
    </RemoteErrorBoundary>
  )
}

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

const queryClient = new QueryClient()

function ShellLayout() {
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              {sidebarCollapsed ? 'Ouvrir' : 'Réduire'}
            </Button>
            <Link to="/" className="font-semibold tracking-tight">
              CX Hub
            </Link>
            <Badge>Demo MFE</Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              className="text-sm text-foreground/70 hover:text-foreground"
              href="https://www.smart-tribune.com/"
              target="_blank"
              rel="noreferrer"
            >
              Smart Tribune
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-6">
        <aside
          className={cn(
            'col-span-12 rounded-lg border border-border bg-card p-3 shadow-sm md:col-span-3',
            sidebarCollapsed && 'md:col-span-1',
          )}
        >
          <nav className="flex flex-col gap-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/feedback">Feedback</NavItem>
            <NavItem to="/analytics">Analytics</NavItem>
            <NavItem to="/assistant">AI Assistant</NavItem>
          </nav>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-2 text-sm hover:bg-muted',
          isActive && 'bg-primary-light text-foreground',
        )
      }
      end={to === '/'}
    >
      {children}
    </NavLink>
  )
}

function Dashboard() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plateforme de gestion CX avec micro-frontends</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/70">
          Shell Rsbuild (Rspack) + Module Federation, React Router lazy-load par
          MFE, tokens Tailwind, composants type shadcn/ui, Zustand + TanStack
          Query.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Satisfaction" value="92%" hint="CSAT (mock)" />
        <KpiCard title="Détracteurs" value="7%" hint="NPS bucket (mock)" />
        <KpiCard title="Temps de réponse" value="1.6s" hint="Core Web Vitals (demo)" />
      </div>
    </div>
  )
}

function KpiCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className="text-sm text-foreground/70">{hint}</div>
      </CardContent>
    </Card>
  )
}

function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page introuvable</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/70">
        Retour au <Link className="text-primary underline" to="/">dashboard</Link>.
      </CardContent>
    </Card>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<ShellLayout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="feedback/*"
              element={
                <RemoteBoundary>
                  <FeedbackRoutes />
                </RemoteBoundary>
              }
            />
            <Route
              path="analytics/*"
              element={
                <RemoteBoundary>
                  <AnalyticsRoutes />
                </RemoteBoundary>
              }
            />
            <Route
              path="assistant/*"
              element={
                <RemoteBoundary>
                  <AssistantRoutes />
                </RemoteBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
