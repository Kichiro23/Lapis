import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import HomePage from './pages/HomePage'
import GWACalculator from './pages/GWACalculator'
import ScholarshipFinder from './pages/ScholarshipFinder'
import UniversityFinder from './pages/UniversityFinder'
import StudyTools from './pages/StudyTools'
import StudyTimer from './pages/StudyTimer'
import CareerHub from './pages/CareerHub'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import ConverterTools from './pages/ConverterTools'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gwa-calculator" element={<GWACalculator />} />
          <Route path="/scholarships" element={<ScholarshipFinder />} />
          <Route path="/universities" element={<UniversityFinder />} />
          <Route path="/study" element={<StudyTools />} />
          <Route path="/focus" element={<StudyTimer />} />
          <Route path="/career" element={<CareerHub />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/converters" element={<ConverterTools />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      <Navbar />
      <main className="flex-1 relative z-10">
        <AnimatedRoutes />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
