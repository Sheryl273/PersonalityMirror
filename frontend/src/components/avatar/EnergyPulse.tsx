import { motion } from 'framer-motion'

export function EnergyPulse({
  color,
  intensity,
}: {
  color: string
  intensity: number
}) {
  const i = Math.max(0.2, Math.min(1, intensity))
  const dur = 2.8 - i * 1.4
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((k) => (
        <motion.div
          key={k}
          className="absolute rounded-full border"
          style={{
            width: 220,
            height: 220,
            borderColor: `${color}55`,
            boxShadow: `0 0 35px ${color}22`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.45, 0], scale: [0.8, 1.6 + i * 0.25, 2.0 + i * 0.35] }}
          transition={{ duration: dur, repeat: Infinity, delay: k * (dur / 3), ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

