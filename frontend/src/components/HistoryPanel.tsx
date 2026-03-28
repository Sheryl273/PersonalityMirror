import { motion } from 'framer-motion'

export function HistoryPanel({
  items,
  onPick,
}: {
  items: string[]
  onPick: (text: string) => void
}) {
  return (
    <div className="grid gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">INPUT HISTORY</div>
        <div className="mt-2 text-sm text-white/70">Replay previous prompts instantly.</div>
      </div>

      <div className="grid gap-2 max-h-[210px] overflow-auto pr-1">
        {items.length ? (
          items.map((t, idx) => (
            <motion.button
              key={`${idx}-${t.slice(0, 16)}`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onPick(t)}
              className="text-left rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20 transition"
            >
              <div className="text-xs text-white/75 line-clamp-2">{t}</div>
            </motion.button>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">
            No history yet.
          </div>
        )}
      </div>
    </div>
  )
}

