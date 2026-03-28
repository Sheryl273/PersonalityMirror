import { motion } from 'framer-motion'

type Feature = {
  title: string
  desc: string
  icon: React.ReactNode
}

function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_24px_rgba(34,211,238,0.14)] flex items-center justify-center">
      {children}
    </div>
  )
}

export function FeatureCards() {
  const features: Feature[] = [
    {
      title: 'Real-time personality insights',
      desc: 'Instant traits + mood signals with holographic feedback.',
      icon: (
        <IconFrame>
          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE]" />
        </IconFrame>
      ),
    },
    {
      title: 'Track behavior over time',
      desc: 'Timeline view shows how your personality shifts.',
      icon: (
        <IconFrame>
          <div className="h-4 w-4 rounded-sm bg-[#22D3EE]/80 shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
        </IconFrame>
      ),
    },
    {
      title: 'Visualize traits dynamically',
      desc: 'Radar + energy bars with smooth neon animations.',
      icon: (
        <IconFrame>
          <div className="h-4 w-4 rotate-45 border border-white/30 bg-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.35)]" />
        </IconFrame>
      ),
    },
    {
      title: 'Premium AI interface',
      desc: 'Glass panels, neon accents, live feed, and transitions.',
      icon: (
        <IconFrame>
          <div className="h-4 w-4 rounded-full border border-white/30 bg-white/10 shadow-[0_0_20px_rgba(139,92,246,0.35)]" />
        </IconFrame>
      ),
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {features.map((f, idx) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_0_32px_rgba(139,92,246,0.14)] hover:border-white/20 transition-all duration-300"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-[#8B5CF6]/0 via-[#22D3EE]/45 to-[#3B82F6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {f.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[#E0E7FF] font-heading leading-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-white/65 font-sans leading-relaxed">{f.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

