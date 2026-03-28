import { motion } from 'framer-motion'
import type { Traits } from '../types'

const traitToColor: Record<keyof Traits, string> = {
  openness: '#8B5CF6',
  conscientiousness: '#3B82F6',
  extraversion: '#22D3EE',
  agreeableness: '#60A5FA',
  neuroticism: '#A78BFA',
}

const expressionStyles = {
  neutral: {
    scale: 1,
    rotate: 0,
    filter: 'saturate(1)',
    opacity: 0.8
  },
  happy: {
    scale: 1.05,
    rotate: 2,
    filter: 'saturate(1.2)',
    opacity: 0.9
  },
  focused: {
    scale: 0.95,
    rotate: -1,
    filter: 'saturate(0.9)',
    opacity: 0.85
  },
  energetic: {
    scale: 1.1,
    rotate: 4,
    filter: 'saturate(1.3)',
    opacity: 1
  },
  calm: {
    scale: 0.98,
    rotate: -0.5,
    filter: 'saturate(0.8)',
    opacity: 0.75
  },
  intense: {
    scale: 1.15,
    rotate: 6,
    filter: 'saturate(1.4)',
    opacity: 1
  }
}

export function AvatarOrb({ traits, avatarVariant }: { traits: Traits; avatarVariant?: any }) {
  const entries = Object.entries(traits) as [keyof Traits, number][]
  const top = entries.sort((a, b) => b[1] - a[1])[0]
  const primary = traitToColor[top[0]]
  const avg = entries.reduce((acc, [, v]) => acc + v, 0) / Math.max(1, entries.length)

  // Get expression style from avatar variant or default to neutral
  const expression = avatarVariant?.expression || 'neutral'
  const glowIntensity = avatarVariant?.glowIntensity || 0.35
  const pulseSpeed = avatarVariant?.pulseSpeed || 2.8
  const colorScheme = avatarVariant?.colorScheme || 'balanced'

  const expressionStyle = expressionStyles[expression as keyof typeof expressionStyles]

  // Enhanced glow based on intensity and color scheme
  const enhancedGlow = colorScheme === 'vibrant' 
    ? `0 0 ${60 * glowIntensity}px rgba(34,211,238,${0.4 * glowIntensity}), 0 0 ${120 * glowIntensity}px ${primary}66`
    : colorScheme === 'warm'
    ? `0 0 ${50 * glowIntensity}px rgba(239,68,68,${0.3 * glowIntensity}), 0 0 ${100 * glowIntensity}px ${primary}55`
    : colorScheme === 'cool'
    ? `0 0 ${55 * glowIntensity}px rgba(59,130,246,${0.35 * glowIntensity}), 0 0 ${110 * glowIntensity}px ${primary}44`
    : `0 0 ${45 * glowIntensity}px rgba(139,92,246,${0.35 * glowIntensity}), 0 0 ${120 * glowIntensity}px ${primary}33`

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative h-64 w-64 rounded-full transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${primary}66, rgba(34,211,238,0.08) 55%, rgba(2,6,23,0) 70%)`,
          boxShadow: enhancedGlow,
          filter: expressionStyle.filter,
        }}
        initial={{ scale: 0.9 }}
        animate={{
          scale: expressionStyle.scale,
          rotate: [0, expressionStyle.rotate, 0],
          boxShadow: [
            enhancedGlow,
            `0 0 ${65 * glowIntensity}px rgba(59,130,246,${0.35 * glowIntensity}), 0 0 ${130 * glowIntensity}px ${primary}55`,
            enhancedGlow,
          ],
          opacity: expressionStyle.opacity,
        }}
        transition={{ 
          duration: pulseSpeed, 
          repeat: Infinity, 
          repeatType: 'mirror', 
          ease: 'easeInOut' 
        }}
        whileHover={{ 
          scale: expressionStyle.scale * 1.05,
          filter: `saturate(${parseFloat(expressionStyle.filter) * 1.1})`,
        }}
      >
        {/* Enhanced holographic rings with personality-based animations */}
        <div className="absolute inset-0 rounded-full border border-white/10 transition-all duration-300" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 transition-all duration-300"
          animate={{ 
            rotate: [0, 45, 0], 
            opacity: [0.4, 0.8 * glowIntensity, 0.4],
            scale: [1, 1 + (glowIntensity * 0.1), 1]
          }}
          transition={{ 
            duration: 2.4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 transition-all duration-300"
          animate={{ 
            rotate: [0, -45, 0], 
            opacity: [0.2, 0.55 * glowIntensity, 0.2],
            scale: [1, 1 + (glowIntensity * 0.15), 1]
          }}
          transition={{ 
            duration: 1.9, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />

        {/* Enhanced personality display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="text-xs font-semibold tracking-wide text-white/70 font-sans">Dominant Trait</div>
          <div className="text-sm font-bold tracking-wide text-[#E0E7FF] font-heading">{top[0]}</div>
          <div className="text-[11px] text-white/60 font-sans">Signal {Math.round(avg * 100)}%</div>
        </div>
      </motion.div>
    </div>
  )
}

