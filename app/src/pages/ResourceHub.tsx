import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Search, Code, Scale, Beaker, Calculator, Globe, Video, FileText } from 'lucide-react'

const categories = ['All', 'Textbooks', 'Coding', 'Law', 'Science', 'Math', 'Languages', 'Videos']

const resources = [
  { title: 'OpenStax', url: 'https://openstax.org', desc: 'Free peer-reviewed textbooks for college and AP courses.', category: 'Textbooks', icon: BookOpen },
  { title: 'Khan Academy', url: 'https://khanacademy.org', desc: 'Free video lessons and practice exercises across all subjects.', category: 'Videos', icon: Video },
  { title: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: 'Learn to code for free with interactive lessons and projects.', category: 'Coding', icon: Code },
  { title: 'Codecademy', url: 'https://codecademy.com', desc: 'Interactive coding courses in Python, JavaScript, and more.', category: 'Coding', icon: Code },
  { title: 'Chan Robles Virtual Law Library', url: 'https://chanrobles.com', desc: 'Free access to Philippine laws, statutes, and legal resources.', category: 'Law', icon: Scale },
  { title: 'Official Gazette of the Philippines', url: 'https://officialgazette.gov.ph', desc: 'Official government portal for laws, issuances, and public documents.', category: 'Law', icon: Scale },
  { title: 'PH Laws', url: 'https://lawphil.net', desc: 'Comprehensive database of Philippine laws and jurisprudence.', category: 'Law', icon: Scale },
  { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', desc: 'Free MIT course materials across all disciplines.', category: 'Textbooks', icon: BookOpen },
  { title: 'Coursera (Audit)', url: 'https://coursera.org', desc: 'Audit courses for free from top universities worldwide.', category: 'Videos', icon: Video },
  { title: 'edX', url: 'https://edx.org', desc: 'Free courses from Harvard, MIT, Berkeley, and more.', category: 'Videos', icon: Video },
  { title: 'Desmos', url: 'https://desmos.com/calculator', desc: 'Free online graphing calculator for math visualization.', category: 'Math', icon: Calculator },
  { title: 'Wolfram Alpha', url: 'https://wolframalpha.com', desc: 'Computational intelligence for math, science, and life.', category: 'Math', icon: Calculator },
  { title: 'PubMed Central', url: 'https://ncbi.nlm.nih.gov/pmc', desc: 'Free full-text biomedical and life sciences journal articles.', category: 'Science', icon: Beaker },
  { title: 'Google Scholar', url: 'https://scholar.google.com', desc: 'Search academic papers, theses, books, and conference papers.', category: 'Science', icon: FileText },
  { title: 'Duolingo', url: 'https://duolingo.com', desc: 'Free language learning platform with gamified lessons.', category: 'Languages', icon: Globe },
  { title: 'Project Gutenberg', url: 'https://gutenberg.org', desc: 'Over 70,000 free eBooks including classics and textbooks.', category: 'Textbooks', icon: BookOpen },
]

export default function ResourceHub() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        r.desc.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || r.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>RESOURCES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Resource Hub</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Curated free resources for Filipino students — textbooks, coding, law, science, and more.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-6">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-pill pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${
                  category === c ? 'bg-[#f6e336] text-[#333]' : 'bg-[#f5f2eb] text-gray-500 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource, i) => (
            <motion.a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-5 group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                  <resource.icon size={18} style={{ color: '#333' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-sm font-bold group-hover:text-yellow-700 transition-colors truncate">{resource.title}</h3>
                    <ExternalLink size={10} className="flex-shrink-0 text-gray-400" />
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{resource.desc}</p>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100">{resource.category}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">No resources found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
