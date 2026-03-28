import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

import type { Traits } from '../../types'
import type { TimelineMetricPoint, TimelineMetricKey } from './metrics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const neon = {
  openness: '#8B5CF6',
  conscientiousness: '#3B82F6',
  extraversion: '#22D3EE',
  agreeableness: '#60A5FA',
  neuroticism: '#A78BFA',
  stress: '#EF4444',
  confidence: '#34D399',
} satisfies Record<TimelineMetricKey, string>

function formatLabel(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(5, 16)
  return d.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function TimelineGraph({
  items,
  keys,
}: {
  items: TimelineMetricPoint[]
  keys: TimelineMetricKey[]
}) {
  const labels = items.map((i) => formatLabel(i.created_at))

  const datasets = keys.map((key) => {
    const color = neon[key]
    return {
      label: key,
      data: items.map((i) => {
        if (key === 'stress') return i.metrics.stress
        if (key === 'confidence') return i.metrics.confidence
        return i.traits[key as keyof Traits]
      }),
      borderColor: color,
      pointBackgroundColor: color,
      pointBorderColor: '#0B1020',
      pointRadius: 2,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.38,
      fill: false,
    }
  })

  const data = { labels, datasets }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        labels: { color: 'rgba(224,231,255,0.9)' },
      },
      tooltip: {
        backgroundColor: 'rgba(2,6,23,0.92)',
        borderColor: 'rgba(34,211,238,0.35)',
        borderWidth: 1,
        titleColor: '#E0E7FF',
        bodyColor: 'rgba(224,231,255,0.9)',
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${(ctx.parsed.y * 100).toFixed(0)}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(224,231,255,0.7)', maxRotation: 0, autoSkip: true },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: { color: 'rgba(224,231,255,0.7)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  } as const

  return (
    <div className="h-[360px] w-full">
      <Line data={data} options={options} />
    </div>
  )
}

