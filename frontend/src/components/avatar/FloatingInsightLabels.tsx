import { motion } from 'framer-motion'

export function FloatingInsightLabels({ tags, color }: { tags: string[]; color: string }) {
  const positions = [
    { x: -120, y: -90 },
    { x: 130, y: -70 },
    { x: -150, y: 80 },
    { x: 140, y: 95 },
    { x: 0, y: 150 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0">
      {tags.slice(0, 5).map((t, idx) => {
        const p = positions[idx] || { x: 0, y: 0 }
        return (
          <motion.div
            key={`${idx}-${t}`}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))` }}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
              filter: 'blur(0px)',
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
          >
            <div
              className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#E0E7FF] shadow-[0_0_26px_rgba(34,211,238,0.12)]"
              style={{ boxShadow: `0 0 26px ${color}22` }}
            >
              {t}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

