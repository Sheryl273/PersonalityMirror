import { motion } from 'framer-motion'

export function StatusBar({
  systemActive = true,
  confidence,
  lastUpdatedLabel,
}: {
  systemActive?: boolean
  confidence: number
  lastUpdatedLabel: string
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="flex items-center gap-3">
        <motion.div
          className="h-3 w-3 rounded-full"
          animate={{
            boxShadow: systemActive
              ? ['0 0 10px rgba(34,211,238,0.4)', '0 0 18px rgba(34,211,238,0.85)', '0 0 10px rgba(34,211,238,0.4)']
              : ['0 0 0 rgba(0,0,0,0)'],
            backgroundColor: systemActive ? ['#22D3EE', '#3B82F6', '#22D3EE'] : ['#64748B'],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">SYSTEM</div>
          <div className="text-sm font-bold text-[#E0E7FF]">{systemActive ? 'Active' : 'Idle'}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-center">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">ANALYSIS CONFIDENCE</div>
          <div className="text-sm font-bold text-[#E0E7FF]">{Math.round(confidence * 100)}%</div>
        </div>
        <div className="hidden md:block h-2 w-44 rounded-full border border-white/10 bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(confidence * 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end">
        <div className="text-right">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">LAST UPDATED</div>
          <div className="text-sm font-bold text-[#E0E7FF]">{lastUpdatedLabel}</div>
        </div>
      </div>
    </div>
  )
}

