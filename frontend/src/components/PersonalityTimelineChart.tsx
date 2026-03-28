import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

import type { Traits, TimelinePoint } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const colorByTrait: Record<keyof Traits, string> = {
  openness: '#8B5CF6',
  conscientiousness: '#3B82F6',
  extraversion: '#22D3EE',
  agreeableness: '#60A5FA',
  neuroticism: '#A78BFA',
}

function formatLabel(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(11, 16)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function PersonalityTimelineChart({ items }: { items: TimelinePoint[] }) {
  const labels = items.map((i) => formatLabel(i.created_at))

  const datasets = (Object.keys(colorByTrait) as (keyof Traits)[]).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    data: items.map((i) => i.traits[key]),
    borderColor: colorByTrait[key],
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    fill: false,
    tension: 0.35,
    borderWidth: 2.5,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointBackgroundColor: colorByTrait[key],
    pointBorderColor: '#020617',
    pointBorderWidth: 1.5,
  }))

  const data = { labels, datasets }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(224, 231, 255, 0.95)',
          font: {
            size: 12,
            family: 'Inter',
            weight: 'normal',
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.95)',
        borderColor: 'rgba(34, 211, 238, 0.4)',
        borderWidth: 1.5,
        titleColor: '#E0E7FF',
        titleFont: {
          size: 13,
          family: 'Space Grotesk',
          weight: 'bold',
        },
        bodyColor: 'rgba(224, 231, 255, 0.9)',
        bodyFont: {
          size: 12,
          family: 'Inter',
          weight: 'normal',
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { 
          color: 'rgba(224, 231, 255, 0.7)',
          maxRotation: 0, 
          autoSkip: true,
          font: {
            size: 11,
            family: 'Inter',
            weight: 'normal',
          },
          padding: 8,
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          lineWidth: 1,
        },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: { 
          color: 'rgba(224, 231, 255, 0.7)',
          font: {
            size: 11,
            family: 'Inter',
            weight: 'normal',
          },
          padding: 8,
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          lineWidth: 1,
        },
      },
    },
  } as const

  return (
    <div className="h-[360px] w-full p-4">
      <Line data={data} options={options} />
    </div>
  )
}

