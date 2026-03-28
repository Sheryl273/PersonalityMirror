import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NeonButton } from '../components/NeonButton'
import { HoloCard } from '../components/HoloCard'
import { useAnalysis } from '../context/AnalysisContext'
import type { Traits } from '../types'
import { AvatarCore } from '../components/avatar/AvatarCore'
import { computeEmotionState } from '../components/avatar/emotion'
import { RadarBigFiveChart } from '../components/RadarBigFiveChart'

export function AvatarPage() {
  const { lastAnalysis } = useAnalysis()

  if (!lastAnalysis) {
    return (
      <HoloCard hover={false} className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold text-[#E0E7FF] font-heading mb-4">No Analysis Available</h1>
          <p className="text-lg text-white/70 font-sans leading-relaxed mb-8">
            Run a personality scan from Home to generate your dynamic avatar representation.
          </p>
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <NeonButton className="px-8 py-4 text-base font-medium">Start Analysis</NeonButton>
            </Link>
          </motion.div>
        </div>
      </HoloCard>
    )
  }

  const traits = lastAnalysis.traits
  const entries = Object.entries(traits) as [keyof Traits, number][]
  const emotion = computeEmotionState(traits, lastAnalysis.sentiment)
  const dominantTrait = entries.sort((a, b) => b[1] - a[1])[0]

  // Generate AI insights based on personality
  const generateInsights = () => {
    const insights = []
    
    if (traits.openness >= 0.7) {
      insights.push({
        title: "Creative Explorer",
        description: "High openness suggests you're imaginative, curious, and open to new experiences"
      })
    }
    if (traits.conscientiousness >= 0.7) {
      insights.push({
        title: "Strategic Thinker", 
        description: "Strong conscientiousness indicates organized, goal-oriented behavior"
      })
    }
    if (traits.extraversion >= 0.7) {
      insights.push({
        title: "Social Connector",
        description: "High extraversion shows you gain energy from social interactions"
      })
    }
    if (traits.agreeableness >= 0.7) {
      insights.push({
        title: "Empathetic Collaborator",
        description: "Strong agreeableness reflects cooperative and compassionate nature"
      })
    }
    if (traits.neuroticism <= 0.3) {
      insights.push({
        title: "Emotionally Stable",
        description: "Low neuroticism indicates resilience and emotional balance"
      })
    }
    
    // Add sentiment-based insight
    if (lastAnalysis.sentiment >= 0.3) {
      insights.push({
        title: "Positive Outlook",
        description: "Your current sentiment reflects optimism and confidence"
      })
    } else if (lastAnalysis.sentiment <= -0.3) {
      insights.push({
        title: "Processing Challenges",
        description: "Current sentiment suggests you're working through difficulties"
      })
    }
    
    return insights.slice(0, 4)
  }

  const insights = generateInsights()

  return (
    <div className="space-y-8">
      {/* Header with Avatar Name */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-[#E0E7FF] font-heading tracking-tight">
          Personality Avatar
        </h1>
        <p className="text-xl text-white/70 font-sans leading-relaxed max-w-3xl mx-auto">
          Your dynamic personality representation, powered by AI analysis
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* Avatar Section */}
        <div className="space-y-6">
          <HoloCard className="overflow-visible">
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-[#E0E7FF] font-heading mb-2">
                  {emotion.label} State
                </h2>
                <p className="text-base text-white/60 font-sans leading-relaxed">
                  {emotion.description}
                </p>
              </div>
              
              {/* Avatar Display */}
              <div className="flex justify-center">
                <AvatarCore traits={traits} sentiment={lastAnalysis.sentiment} />
              </div>
              
              {/* Dominant Trait Highlight */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: emotion.auraColor }} />
                  <div className="text-left">
                    <div className="text-xs font-medium text-white/50 uppercase tracking-[0.1em]">Dominant Trait</div>
                    <div className="text-lg font-bold text-[#E0E7FF] font-heading capitalize">
                      {dominantTrait[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HoloCard>

          {/* Personality Summary Card */}
          <HoloCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#E0E7FF] font-heading mb-6">
                AI-Generated Insights
              </h3>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02, 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <h4 className="text-base font-semibold text-[#E0E7FF] font-heading mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-white/70 font-sans leading-relaxed">
                      {insight.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </HoloCard>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <HoloCard className="min-h-[500px]">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#E0E7FF] font-heading mb-6">
                Personality Radar
              </h3>
              <div className="h-[400px]">
                <RadarBigFiveChart traits={traits} />
              </div>
            </div>
          </HoloCard>

          {/* Trait Breakdown */}
          <HoloCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#E0E7FF] font-heading mb-6">
                Trait Breakdown
              </h3>
              <div className="space-y-4">
                {entries.map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-semibold text-[#E0E7FF] font-heading capitalize">
                        {key}
                      </span>
                      <span className="text-lg font-bold text-[#E0E7FF] font-sans">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(value * 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </HoloCard>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 pt-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/dashboard">
            <NeonButton className="px-8 py-4 text-base font-medium">Dashboard</NeonButton>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/timeline">
            <NeonButton className="px-8 py-4 text-base font-medium">Timeline</NeonButton>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

