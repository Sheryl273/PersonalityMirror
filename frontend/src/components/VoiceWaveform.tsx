import { motion } from 'framer-motion'

export function VoiceWaveform({ samples, confidence }: { samples: number[]; confidence: number }) {
  const max = Math.max(...samples, 0.0001)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold tracking-wide text-[#E0E7FF]">Voice signal</div>
          <div className="text-xs text-white/60">Confidence {Math.round(confidence * 100)}%</div>
        </div>
        <div className="h-2 w-32 rounded-full border border-white/10 bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(confidence * 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-4 h-[110px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 overflow-hidden">
        <div className="flex h-full items-end gap-[2px]">
          {samples.map((v, idx) => {
            const h = Math.max(2, Math.round((v / max) * 100))
            return (
              <motion.div
                key={idx}
                className="w-[3px] rounded-full bg-gradient-to-t from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6]"
                initial={{ height: 2, opacity: 0.5 }}
                animate={{ height: h, opacity: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.001 }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

