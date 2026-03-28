import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function HoloCard({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={[
        'relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md',
        'shadow-[0_0_34px_rgba(139,92,246,0.18)]',
        'hover:border-white/20',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-[#8B5CF6]/0 via-[#3B82F6]/70 to-[#22D3EE]/0" />
      <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/0 via-[#22D3EE]/10 to-[#3B82F6]/0 opacity-60 blur-xl" />
      <div className="relative p-4">{children}</div>
    </motion.div>
  )
}

