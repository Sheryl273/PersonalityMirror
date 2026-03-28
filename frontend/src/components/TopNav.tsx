import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/avatar', label: 'Avatar' },
  { to: '/voice', label: 'Voice' },
]

export function TopNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_28px_rgba(34,211,238,0.25)] flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
        </div>
        <div>
          <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">AI Personality</div>
          <div className="text-lg font-semibold tracking-tight text-[#E0E7FF] font-heading">Mirror</div>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              [
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border border-white/20 bg-white/10 text-[#E0E7FF] shadow-[0_0_25px_rgba(139,92,246,0.18)]'
                  : 'text-white/70 hover:text-white/90 hover:bg-white/5',
              ].join(' ')
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#E0E7FF] hover:bg-white/10 transition-all duration-200 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-[#020617]/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -10, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -10, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-4 right-4 top-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.18)] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Navigation</div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-[#E0E7FF] hover:bg-white/10 transition-all duration-200"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 grid gap-2">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      [
                        'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'border border-white/20 bg-white/10 text-[#E0E7FF] shadow-[0_0_25px_rgba(34,211,238,0.14)]'
                          : 'text-white/80 hover:text-white/90 hover:bg-white/10',
                      ].join(' ')
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

