import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import PageLoader from './components/PageLoader'
import { usePageTitle } from './hooks/usePageTitle'

/* ─── Lazy-loaded pages ─── */
const HomePage = lazy(() => import('./pages/HomePage'))
const GWACalculator = lazy(() => import('./pages/GWACalculator'))
const ScholarshipFinder = lazy(() => import('./pages/ScholarshipFinder'))
const UniversityFinder = lazy(() => import('./pages/UniversityFinder'))
const StudyTools = lazy(() => import('./pages/StudyTools'))
const StudyTimer = lazy(() => import('./pages/StudyTimer'))
const CareerHub = lazy(() => import('./pages/CareerHub'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ConverterTools = lazy(() => import('./pages/ConverterTools'))
const EssayGrader = lazy(() => import('./pages/EssayGrader'))
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'))
const TaskManager = lazy(() => import('./pages/TaskManager'))
const GradeTracker = lazy(() => import('./pages/GradeTracker'))
const ResourceHub = lazy(() => import('./pages/ResourceHub'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* Phase 2 pages — placeholders will be replaced */
const SubscribePage = lazy(() => import('./pages/SubscribePage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
}

function AnimatedRoutes() {
  const location = useLocation()
  usePageTitle(location.pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/essay-grader" element={<EssayGrader />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/grades" element={<GradeTracker />} />
            <Route path="/resources" element={<ResourceHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
