import type { Traits } from '../../types'

export type EmotionState = 'calm' | 'logical' | 'stress' | 'positive' | 'energized' | 'reflective' | 'balanced'

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function computeEmotionState(traits: Traits, sentiment: number): {
  state: EmotionState
  intensity: number
  auraColor: string
  label: string
  description: string
  avatarVariant: {
    expression: 'neutral' | 'happy' | 'focused' | 'energetic' | 'calm' | 'intense'
    glowIntensity: number
    pulseSpeed: number
    colorScheme: 'vibrant' | 'cool' | 'warm' | 'balanced'
  }
} {
  const stress = clamp01(traits.neuroticism * 0.75 + Math.max(0, -sentiment) * 0.45)
  const positivity = clamp01(Math.max(0, sentiment))
  const logic = clamp01(traits.conscientiousness * 0.75 + traits.openness * 0.25)
  const calm = clamp01((1 - traits.neuroticism) * 0.7 + (1 - Math.abs(sentiment)) * 0.3)
  const energy = clamp01(traits.extraversion * 0.6 + positivity * 0.4)
  const reflective = clamp01(traits.openness * 0.5 + traits.agreeableness * 0.5)

  // Priority-based emotion detection with avatar variants
  if (stress >= 0.65) {
    return { 
      state: 'stress', 
      intensity: stress, 
      auraColor: '#EF4444', 
      label: 'Stress',
      description: 'Elevated tension detected',
      avatarVariant: {
        expression: 'intense',
        glowIntensity: 0.8,
        pulseSpeed: 1.2,
        colorScheme: 'warm'
      }
    }
  }
  
  if (energy >= 0.62 && positivity >= 0.45) {
    return { 
      state: 'energized', 
      intensity: energy, 
      auraColor: '#10B981', 
      label: 'Energized',
      description: 'High social energy and positivity',
      avatarVariant: {
        expression: 'energetic',
        glowIntensity: 0.9,
        pulseSpeed: 0.8,
        colorScheme: 'vibrant'
      }
    }
  }
  
  if (positivity >= 0.55) {
    return { 
      state: 'positive', 
      intensity: positivity, 
      auraColor: '#22D3EE', 
      label: 'Positive',
      description: 'Optimistic mood detected',
      avatarVariant: {
        expression: 'happy',
        glowIntensity: 0.7,
        pulseSpeed: 1.0,
        colorScheme: 'vibrant'
      }
    }
  }
  
  if (logic >= 0.58) {
    return { 
      state: 'logical', 
      intensity: logic, 
      auraColor: '#3B82F6', 
      label: 'Logical',
      description: 'Analytical mindset active',
      avatarVariant: {
        expression: 'focused',
        glowIntensity: 0.6,
        pulseSpeed: 1.5,
        colorScheme: 'cool'
      }
    }
  }
  
  if (reflective >= 0.55 && calm >= 0.45) {
    return { 
      state: 'reflective', 
      intensity: reflective, 
      auraColor: '#8B5CF6', 
      label: 'Reflective',
      description: 'Thoughtful and introspective',
      avatarVariant: {
        expression: 'calm',
        glowIntensity: 0.5,
        pulseSpeed: 1.8,
        colorScheme: 'balanced'
      }
    }
  }
  
  if (calm >= 0.45) {
    return { 
      state: 'calm', 
      intensity: calm, 
      auraColor: '#8B5CF6', 
      label: 'Calm',
      description: 'Balanced emotional state',
      avatarVariant: {
        expression: 'calm',
        glowIntensity: 0.4,
        pulseSpeed: 2.0,
        colorScheme: 'cool'
      }
    }
  }
  
  // Default balanced state
  return { 
    state: 'balanced', 
    intensity: 0.5, 
    auraColor: '#64748B', 
    label: 'Balanced',
    description: 'Neutral emotional baseline',
    avatarVariant: {
      expression: 'neutral',
      glowIntensity: 0.3,
      pulseSpeed: 2.2,
      colorScheme: 'balanced'
    }
  }
}

export function insightTags(traits: Traits, sentiment: number): string[] {
  const tags: string[] = []
  if (traits.openness >= 0.62) tags.push('High Curiosity')
  if (traits.conscientiousness >= 0.62) tags.push('Focused Logic')
  if (traits.extraversion >= 0.62) tags.push('Social Energy')
  if (traits.agreeableness >= 0.62) tags.push('Empathy Boost')
  if (traits.neuroticism >= 0.62) tags.push('Moderate Stress')
  if (sentiment >= 0.55) tags.push('Upbeat Mood')
  if (sentiment <= -0.4) tags.push('Tension Detected')
  return tags.slice(0, 5)
}

