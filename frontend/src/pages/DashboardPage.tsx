import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchTimeline } from '../lib/api'
import { analyzeText } from '../lib/api'
import { useAnalysis } from '../context/AnalysisContext'
import { NeonButton } from '../components/NeonButton'
import { RadarBigFiveChart } from '../components/RadarBigFiveChart'
import { PersonalityTimelineChart } from '../components/PersonalityTimelineChart'
import { HoloCard } from '../components/HoloCard'
import { StatusBar } from '../components/StatusBar'
import { InsightCard } from '../components/InsightCard'
import { TraitBar } from '../components/TraitBar'
import { PredictionPanel } from '../components/PredictionPanel'
import { HistoryPanel } from '../components/HistoryPanel'
import { AnalysisFeed, type FeedItem } from '../components/AnalysisFeed'
import type { Traits } from '../types'

function pickMaxTrait(traits: Traits) {
  const entries = Object.entries(traits) as [keyof Traits, number][]
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function moodFromSentiment(sentiment: number) {
  if (sentiment >= 0.55) return { label: 'Elevated', hint: 'Positive signal spike' }
  if (sentiment >= 0.2) return { label: 'Upbeat', hint: 'Warm/optimistic tone' }
  if (sentiment <= -0.55) return { label: 'Turbulent', hint: 'Negative signal spike' }
  if (sentiment <= -0.2) return { label: 'Tense', hint: 'Stress detected' }
  return { label: 'Neutral', hint: 'Balanced tone' }
}

function estimateConfidence(traits: Traits, sentiment: number) {
  const values = Object.values(traits)
  const variance =
    values.reduce((acc, v) => acc + (v - values.reduce((a, b) => a + b, 0) / values.length) ** 2, 0) /
    Math.max(1, values.length)
  const sentimentStrength = Math.min(1, Math.abs(sentiment))
  return Math.max(0.42, Math.min(0.96, 0.55 + sentimentStrength * 0.25 + Math.sqrt(variance) * 0.2))
}

function buildTrend(last: Traits, prev?: Traits) {
  if (!prev) return { label: 'Stabilizing', hint: 'Need more history' }
  const delta =
    (Object.keys(last) as (keyof Traits)[]).reduce((acc, k) => acc + (last[k] - prev[k]), 0) /
    Object.keys(last).length
  if (delta > 0.015) return { label: 'Rising', hint: 'Traits drifting upward' }
  if (delta < -0.015) return { label: 'Cooling', hint: 'Traits drifting downward' }
  return { label: 'Stable', hint: 'No major drift' }
}

export function DashboardPage() {
  const { lastAnalysis, setLastAnalysis, timeline, setTimeline, inputHistory, addToHistory } = useAnalysis()
  const [loadingTimeline, setLoadingTimeline] = useState(false)
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const feedTimer = useRef<number | null>(null)

  useEffect(() => {
    async function run() {
      setLoadingTimeline(true)
      try {
        const res = await fetchTimeline(30)
        setTimeline(res.items)
      } catch {
        // Keep dashboard functional even if history fails.
      } finally {
        setLoadingTimeline(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Seed input box with latest history item for a “dense” UI feeling.
    if (!text && inputHistory.length) setText(inputHistory[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputHistory.length])

  useEffect(() => {
    return () => {
      if (feedTimer.current) window.clearTimeout(feedTimer.current)
    }
  }, [])

  async function runAnalyze(customText?: string) {
    setError(null)
    const payload = (customText ?? text).trim()
    if (!payload) {
      setError('Enter text to analyze.')
      return
    }
    addToHistory(payload)

    setAnalyzing(true)
    setFeed([
      { id: '1', text: 'Analyzing sentiment…' },
      { id: '2', text: 'Detecting linguistic markers…' },
    ])

    feedTimer.current = window.setTimeout(() => {
      setFeed((prev) => prev.concat([{ id: '3', text: 'Mapping signals to Big Five traits…' }]))
    }, 450)
    feedTimer.current = window.setTimeout(() => {
      setFeed((prev) => prev.concat([{ id: '4', text: 'Stabilizing personality vector…' }]))
    }, 900)

    try {
      const res = await analyzeText(payload)
      setLastAnalysis(res)
      // Refresh timeline to fill charts.
      try {
        const tl = await fetchTimeline(60)
        setTimeline(tl.items)
      } catch {
        // ignore
      }
      setFeed((prev) => prev.concat([{ id: '5', text: 'Complete. Rendering dashboard holograms…' }]))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to analyze')
    } finally {
      setTimeout(() => setAnalyzing(false), 250)
    }
  }

  const prevTraits = timeline.length >= 2 ? timeline[timeline.length - 2].traits : undefined
  const lastUpdatedLabel = useMemo(() => {
    const d = timeline.length ? new Date(timeline[timeline.length - 1].created_at) : new Date()
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }, [timeline])

  const confidence = useMemo(() => {
    if (!lastAnalysis) return 0.62
    return estimateConfidence(lastAnalysis.traits, lastAnalysis.sentiment)
  }, [lastAnalysis])

  const rightInsights = useMemo(() => {
    if (!lastAnalysis) return null
    const top = pickMaxTrait(lastAnalysis.traits)
    const mood = moodFromSentiment(lastAnalysis.sentiment)
    const trend = buildTrend(lastAnalysis.traits, prevTraits)
    return { top, mood, trend }
  }, [lastAnalysis, prevTraits])

  return (
    <div className="grid gap-4">
      <HoloCard hover={false} className="p-0">
        <div className="p-4">
          <StatusBar systemActive confidence={confidence} lastUpdatedLabel={lastUpdatedLabel} />
        </div>
      </HoloCard>

      {/* Focus mode */}
      {!lastAnalysis ? (
        <HoloCard hover={false} className="min-h-[70vh] flex items-center justify-center">
          <div className="max-w-xl text-center">
            <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Focus Mode</div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E0E7FF] font-heading">Start Analysis</h2>
            <p className="mt-3 text-base text-white/70 font-sans leading-relaxed">
              Initialize the mirror to populate the control panel with live traits, insights, and history.
            </p>
            <motion.div
              className="mt-7 inline-flex"
              animate={{ scale: [1, 1.05, 1], filter: ['blur(0px)', 'blur(0px)', 'blur(0px)'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <NeonButton onClick={() => runAnalyze('I want to understand my personality patterns today.')}>
                Start Analysis
              </NeonButton>
            </motion.div>
            <div className="mt-6 grid gap-3 text-left">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Suggested: “I feel anxious but motivated to improve.”
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Suggested: “I’m excited to explore new ideas and meet new people.”
              </div>
            </div>
          </div>
        </HoloCard>
      ) : (
        <>
          {/* Main grid: left / center / right */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr_minmax(0,360px)]">
            {/* Left panel */}
            <div className="grid gap-4">
              <HoloCard>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Input</div>
                    <h3 className="mt-1 text-sm font-semibold text-[#E0E7FF] font-heading">Text scan</h3>
                  </div>
                  <div className="text-xs text-white/60">{analyzing ? 'Scanning…' : 'Ready'}</div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-[#E0E7FF] placeholder:text-white/30 backdrop-blur-md outline-none focus:border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.10)]"
                  placeholder="Type something to analyze…"
                />

                {error ? (
                  <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <NeonButton onClick={() => runAnalyze()} disabled={analyzing}>
                    Analyze
                  </NeonButton>
                  <Link to="/avatar" className="text-xs text-white/60 hover:text-white/80 transition">
                    Avatar sync →
                  </Link>
                </div>
              </HoloCard>

              <HoloCard>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Timeline</div>
                    <h3 className="mt-1 text-sm font-semibold text-[#E0E7FF] font-heading">Personality over time</h3>
                  </div>
                  <div className="text-xs text-white/60">
                    {loadingTimeline ? 'Syncing…' : `${timeline.length} scans`}
                  </div>
                </div>
                <div className="mt-4 h-[320px]">
                  {timeline.length ? (
                    <PersonalityTimelineChart items={timeline.slice(-20)} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-white/60">
                      No history yet.
                    </div>
                  )}
                </div>
              </HoloCard>
            </div>

            {/* Center panel */}
            <HoloCard className="min-h-[420px] lg:min-h-[520px]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Personality Radar</div>
                  <h3 className="mt-1 text-sm font-semibold text-[#E0E7FF] font-heading">Big Five hologram</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/timeline">
                    <NeonButton className="px-4 py-2">Timeline</NeonButton>
                  </Link>
                  <Link to="/voice" className="hidden sm:block">
                    <NeonButton className="px-4 py-2">Voice</NeonButton>
                  </Link>
                </div>
              </div>

              <motion.div
                className="mt-3 h-[320px] sm:h-[380px] lg:h-[430px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <RadarBigFiveChart traits={lastAnalysis.traits} />
              </motion.div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">SENTIMENT</div>
                  <div className="mt-1 text-sm font-bold text-[#E0E7FF]">
                    {lastAnalysis.sentiment >= 0 ? '+' : ''}
                    {lastAnalysis.sentiment.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">TOP TRAIT</div>
                  <div className="mt-1 text-sm font-bold text-[#E0E7FF] capitalize">
                    {pickMaxTrait(lastAnalysis.traits)}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">CONFIDENCE</div>
                  <div className="mt-1 text-sm font-bold text-[#E0E7FF]">{Math.round(confidence * 100)}%</div>
                </div>
              </div>
            </HoloCard>

            {/* Right panel */}
            <div className="grid gap-4">
              <HoloCard>
                <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Insights</div>
                <div className="mt-3 grid gap-3">
                  {rightInsights ? (
                    <>
                      <InsightCard
                        title="TOP TRAIT"
                        value={titleCase(rightInsights.top)}
                        hint="Highest signal in current scan"
                      />
                      <InsightCard title="MOOD" value={rightInsights.mood.label} hint={rightInsights.mood.hint} />
                      <InsightCard title="TREND" value={rightInsights.trend.label} hint={rightInsights.trend.hint} />
                    </>
                  ) : null}
                </div>
              </HoloCard>

              <HoloCard>
                <AnalysisFeed items={feed.length ? feed : [{ id: 'idle', text: 'Standing by. Run a scan to stream live steps.' }]} active={analyzing} />
              </HoloCard>
            </div>
          </div>

          {/* Bottom section */}
          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
            <HoloCard>
              <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Trait Energy</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <TraitBar label="Openness" value={lastAnalysis.traits.openness} />
                <TraitBar label="Conscientiousness" value={lastAnalysis.traits.conscientiousness} />
                <TraitBar label="Extraversion" value={lastAnalysis.traits.extraversion} />
                <TraitBar label="Agreeableness" value={lastAnalysis.traits.agreeableness} />
                <TraitBar label="Neuroticism" value={lastAnalysis.traits.neuroticism} />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-[#E0E7FF]">System load</div>
                  <div className="mt-1 text-xs text-white/60">Neural renderer stable</div>
                  <div className="mt-3 h-2 rounded-full border border-white/10 bg-white/5 overflow-hidden">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6]" />
                  </div>
                </div>
              </div>
            </HoloCard>

            <HoloCard>
              <PredictionPanel last={lastAnalysis.traits} prev={prevTraits} />
            </HoloCard>

            <HoloCard>
              <HistoryPanel
                items={inputHistory}
                onPick={(t) => {
                  setText(t)
                  runAnalyze(t)
                }}
              />
            </HoloCard>
          </div>
        </>
      )}
    </div>
  )
}

