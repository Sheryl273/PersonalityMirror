import { motion } from 'framer-motion'

export function LoadingHolo({ label = 'Analyzing' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.35)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold tracking-wide text-[#E0E7FF]">{label}</span>
        <span className="text-xs text-white/60">Neural probes syncing personality signal</span>
      </div>
    </div>
  )
}

