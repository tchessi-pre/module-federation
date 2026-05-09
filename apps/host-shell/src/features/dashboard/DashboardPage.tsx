import { Card, CardContent, CardHeader, CardTitle, StatusCard } from '@cxhub/shared/ui/card'

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

export default function DashboardPage() {
  const kpis = [
    { title: 'Satisfaction', value: '92%', hint: 'CSAT (mock)' },
    { title: 'Détracteurs', value: '7%', hint: 'NPS bucket (mock)' },
    { title: 'Temps de réponse', value: '1.6s', hint: 'Core Web Vitals (demo)' },
  ]

  return (
    <div className="space-y-4">
      <StatusCard
        title="Plateforme de gestion CX avec micro-frontends"
        description={
          <>
            Shell Rsbuild (Rspack) + Module Federation, React Router lazy-load par MFE, tokens
            Tailwind, composants type shadcn/ui, Zustand + TanStack Query.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} hint={kpi.hint} />
        ))}
      </div>
    </div>
  )
}
