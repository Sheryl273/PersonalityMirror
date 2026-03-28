import { motion } from 'framer-motion'
import type { Traits } from '../../types'
import { AvatarOrb } from '../AvatarOrb'
import { AuraLayer } from './AuraLayer'
import { EnergyPulse } from './EnergyPulse'
import { TraitRings } from './TraitRings'
import { FloatingInsightLabels } from './FloatingInsightLabels'
import { computeEmotionState, insightTags } from './emotion'

export function AvatarCore({ traits, sentiment }: { traits: Traits; sentiment: number }) {
  const emotion = computeEmotionState(traits, sentiment)
  const tags = insightTags(traits, sentiment)

  const breathe = 1 + emotion.intensity * 0.025
  const pulseDur = 2.8 - emotion.intensity * 1.2

  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="relative h-[520px] w-[520px] max-w-full">
        <AuraLayer color={emotion.auraColor} intensity={emotion.intensity} />
        <EnergyPulse color={emotion.auraColor} intensity={emotion.intensity} />
        <TraitRings traits={traits} intensity={emotion.intensity} />
        <FloatingInsightLabels tags={tags} color={emotion.auraColor} />

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, breathe, 1],
            filter: ['saturate(1.05)', 'saturate(1.25)', 'saturate(1.05)'],
          }}
          transition={{ duration: pulseDur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AvatarOrb traits={traits} avatarVariant={emotion.avatarVariant} />
        </motion.div>

        <div className="absolute left-1/2 top-5 -translate-x-1/2 text-center">
          <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Emotion Aura</div>
          <h3 className="mt-2 text-xl font-semibold text-[#E0E7FF] font-heading">
            {emotion.label}
          </h3>
          <p className="mt-1 text-sm text-white/60 font-sans leading-relaxed">
            {emotion.description}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="text-xs text-white/50 font-sans">Intensity</div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]"
                  style={{ width: `${Math.round(emotion.intensity * 100)}%` }}
                />
              </div>
              <div className="text-xs font-medium text-[#E0E7FF] font-sans">
                {Math.round(emotion.intensity * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

