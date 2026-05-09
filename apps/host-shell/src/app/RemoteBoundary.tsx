import * as React from 'react'

import { StatusCard } from '@/shared/ui/card'
import { Suspense } from 'react';

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
        <StatusCard
          title="Micro-frontend indisponible"
          tone="danger"
          description="Vérifie que le remote est démarré et que son remoteEntry est accessible."
        />
      }
    >
      <Suspense
        fallback={
          <StatusCard title="Chargement…" description="Récupération du micro-frontend." />
        }
      >
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  )
}
