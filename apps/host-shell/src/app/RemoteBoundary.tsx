import * as React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

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

export default function RemoteBoundary({ children }: { children: React.ReactNode }) {
  return (
    <RemoteErrorBoundary
      fallback={
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Micro-frontend indisponible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            Vérifie que le remote est démarré et que son remoteEntry est accessible.
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
