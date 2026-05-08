import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { cn } from '../../lib/utils'
import { useAnalyticsUiStore, type RangeKey } from '../../analyticsStore'

type Kpis = {
  csat: number
  nps: number
  deflectionRate: number
  volumeByDay: Array<{ day: string; volume: number }>
}

const kpiKey = (range: RangeKey) => ['analytics', 'kpis', range] as const

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

async function mockFetchKpis(range: RangeKey): Promise<Kpis> {
  await new Promise((r) => setTimeout(r, 220))

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const rand = mulberry32(days * 1337)

  const base = range === '7d' ? 80 : range === '30d' ? 82 : 84
  const csat = base + Math.round(rand() * 8)
  const nps = 30 + Math.round(rand() * 25)
  const deflectionRate = 45 + Math.round(rand() * 25)

  const volumeByDay = Array.from({ length: Math.min(days, 30) }).map((_, i) => {
    const volume = Math.round(40 + rand() * 70 + (i % 7 === 0 ? 20 : 0))
    const day = new Date(Date.now() - (Math.min(days, 30) - 1 - i) * 864e5)
      .toISOString()
      .slice(5, 10)
    return { day, volume }
  })

  return { csat, nps, deflectionRate, volumeByDay }
}

function PageHeader() {
  const range = useAnalyticsUiStore((s) => s.range)
  const setRange = useAnalyticsUiStore((s) => s.setRange)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-foreground/70">
          KPIs mock + mini chart SVG. Range géré par Zustand, data par TanStack Query.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <RangeChip active={range === '7d'} onClick={() => setRange('7d')}>
          7 jours
        </RangeChip>
        <RangeChip active={range === '30d'} onClick={() => setRange('30d')}>
          30 jours
        </RangeChip>
        <RangeChip active={range === '90d'} onClick={() => setRange('90d')}>
          90 jours
        </RangeChip>
      </div>
    </div>
  )
}

function RangeChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border border-border px-3 py-2 text-sm transition-colors',
        active ? 'bg-primary-light' : 'bg-card hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

function Kpi({ title, value, badge }: { title: string; value: string; badge: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Badge>{badge}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}

function BarChart({ data }: { data: Array<{ day: string; volume: number }> }) {
  const width = 900
  const height = 220
  const padding = 24

  const max = Math.max(...data.map((d) => d.volume), 1)
  const barWidth = (width - padding * 2) / data.length
  const scaleY = (v: number) => (height - padding) * (v / max)

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[900px]"
        role="img"
        aria-label="Volume par jour"
      >
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        {data.map((d, i) => {
          const h = scaleY(d.volume)
          const x = padding + i * barWidth
          const y = height - padding - h
          return (
            <g key={d.day}>
              <rect
                x={x}
                y={y}
                width={barWidth - 4}
                height={h}
                rx={6}
                fill="var(--primary)"
                opacity={0.85}
              />
              {i % 5 === 0 ? (
                <text
                  x={x + (barWidth - 4) / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--fg)"
                  opacity={0.6}
                >
                  {d.day}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function AnalyticsPage() {
  const range = useAnalyticsUiStore((s) => s.range)
  const { data, isLoading, isError } = useQuery({
    queryKey: kpiKey(range),
    queryFn: () => mockFetchKpis(range),
  })

  return (
    <div className="space-y-4">
      <PageHeader />

      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Chargement…</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">Calcul des KPIs.</CardContent>
        </Card>
      ) : isError || !data ? (
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70">
            Impossible de charger les analytics.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Kpi title="CSAT" value={`${data.csat}%`} badge="Mock" />
            <Kpi title="NPS" value={`${data.nps}`} badge="Mock" />
            <Kpi title="Deflection" value={`${data.deflectionRate}%`} badge="Mock" />
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
