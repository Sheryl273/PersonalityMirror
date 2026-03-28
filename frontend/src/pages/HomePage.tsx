import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { analyzeText, testConnection } from '../lib/api'
import { useAnalysis } from '../context/AnalysisContext'
import { HeroSection } from '../components/HeroSection'
import { InputCard } from '../components/InputCard'
import { FeatureCards } from '../components/FeatureCards'
import { HomeLiveFeed } from '../components/HomeLiveFeed'
import type { FeedItem } from '../components/AnalysisFeed'

export function HomePage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: 'p1', text: 'Standby… waiting for input signal.' },
    { id: 'p2', text: 'Neural mirror ready. Start analysis to preview steps.' },
  ])
  const [feedActive, setFeedActive] = useState(false)
  const inputAnchorRef = useRef<HTMLDivElement | null>(null)

  const nav = useNavigate()
  const { setLastAnalysis, addToHistory, inputHistory } = useAnalysis()

  useEffect(() => {
    if (!text && inputHistory.length) setText(inputHistory[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputHistory.length])

  async function onAnalyze() {
    setError(null)
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Please enter some text to analyze.')
      return
    }

    // Test connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      setError('Cannot connect to backend API. Please check if the server is running.')
      return
    }

    setLoading(true)
    setFeedActive(true)
    setFeed([
      { id: 'a1', text: 'Analyzing sentiment…' },
      { id: 'a2', text: 'Detecting linguistic markers…' },
    ])
    setTimeout(() => setFeed((p) => p.concat([{ id: 'a3', text: 'Mapping personality traits…' }])), 420)
    setTimeout(() => setFeed((p) => p.concat([{ id: 'a4', text: 'Stabilizing holographic profile…' }])), 840)
    try {
      addToHistory(trimmed)
      const res = await analyzeText(trimmed)
      setLastAnalysis(res)
      nav('/dashboard')
    } catch (e) {
      console.error('HomePage catch error:', e)
      if (e instanceof Error) {
        console.error('Error details:', e.message, e.stack)
        setError(`API Error: ${e.message}`)
      } else {
        console.error('Unknown error:', e)
        setError('Unknown error occurred')
      }
    } finally {
      setLoading(false)
      setTimeout(() => setFeedActive(false), 450)
    }
  }

  const focusMode = useMemo(() => !text.trim() && !loading, [text, loading])

  return (
    <div className="grid gap-8">
      <HeroSection
        onStart={() => {
          inputAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <div ref={inputAnchorRef} className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid gap-6"
        >
          {focusMode ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_0_60px_rgba(34,211,238,0.10)]">
              <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Focus Mode</div>
              <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[#E0E7FF] font-heading">Start your analysis</h2>
              <p className="mt-3 text-base text-white/70 font-sans leading-relaxed">
                Type anything (a thought, goal, or feeling). This panel will light up and guide your scan.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  'I feel anxious but motivated to improve.',
                  'I\'m curious and excited to explore new ideas.',
                  'I want a clear plan, but I also want freedom.',
                  'I\'m calm today and focused on consistency.',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setText(s)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/75 hover:border-white/20 hover:bg-white/8 transition-all duration-200 shadow-[0_0_26px_rgba(139,92,246,0.10)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <InputCard
            value={text}
            onChange={setText}
            onAnalyze={onAnalyze}
            loading={loading}
            error={error}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_0_44px_rgba(59,130,246,0.14)]"
        >
          <HomeLiveFeed items={feed} active={feedActive || loading} />
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Recent Inputs</h3>
            <div className="mt-4 grid gap-3 max-h-[240px] overflow-auto pr-2">
              {inputHistory.length ? (
                inputHistory.slice(0, 8).map((t) => (
                  <button
                    key={t}
                    onClick={() => setText(t)}
                    className="text-left rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="text-sm text-white/75 font-sans line-clamp-2 leading-relaxed">{t}</div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-white/60 font-sans">No history yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <FeatureCards />
      </div>
    </div>
  )
}

