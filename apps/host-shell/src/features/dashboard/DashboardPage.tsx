import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

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
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plateforme de gestion CX avec micro-frontends</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/70">
          Shell Rsbuild (Rspack) + Module Federation, React Router lazy-load par MFE, tokens
          Tailwind, composants type shadcn/ui, Zustand + TanStack Query.
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
