import { useEffect, useRef, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { NeonButton } from '../components/NeonButton'
import { VoiceWaveform } from '../components/VoiceWaveform'

export function VoicePage() {
  const [recording, setRecording] = useState(false)
  const [samples, setSamples] = useState<number[]>(Array.from({ length: 48 }, () => 0))
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup if user navigates away mid-recording.
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    }
  }, [])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser
      source.connect(analyser)

      const buf = new Uint8Array(analyser.fftSize)
      const tick = () => {
        const a = analyserRef.current
        if (!a) return
        a.getByteTimeDomainData(buf)

        // RMS energy proxy.
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / buf.length) // ~0..1
        const normalized = Math.max(0, Math.min(1, rms * 2.6))

        setSamples((prev) => {
          const next = prev.concat([normalized]).slice(-64)
          return next
        })
        setConfidence((prev) => {
          const target = normalized
          return prev * 0.82 + target * 0.18
        })

        rafRef.current = requestAnimationFrame(tick)
      }

      setRecording(true)
      tick()
    } catch (e) {
      setError('Microphone access blocked. Please allow mic permission and retry.')
    }
  }

  function stopRecording() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setRecording(false)

    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <GlassCard className="md:col-span-2">
        <div className="text-xs font-semibold tracking-[0.18em] text-white/60">VOICE ANALYSIS (OPTIONAL)</div>
        <div className="mt-2 text-lg font-bold text-[#E0E7FF]">Live waveform + confidence meter</div>
        <div className="mt-2 text-sm text-white/70">
          This demo shows real-time audio signals. You can extend it to send audio/transcripts to the backend for full voice personality analysis.
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {!recording ? (
              <NeonButton onClick={startRecording}>Record voice</NeonButton>
            ) : (
              <NeonButton onClick={stopRecording} className="border-white/20">
                Stop
              </NeonButton>
            )}
            {error ? <div className="text-sm text-red-200">{error}</div> : null}
          </div>
          <div className="text-xs text-white/60">Tip: speak clearly for 3–5 seconds.</div>
        </div>

        <div className="mt-4">
          <VoiceWaveform samples={samples} confidence={confidence} />
        </div>
      </GlassCard>
    </div>
  )
}

