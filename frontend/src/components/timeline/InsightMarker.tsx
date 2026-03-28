import { motion } from 'framer-motion'
import type { InsightEvent } from './metrics'

const kindColor: Record<InsightEvent['kind'], string> = {
  stress: '#EF4444',
  confidence: '#34D399',
  mood: '#22D3EE',
}

export function InsightMarker({
  event,
  active,
  onClick,
}: {
  event: InsightEvent
  active: boolean
  onClick: () => void
}) {
  const c = kindColor[event.kind]
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={[
        'text-left rounded-2xl border bg-white/5 backdrop-blur-md p-3 transition',
        active ? 'border-white/20' : 'border-white/10 hover:border-white/20',
      ].join(' ')}
      style={{ boxShadow: active ? `0 0 28px ${c}22` : undefined }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-[#E0E7FF]">{event.title}</div>
        <div className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 16px ${c}88` }} />
      </div>
      <div className="mt-1 text-xs text-white/60">{event.detail}</div>
    </motion.button>
  )
}

