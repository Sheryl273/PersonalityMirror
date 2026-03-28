import { type ButtonHTMLAttributes } from 'react'

export function NeonButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'group relative inline-flex items-center justify-center',
        'rounded-xl border border-white/10 bg-gradient-to-r from-[#8B5CF6]/20 via-[#3B82F6]/20 to-[#22D3EE]/20',
        'px-5 py-3 text-sm font-semibold tracking-wide text-[#E0E7FF]',
        'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
        'transition-transform duration-200 hover:scale-[1.02] hover:border-white/20',
        'active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100',
        className,
      ].join(' ')}
    />
  )
}

