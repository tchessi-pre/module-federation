import { useQuery } from '@tanstack/react-query'

import { Button } from '@cxhub/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle, StatusCard } from '@cxhub/shared/ui/card'
import { useAnalyticsUiStore } from '@/shared/state/analyticsStore'

import AnalyticsHeader from '@/features/analytics/components/AnalyticsHeader'
import BarChart from '@/features/analytics/components/BarChart'
import KpiCard from '@/features/analytics/components/KpiCard'
import { mockFetchKpis } from '@/features/analytics/data'
import { kpiKey } from '@/features/analytics/types'

export default function AnalyticsPage() {
  const range = useAnalyticsUiStore((s) => s.range)
  const { data, isLoading, isError } = useQuery({
    queryKey: kpiKey(range),
    queryFn: () => mockFetchKpis(range),
  })

  return (
    <div className="space-y-4">
      <AnalyticsHeader />

      {isLoading ? (
        <StatusCard title="Chargement…" description="Calcul des KPIs." />
      ) : isError || !data ? (
        <StatusCard
          title="Erreur"
          description="Impossible de charger les analytics."
          tone="danger"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard title="CSAT" value={`${data.csat}%`} badge="Mock" />
            <KpiCard title="NPS" value={`${data.nps}`} badge="Mock" />
            <KpiCard title="Deflection" value={`${data.deflectionRate}%`} badge="Mock" />
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle>Volume (30 derniers points)</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => void 0}>
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <BarChart data={data.volumeByDay} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
