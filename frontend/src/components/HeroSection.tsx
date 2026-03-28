import { motion } from 'framer-motion'
import { NeonButton } from './NeonButton'

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_60px_rgba(34,211,238,0.14)]">
      <div className="pointer-events-none absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/10 via-[#3B82F6]/10 to-[#22D3EE]/10 blur-2xl" />

      <div className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="text-xs font-medium tracking-[0.3em] text-white/50 uppercase">
              Futuristic Personality Intelligence
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight font-heading">
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                AI Personality Mirror
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/70 font-sans leading-relaxed max-w-2xl mx-auto">
              Discover your personality through intelligent analysis.
              <span className="hidden md:inline"> Live traits, insights, and timelines—rendered like a real AI product.</span>
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
            >
              <NeonButton onClick={onStart} className="px-8 py-4 text-base font-medium">
                Start Analysis
              </NeonButton>
            </motion.div>

            <div className="hidden sm:block text-sm text-white/60 text-left max-w-xs">
              <div className="font-medium text-white/80">Powered by sentiment + Big Five mapping</div>
              <div className="mt-1 text-white/50">Tip: try "I feel anxious but motivated…"</div>
            </div>
          </motion.div>
        </div>

        {/* Decorative "holo lines" */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020617]/50 to-transparent" />
      </div>
    </div>
  )
}
