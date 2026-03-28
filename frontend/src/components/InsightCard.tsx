import { motion } from 'framer-motion'

export function InsightCard({
  title,
  value,
  hint,
}: {
  title: string
  value: string
  hint?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-[0_0_26px_rgba(59,130,246,0.20)] hover:border-white/20"
    >
      <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">{title}</div>
      <div className="mt-2 text-base font-extrabold tracking-tight text-[#E0E7FF]">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/60">{hint}</div> : null}
      <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-[#8B5CF6]/0 via-[#22D3EE]/35 to-[#3B82F6]/0" />
    </motion.div>
  )
}

