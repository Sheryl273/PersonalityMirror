import { motion } from 'framer-motion'
import type { Traits } from '../../types'

const traitOrder: (keyof Traits)[] = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
]

const traitColor: Record<keyof Traits, string> = {
  openness: '#8B5CF6',
  conscientiousness: '#3B82F6',
  extraversion: '#22D3EE',
  agreeableness: '#60A5FA',
  neuroticism: '#A78BFA',
}

export function TraitRings({ traits, intensity }: { traits: Traits; intensity: number }) {
  const i = Math.max(0.2, Math.min(1, intensity))
  const size = 420
  const center = size / 2
  const rings = traitOrder.map((k, idx) => {
    const v = traits[k]
    const r = 140 + idx * 22
    const sw = 2 + Math.round(v * 6)
    const glow = 0.18 + v * 0.55
    return { k, v, r, sw, glow }
  })

  return (
    <motion.svg
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={{ rotate: [0, 10 + i * 10, 0] }}
      transition={{ duration: 8 - i * 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 18px rgba(34,211,238,0.10))' }}
    >
      {rings.map((ring, idx) => (
        <g key={ring.k}>
          <circle
            cx={center}
            cy={center}
            r={ring.r}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={ring.r}
            fill="none"
            stroke={traitColor[ring.k]}
            strokeWidth={ring.sw}
            strokeLinecap="round"
            strokeDasharray={Math.round(2 * Math.PI * ring.r)}
            strokeDashoffset={Math.round(2 * Math.PI * ring.r * (1 - ring.v))}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.25, ring.glow, 0.25],
            }}
            transition={{ duration: 2.6 + idx * 0.2 - i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              filter: `drop-shadow(0 0 ${Math.round(10 + ring.v * 18)}px ${traitColor[ring.k]}55)`,
            }}
          />
        </g>
      ))}
    </motion.svg>
  )
}

