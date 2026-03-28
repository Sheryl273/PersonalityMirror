import { motion } from 'framer-motion'

export function ReplayController({
  playing,
  onToggle,
  speed,
  setSpeed,
}: {
  playing: boolean
  onToggle: () => void
  speed: 'slow' | 'normal' | 'fast'
  setSpeed: (s: 'slow' | 'normal' | 'fast') => void
}) {
  const speeds: { id: 'slow' | 'normal' | 'fast'; label: string }[] = [
    { id: 'slow', label: 'Slow' },
    { id: 'normal', label: 'Normal' },
    { id: 'fast', label: 'Fast' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.button
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#E0E7FF] shadow-[0_0_25px_rgba(59,130,246,0.20)] hover:border-white/20 hover:bg-white/10 transition"
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
      >
        {playing ? 'Pause' : 'Play'}
      </motion.button>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
        {speeds.map((s) => (
          <button
            key={s.id}
            onClick={() => setSpeed(s.id)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
              speed === s.id
                ? 'bg-white/10 text-[#E0E7FF] shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                : 'text-white/70 hover:text-white/90',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

