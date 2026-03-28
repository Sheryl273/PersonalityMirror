import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import { HoloBackground } from './components/HoloBackground'
import { TopNav } from './components/TopNav'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { TimelinePage } from './pages/TimelinePage'
import { AvatarPage } from './pages/AvatarPage'
import { VoicePage } from './pages/VoicePage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/voice" element={<VoicePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <HoloBackground />
          <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-12">
            <TopNav />
            <main className="mt-8">
              <AnimatedRoutes />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AnalysisProvider>
  )
}
