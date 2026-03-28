import { motion } from 'framer-motion'
import { NeonButton } from './NeonButton'
import { LoadingHolo } from './LoadingHolo'

export function InputCard({
  value,
  onChange,
  onAnalyze,
  loading,
  error,
}: {
  value: string
  onChange: (v: string) => void
  onAnalyze: () => void
  loading: boolean
  error: string | null
}) {
  const empty = !value.trim()
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_60px_rgba(139,92,246,0.16)]">
      <div className="pointer-events-none absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/10 via-[#3B82F6]/10 to-[#22D3EE]/10 blur-2xl opacity-70" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium tracking-[0.2em] text-white/50 uppercase">Input Section</h2>
            <p className="mt-2 text-lg font-semibold text-[#E0E7FF] font-heading">Start your analysis</p>
            <p className="mt-1 text-sm text-white/60 font-sans">
              Type your thoughts and we'll project a Big Five personality scan.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_28px_rgba(34,211,238,0.20)] flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] shadow-[0_0_25px_rgba(34,211,238,0.6)]" />
            </div>
          </div>
        </div>

        <motion.div
          animate={empty ? { boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 28px rgba(34,211,238,0.14)', '0 0 0 rgba(0,0,0,0)'] } : {}}
          transition={{ duration: 1.6, repeat: empty ? Infinity : 0, ease: 'easeInOut' }}
          className="mt-6"
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-5 text-base text-[#E0E7FF] placeholder:text-white/30 backdrop-blur-md outline-none focus:border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.10)] font-sans leading-relaxed transition-all duration-200"
            placeholder="Type your thoughts here…"
          />
        </motion.div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200 font-sans">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/60 font-sans">
            <span className="font-medium text-white/80">Tip:</span> "I feel anxious but motivated to improve." or "I'm energized and social today."
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <LoadingHolo label="Analyzing" />
            ) : (
              <NeonButton onClick={onAnalyze} className="px-8 py-3 text-base font-medium">
                Analyze
              </NeonButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

