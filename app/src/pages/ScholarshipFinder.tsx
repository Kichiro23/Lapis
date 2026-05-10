import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Heart,
  X,
  Calendar,
  Check,
  Building2,
  DollarSign,
  Clock,
} from 'lucide-react'

interface Scholarship {
  id: string
  name: string
  type: string
  amount: string
  deadline: string
  description: string
  gwaReq: number
  incomeReq: string
  courses: string[]
  matchScore: number
  requirements: string[]
  benefits: string[]
  process: string[]
  link?: string
}

const FILTER_TYPES = ['All', 'Government', 'Private', 'University', 'International']
const COURSE_FILTERS = ['All', 'STEM', 'Business', 'Engineering', 'Education', 'Arts']

export default function ScholarshipFinder() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [selectedScholar, setSelectedScholar] = useState<Scholarship | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scholarships')
      .then((r) => r.json())
      .then((data) => {
        setScholarships(data.map((s: Scholarship) => ({ ...s, matchScore: Math.floor(Math.random() * 30) + 70 })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedScholar) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedScholar(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedScholar])

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = scholarships.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    const matchType = selectedType === 'All' || s.type === selectedType
    const matchCourse = selectedCourse === 'All' || s.courses.some((c) => c.toLowerCase().includes(selectedCourse.toLowerCase()))
    return matchSearch && matchType && matchCourse
  })

  const badgeClass = (active: boolean) =>
    active
      ? 'bg-yellow-400 text-slate-900'
      : 'bg-[#f5f2eb] dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'

  const courseBadgeClass = (active: boolean) =>
    active
      ? 'bg-emerald-400 text-slate-900'
      : 'bg-[#f5f2eb] dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Search size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>
              OPPORTUNITIES
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Find Your Scholarship</h1>
          <p className="text-base dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>
            Curated opportunities from local and international sources
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="glass-card p-4">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${badgeClass(selectedType === type)}`}
                >
                  {type}
                </button>
              ))}
              <div className="w-[1px] h-6 bg-gray-200 dark:bg-slate-700 mx-1 self-center" />
              {COURSE_FILTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCourse(c)}
                  className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${courseBadgeClass(selectedCourse === c)}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 cursor-pointer group"
                onClick={() => setSelectedScholar(s)}
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    {s.type}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 flex items-center gap-1">
                    <Clock size={9} /> {s.deadline}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {s.amount}
                  </span>
                </div>

                <h3 className="text-base font-bold mb-1.5 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors">{s.name}</h3>
                <p className="text-xs leading-relaxed mb-3 line-clamp-2 dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>
                  {s.description}
                </p>

                {/* Requirement pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-gray-300">
                    GWA ≤ {s.gwaReq}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-gray-300">
                    Income ≤ {s.incomeReq}
                  </span>
                  {s.courses.slice(0, 2).map((c) => (
                    <span key={c} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-gray-300">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                    {s.matchScore}% Match
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaved(s.id) }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Heart size={14} className={savedIds.has(s.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading scholarships...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-semibold text-gray-400 dark:text-gray-500">No scholarships match your filters</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScholar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedScholar(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-[560px] max-h-[80vh] overflow-y-auto rounded-[32px] p-6 md:p-8 bg-white/98 dark:bg-slate-900/98 border border-slate-200 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="scholar-title"
            >
              <button
                onClick={() => setSelectedScholar(null)}
                aria-label="Close scholarship details"
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">{selectedScholar.type}</span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">{selectedScholar.amount}</span>
              </div>

              <h2 id="scholar-title" className="text-xl font-bold mb-2">{selectedScholar.name}</h2>
              <p className="text-sm leading-relaxed mb-5 dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>
                {selectedScholar.description}
              </p>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 dark:text-gray-300">
                  <Check size={12} /> Eligibility
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {selectedScholar.requirements.map((r) => (
                    <li key={r} className="text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-yellow-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 dark:text-gray-300">
                  <DollarSign size={12} /> Benefits
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {selectedScholar.benefits.map((b) => (
                    <li key={b} className="text-xs flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-green-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 dark:text-gray-300">
                  <Building2 size={12} /> Application Process
                </h4>
                <ol className="flex flex-col gap-1.5">
                  {selectedScholar.process.map((p, i) => (
                    <li key={p} className="text-xs flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="flex-1 pill-btn pill-btn-primary text-xs">
                  <Calendar size={13} className="mr-1" /> Add to Calendar
                </button>
                <a
                  href={selectedScholar.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 pill-btn text-xs bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-gray-100 text-center"
                >
                  Apply Now
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
