import { motion } from 'framer-motion'

export type FeedItem = {
  id: string
  text: string
}

export function AnalysisFeed({
  items,
  active,
}: {
  items: FeedItem[]
  active: boolean
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">REAL-TIME FEED</div>
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: idx * 0.04 }}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="text-xs text-white/75">{it.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

