import { motion } from 'framer-motion'

export function TraitBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-[0_0_24px_rgba(139,92,246,0.12)] hover:border-white/20 transition">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#E0E7FF]">{label}</div>
        <div className="text-sm font-bold text-[#E0E7FF]">{pct}%</div>
      </div>
      <div className="mt-3 h-2 rounded-full border border-white/10 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

