import { motion } from 'framer-motion'
import type { TimelineMetricPoint } from './metrics'
import type { Traits } from '../../types'

function formatWhen(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function topTrait(traits: Traits) {
  const entries = Object.entries(traits) as [keyof Traits, number][]
  return entries.sort((a, b) => b[1] - a[1])[0]
}

export function TimelineEntryCard({
  item,
  prev,
  onJump,
}: {
  item: TimelineMetricPoint
  prev?: TimelineMetricPoint
  onJump?: () => void
}) {
  const [k, v] = topTrait(item.traits)
  const dv = prev ? item.traits[k] - prev.traits[k] : 0
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 hover:border-white/20 transition shadow-[0_0_30px_rgba(139,92,246,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">SCAN</div>
          <div className="mt-1 text-sm font-bold text-[#E0E7FF]">{formatWhen(item.created_at)}</div>
        </div>
        {onJump ? (
          <button
            onClick={onJump}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#E0E7FF] hover:border-white/20 hover:bg-white/10 transition"
          >
            Jump
          </button>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/60">Top trait</div>
          <div className="text-xs text-white/60">
            {dv >= 0 ? '↑' : '↓'} {Math.round(Math.abs(dv) * 100)}%
          </div>
        </div>
        <div className="text-sm font-extrabold text-[#E0E7FF] capitalize">
          {String(k)} · {Math.round(v * 100)}%
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/55 font-semibold tracking-[0.18em]">STRESS</div>
            <div className="mt-1 text-sm font-bold text-[#E0E7FF]">{Math.round(item.metrics.stress * 100)}%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/55 font-semibold tracking-[0.18em]">CONFIDENCE</div>
            <div className="mt-1 text-sm font-bold text-[#E0E7FF]">{Math.round(item.metrics.confidence * 100)}%</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

