import { motion } from 'framer-motion'
import type { FeedItem } from './AnalysisFeed'

export function HomeLiveFeed({
  items,
  active,
  title = 'LIVE AI PREVIEW',
}: {
  items: FeedItem[]
  active: boolean
  title?: string
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">{title}</div>
        <motion.div
          className="h-2 w-2 rounded-full"
          animate={{
            opacity: active ? [0.25, 1, 0.25] : 0.25,
            boxShadow: active
              ? ['0 0 0 rgba(34,211,238,0)', '0 0 14px rgba(34,211,238,0.8)', '0 0 0 rgba(34,211,238,0)']
              : '0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: '#22D3EE' }}
        />
      </div>

      <div className="grid gap-2">
        {items.map((it, idx) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.25, delay: idx * 0.06 }}
            className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-[0_0_24px_rgba(59,130,246,0.16)]"
          >
            <div className="text-xs text-white/75">{it.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

