import type { RangeKey } from '@/shared/state/analyticsStore'
import type { Kpis } from '@/features/analytics/types'

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export async function mockFetchKpis(range: RangeKey): Promise<Kpis> {
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
