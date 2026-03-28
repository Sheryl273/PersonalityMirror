import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

import type { Traits } from '../types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const labels = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

export function RadarBigFiveChart({ traits }: { traits: Traits }) {
  const values = [
    traits.openness,
    traits.conscientiousness,
    traits.extraversion,
    traits.agreeableness,
    traits.neuroticism,
  ]

  const data = {
    labels,
    datasets: [
      {
        label: 'Personality Profile',
        data: values,
        borderColor: 'rgba(139, 92, 246, 0.9)',
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        pointBackgroundColor: 'rgba(59, 130, 246, 0.95)',
        pointBorderColor: '#020617',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        borderWidth: 2.5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(224, 231, 255, 0.95)',
          font: {
            size: 13,
            family: 'Inter',
            weight: 'normal',
          },
          padding: 20,
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
          size: 14,
          family: 'Space Grotesk',
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
          family: 'Inter',
          weight: 'normal',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 1,
        },
        pointLabels: {
          color: 'rgba(224, 231, 255, 0.9)',
          font: {
            size: 12,
            family: 'Space Grotesk',
            weight: 'normal',
          },
          padding: 15,
        },
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: {
          stepSize: 0.2,
          backdropColor: 'transparent',
          color: 'rgba(224, 231, 255, 0.6)',
          font: {
            size: 10,
            family: 'Inter',
            weight: 'normal',
          },
          padding: 5,
        },
      },
    },
  } as const

  return (
    <div className="h-[400px] w-full p-4">
      <Radar data={data} options={options} />
    </div>
  )
}

