import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AnalyzeResponse, TimelinePoint } from '../types'

type AnalysisContextValue = {
  lastAnalysis: AnalyzeResponse | null
  setLastAnalysis: (v: AnalyzeResponse | null) => void
  timeline: TimelinePoint[]
  setTimeline: (items: TimelinePoint[]) => void
  inputHistory: string[]
  addToHistory: (text: string) => void
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

const STORAGE_KEY = 'ai-personality-mirror:history:v1'

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [lastAnalysis, setLastAnalysis] = useState<AnalyzeResponse | null>(null)
  const [timeline, setTimeline] = useState<TimelinePoint[]>([])
  const [inputHistory, setInputHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
          setInputHistory(parsed.slice(0, 30))
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputHistory.slice(0, 30)))
    } catch {
      // ignore
    }
  }, [inputHistory])

  function addToHistory(text: string) {
    const t = text.trim()
    if (!t) return
    setInputHistory((prev) => {
      const next = [t, ...prev.filter((p) => p !== t)]
      return next.slice(0, 30)
    })
  }

  const value = useMemo(
    () => ({ lastAnalysis, setLastAnalysis, timeline, setTimeline, inputHistory, addToHistory }),
    [lastAnalysis, timeline, inputHistory],
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider')
  return ctx
}

