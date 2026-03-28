import { motion } from 'framer-motion'

export function AuraLayer({
  color,
  intensity,
}: {
  color: string
  intensity: number
}) {
  const i = Math.max(0.15, Math.min(1, intensity))
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: 360,
        height: 360,
        background: `radial-gradient(circle at 50% 50%, ${color}55, rgba(34,211,238,0.10) 45%, rgba(2,6,23,0) 72%)`,
        filter: 'blur(2px)',
      }}
      animate={{
        opacity: [0.45, 0.85, 0.45],
        scale: [0.98, 1.04 + i * 0.05, 0.98],
      }}
      transition={{ duration: 2.2 - i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

