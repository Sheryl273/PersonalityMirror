import type { TimelinePoint, Traits } from '../../types'

export type TimelineMetricKey =
  | keyof Traits
  | 'stress'
  | 'confidence'

export type TimelineMetricPoint = TimelinePoint & {
  metrics: {
    stress: number
    confidence: number
  }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function withDerivedMetrics(items: TimelinePoint[]): TimelineMetricPoint[] {
  return items.map((it) => {
    const t = it.traits
    const stress = clamp01(t.neuroticism * 0.7 + Math.max(0, -it.sentiment) * 0.35)
    const confidence = clamp01(
      t.conscientiousness * 0.34 + t.extraversion * 0.26 + Math.max(0, it.sentiment) * 0.35 + (1 - t.neuroticism) * 0.15,
    )
    return { ...it, metrics: { stress, confidence } }
  })
}

export type InsightEvent = {
  id: string
  idx: number
  title: string
  detail: string
  kind: 'stress' | 'confidence' | 'mood'
}

export function detectEvents(items: TimelineMetricPoint[]): InsightEvent[] {
  const events: InsightEvent[] = []
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1]
    const cur = items[i]

    const ds = cur.metrics.stress - prev.metrics.stress
    const dc = cur.metrics.confidence - prev.metrics.confidence
    const dm = cur.sentiment - prev.sentiment

    if (ds >= 0.18) {
      events.push({
        id: `stress-${i}`,
        idx: i,
        kind: 'stress',
        title: 'Stress spike detected',
        detail: `Stress rose by ${Math.round(ds * 100)}%`,
      })
    }
    if (dc >= 0.18) {
      events.push({
        id: `conf-${i}`,
        idx: i,
        kind: 'confidence',
        title: 'Confidence increased',
        detail: `Confidence rose by ${Math.round(dc * 100)}%`,
      })
    }
    if (dm <= -0.7) {
      events.push({
        id: `mooddrop-${i}`,
        idx: i,
        kind: 'mood',
        title: 'Mood dropped here',
        detail: `Sentiment shifted ${dm.toFixed(2)}`,
      })
    }
  }
  return events.slice(-10)
}

