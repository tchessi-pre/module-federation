export default function BarChart({ data }: { data: Array<{ day: string; volume: number }> }) {
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
