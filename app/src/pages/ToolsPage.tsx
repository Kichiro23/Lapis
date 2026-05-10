import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Search,
  GraduationCap,
  BookOpen,
  Timer,
  ListTodo,
  TrendingUp,
  Briefcase,
  FileText,
  FolderOpen,
  FileCheck,
  CalendarDays,
  Fingerprint,
  ShieldAlert,
  SpellCheck2,
  ArrowLeftRight,
  ArrowRight,
  Search as SearchIcon,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import { cn } from '../lib/utils'

type Category = 'All' | 'Academic' | 'AI' | 'Productivity' | 'Career'

interface Tool {
  icon: React.ElementType
  title: string
  description: string
  category: Exclude<Category, 'All'>
  link: string
}

const tools: Tool[] = [
  {
    icon: Calculator,
    title: 'GWA Calculator',
    description: 'Track grades, predict honors standing, and export PDF transcripts.',
    category: 'Academic',
    link: '/gwa-calculator',
  },
  {
    icon: Search,
    title: 'Scholarship Finder',
    description: 'Discover scholarships matched to your course, grades, and location.',
    category: 'Academic',
    link: '/scholarships',
  },
  {
    icon: GraduationCap,
    title: 'University Finder',
    description: 'Compare universities worldwide by tuition, courses, and rankings.',
    category: 'Academic',
    link: '/universities',
  },
  {
    icon: BookOpen,
    title: 'Study Tools',
    description: 'Flashcards, AI quizzes, dictionary, and focused study sessions.',
    category: 'Academic',
    link: '/study',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    description: 'Pomodoro timer with session tracking and productivity insights.',
    category: 'Productivity',
    link: '/focus',
  },
  {
    icon: ListTodo,
    title: 'Task Manager',
    description: 'Organize assignments, deadlines, and daily tasks with ease.',
    category: 'Productivity',
    link: '/tasks',
  },
  {
    icon: TrendingUp,
    title: 'Grade Tracker',
    description: 'Monitor your academic progress across subjects and semesters.',
    category: 'Academic',
    link: '/grades',
  },
  {
    icon: Briefcase,
    title: 'Career Hub',
    description: 'Explore career paths, salaries, and in-demand skills.',
    category: 'Career',
    link: '/career',
  },
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Create polished, professional resumes tailored to any job.',
    category: 'Career',
    link: '/resume',
  },
  {
    icon: FolderOpen,
    title: 'Resource Hub',
    description: 'Curated academic resources, guides, and reference materials.',
    category: 'Academic',
    link: '/resources',
  },
  {
    icon: FileCheck,
    title: 'AI Essay Grader',
    description: 'Get instant AI-powered feedback on essays and written work.',
    category: 'AI',
    link: '/essay-grader',
  },
  {
    icon: CalendarDays,
    title: 'AI Study Planner',
    description: 'Generate personalized study schedules powered by AI.',
    category: 'AI',
    link: '/study-planner',
  },
  {
    icon: Fingerprint,
    title: 'AI Humanizer',
    description: 'Refine AI-generated text to sound more natural and human.',
    category: 'AI',
    link: '/humanizer',
  },
  {
    icon: ShieldAlert,
    title: 'AI Detector',
    description: 'Detect AI-generated content with reliable accuracy.',
    category: 'AI',
    link: '/ai-detector',
  },
  {
    icon: SpellCheck2,
    title: 'Auto-Corrector',
    description: 'Fix grammar, spelling, and style errors automatically.',
    category: 'AI',
    link: '/corrector',
  },
  {
    icon: ArrowLeftRight,
    title: 'Converters',
    description: 'Quick unit, currency, and format converters for everyday use.',
    category: 'Productivity',
    link: '/converters',
  },
]

const categories: Category[] = ['All', 'Academic', 'AI', 'Productivity', 'Career']

const categoryColors: Record<Exclude<Category, 'All'>, string> = {
  Academic: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  AI: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  Productivity: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  Career: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
}

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-[100dvh] pt-24 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <BackButton className="mb-4" />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-yellow-600 dark:text-yellow-400">
            Tools Directory
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            All Tools
          </h1>
          <p className="text-sm sm:text-base max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Explore every tool Lapis has to offer — calculators, finders, AI assistants, productivity aids, and career builders.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 space-y-4"
        >
          <div className="relative max-w-md">
            <SearchIcon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="input-pill pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold transition-all border',
                  activeCategory === cat
                    ? 'bg-yellow-400 text-slate-900 border-yellow-400 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-yellow-400/50 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
              <motion.div
                key={tool.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.04,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Link to={tool.link} className="block h-full group">
                  <div className="glass-card p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-yellow-400/15">
                        <tool.icon
                          size={20}
                          className="text-slate-700 dark:text-slate-200"
                        />
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border',
                          categoryColors[tool.category]
                        )}
                      >
                        {tool.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold mb-1.5">{tool.title}</h3>
                    <p
                      className="text-sm leading-relaxed mb-5 flex-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {tool.description}
                    </p>

                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400 group-hover:gap-2 transition-all">
                      Open Tool <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <SearchIcon size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No tools match your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="mt-3 text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
