import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchTimeline } from '../lib/api'
import { useAnalysis } from '../context/AnalysisContext'
import type { Traits } from '../types'
import { HoloCard } from '../components/HoloCard'
import { ReplayController } from '../components/timeline/ReplayController'
import { TimelineGraph } from '../components/timeline/TimelineGraph'
import { detectEvents, withDerivedMetrics } from '../components/timeline/metrics'
import { InsightMarker } from '../components/timeline/InsightMarker'
import { TimelineEntryCard } from '../components/timeline/TimelineEntryCard'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

type RangeKey = '24h' | 'week' | 'month' | 'all'

export function TimelinePage() {
  const { timeline, setTimeline } = useAnalysis()
  const [loading, setLoading] = useState(false)
  const [playhead, setPlayhead] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [range, setRange] = useState<RangeKey>('all')
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        const res = await fetchTimeline(60)
        setTimeline(res.items)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!timeline.length) return
    setPlayhead(timeline.length)
  }, [timeline.length])

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    if (!playing) return

    const ms = speed === 'slow' ? 900 : speed === 'fast' ? 350 : 600
    intervalRef.current = window.setInterval(() => {
      setPlayhead((p) => {
        const next = p + 1
        if (next >= timeline.length) {
          setPlaying(false)
          return timeline.length
        }
        return next
      })
    }, ms)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [playing, timeline.length, speed])

  const filteredTimeline = useMemo(() => {
    if (!timeline.length) return []
    if (range === 'all') return timeline

    const now = Date.now()
    const ms =
      range === '24h' ? 24 * 60 * 60 * 1000 : range === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
    const cutoff = now - ms
    const subset = timeline.filter((t) => new Date(t.created_at).getTime() >= cutoff)
    return subset.length ? subset : timeline.slice(-Math.min(timeline.length, range === 'month' ? 60 : range === 'week' ? 40 : 24))
  }, [timeline, range])

  useEffect(() => {
    if (!filteredTimeline.length) return
    setPlayhead(filteredTimeline.length)
  }, [filteredTimeline.length])

  const metricItems = useMemo(() => withDerivedMetrics(filteredTimeline), [filteredTimeline])
  const events = useMemo(() => detectEvents(metricItems), [metricItems])

  const visibleItems = useMemo(() => {
    if (!metricItems.length) return []
    return metricItems.slice(0, clamp(playhead, 1, metricItems.length))
  }, [metricItems, playhead])

  const current = visibleItems[visibleItems.length - 1]?.traits
  const currentSentiment = visibleItems[visibleItems.length - 1]?.sentiment

  const currentTraits = current as Traits | undefined
  const currentMetrics = visibleItems[visibleItems.length - 1]?.metrics

  return (
    <div className="grid gap-4">
      <HoloCard hover={false}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-white/60">TIMELINE</div>
            <div className="mt-2 text-lg font-extrabold text-[#E0E7FF]">Personality evolution system</div>
            <div className="mt-1 text-sm text-white/70">
              Replay traits over time, detect events, and inspect AI overlays.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
              {(['24h', 'week', 'month', 'all'] as RangeKey[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setPlaying(false)
                    setRange(r)
                    setActiveEventId(null)
                  }}
                  className={[
                    'rounded-xl border px-3 py-2 text-xs font-semibold transition',
                    range === r
                      ? 'border-white/20 bg-white/10 text-[#E0E7FF] shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10',
                  ].join(' ')}
                >
                  {r === '24h' ? 'Last 24h' : r === 'week' ? 'Last week' : r === 'month' ? 'Last month' : 'All'}
                </button>
              ))}
            </div>
            <ReplayController
              playing={playing}
              onToggle={() => setPlaying((v) => !v)}
              speed={speed}
              setSpeed={setSpeed}
            />
          </div>
        </div>

        <div className="mt-4 h-[360px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-white/70">Loading timeline...</div>
          ) : !filteredTimeline.length ? (
            <div className="h-full flex items-center justify-center text-white/70">No data yet. Run an analysis from Home.</div>
          ) : (
            <TimelineGraph
              items={visibleItems}
              keys={['openness', 'extraversion', 'neuroticism', 'stress', 'confidence']}
            />
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-white/60">
              {filteredTimeline.length ? `Replay ${playhead}/${filteredTimeline.length}` : '—'}
            </div>
            <div className="text-xs text-white/60">
              Current sentiment:{' '}
              {typeof currentSentiment === 'number' ? `${currentSentiment >= 0 ? '+' : ''}${currentSentiment.toFixed(2)}` : '—'}
            </div>
          </div>

          <input
            className="mt-2 w-full accent-[#22D3EE]"
            type="range"
            min={0}
            max={filteredTimeline.length}
            value={filteredTimeline.length ? clamp(playhead, 0, filteredTimeline.length) : 0}
            onChange={(e) => {
              setPlaying(false)
              setPlayhead(Number(e.target.value))
              setActiveEventId(null)
            }}
            disabled={!filteredTimeline.length}
          />
        </div>
      </HoloCard>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <HoloCard>
          <div className="text-xs font-semibold tracking-[0.18em] text-white/60">EVENT MARKERS</div>
          <div className="mt-2 text-sm text-white/70">Click an event to jump + show details.</div>
          <div className="mt-4 grid gap-3">
            {events.length ? (
              events.map((ev) => (
                <InsightMarker
                  key={ev.id}
                  event={ev}
                  active={activeEventId === ev.id}
                  onClick={() => {
                    setPlaying(false)
                    setPlayhead(ev.idx + 1)
                    setActiveEventId(ev.id)
                  }}
                />
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">
                No notable events detected yet (need more history).
              </div>
            )}
          </div>
        </HoloCard>

        <HoloCard>
          <div className="text-xs font-semibold tracking-[0.18em] text-white/60">AI INSIGHT OVERLAY</div>
          <div className="mt-2 text-sm text-white/70">
            {activeEventId
              ? 'Event selected — review the associated shift.'
              : 'Replay to see trait dynamics, then click an event marker.'}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">STRESS</div>
              <div className="mt-1 text-lg font-extrabold text-[#E0E7FF]">
                {currentMetrics ? `${Math.round(currentMetrics.stress * 100)}%` : '—'}
              </div>
              <div className="mt-2 h-2 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#A78BFA]"
                  style={{ width: `${currentMetrics ? Math.round(currentMetrics.stress * 100) : 0}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-white/60">Derived from neuroticism + negative sentiment.</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">CONFIDENCE</div>
              <div className="mt-1 text-lg font-extrabold text-[#E0E7FF]">
                {currentMetrics ? `${Math.round(currentMetrics.confidence * 100)}%` : '—'}
              </div>
              <div className="mt-2 h-2 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#34D399] via-[#22D3EE] to-[#3B82F6]"
                  style={{ width: `${currentMetrics ? Math.round(currentMetrics.confidence * 100) : 0}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-white/60">Derived from conscientiousness + sentiment + stability.</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">OVERLAY NOTES</div>
            <div className="mt-2 grid gap-2">
              {currentSentiment != null ? (
                <>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                    {currentSentiment >= 0.35 ? 'Mood improved here — confidence likely rises.' : currentSentiment <= -0.25 ? 'Mood dipped — stress likely rises.' : 'Mood stable — gradual drift.'}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                    {currentTraits?.conscientiousness != null && currentTraits.conscientiousness >= 0.6
                      ? 'Focus improved here (high conscientiousness).'
                      : 'Focus moderate — watch for consistency changes.'}
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">
                  No playhead selected yet.
                </div>
              )}
            </div>
          </div>
        </HoloCard>
      </div>

      <HoloCard hover={false}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-white/60">TIMELINE CARDS</div>
            <div className="mt-2 text-sm text-white/70">Scans with trait changes and derived metrics.</div>
          </div>
          <div className="text-xs text-white/60">{metricItems.length} entries</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {metricItems.slice(-12).reverse().map((it, idx) => {
            const absoluteIdx = metricItems.indexOf(it)
            const prev = absoluteIdx > 0 ? metricItems[absoluteIdx - 1] : undefined
            return (
              <TimelineEntryCard
                key={`${it.created_at}-${idx}`}
                item={it}
                prev={prev}
                onJump={() => {
                  setPlaying(false)
                  setPlayhead(absoluteIdx + 1)
                  setActiveEventId(null)
                }}
              />
            )
          })}
        </div>
      </HoloCard>
    </div>
  )
}

