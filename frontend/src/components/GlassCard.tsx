import { type ReactNode } from 'react'

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md',
        'shadow-[0_0_30px_rgba(139,92,246,0.18)]',
        className,
      ].join(' ')}
    >
      {/* Holographic top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/70 to-[#22D3EE]/0" />
      <div className="relative p-5">{children}</div>
    </div>
  )
}

