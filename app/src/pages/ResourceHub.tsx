import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, Search, Code, Beaker, Calculator, Globe, Video, FileText, Palette, Database, BrainCircuit, Library, Newspaper, Trophy } from 'lucide-react'

const categories = ['All', 'Textbooks', 'Coding', 'Law', 'Science', 'Math', 'Languages', 'Videos', 'Arts', 'Data', 'Research']

const resources = [
  { title: 'OpenStax', url: 'https://openstax.org', desc: 'Free peer-reviewed textbooks for college and AP courses.', category: 'Textbooks', icon: BookOpen },
  { title: 'Khan Academy', url: 'https://khanacademy.org', desc: 'Free video lessons and practice exercises across all subjects.', category: 'Videos', icon: Video },
  { title: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: 'Learn to code for free with interactive lessons and projects.', category: 'Coding', icon: Code },
  { title: 'Codecademy', url: 'https://codecademy.com', desc: 'Interactive coding courses in Python, JavaScript, and more.', category: 'Coding', icon: Code },
  { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', desc: 'Free MIT course materials across all disciplines.', category: 'Textbooks', icon: BookOpen },
  { title: 'Coursera (Audit)', url: 'https://coursera.org', desc: 'Audit courses for free from top universities worldwide.', category: 'Videos', icon: Video },
  { title: 'edX', url: 'https://edx.org', desc: 'Free courses from Harvard, MIT, Berkeley, and more.', category: 'Videos', icon: Video },
  { title: 'Desmos', url: 'https://desmos.com/calculator', desc: 'Free online graphing calculator for math visualization.', category: 'Math', icon: Calculator },
  { title: 'Wolfram Alpha', url: 'https://wolframalpha.com', desc: 'Computational intelligence for math, science, and life.', category: 'Math', icon: Calculator },
  { title: 'PubMed Central', url: 'https://ncbi.nlm.nih.gov/pmc', desc: 'Free full-text biomedical and life sciences journal articles.', category: 'Science', icon: Beaker },
  { title: 'Google Scholar', url: 'https://scholar.google.com', desc: 'Search academic papers, theses, books, and conference papers.', category: 'Research', icon: FileText },
  { title: 'Duolingo', url: 'https://duolingo.com', desc: 'Free language learning platform with gamified lessons.', category: 'Languages', icon: Globe },
  { title: 'Project Gutenberg', url: 'https://gutenberg.org', desc: 'Over 70,000 free eBooks including classics and textbooks.', category: 'Textbooks', icon: Library },
  { title: 'Harvard CS50', url: 'https://cs50.harvard.edu', desc: 'Free introductory computer science course from Harvard.', category: 'Coding', icon: Code },
  { title: 'Stanford Online', url: 'https://online.stanford.edu', desc: 'Free and low-cost courses from Stanford University.', category: 'Videos', icon: Video },
  { title: 'Brilliant', url: 'https://brilliant.org', desc: 'Interactive problem-solving in math, science, and CS.', category: 'Math', icon: BrainCircuit },
  { title: 'Arduino', url: 'https://arduino.cc', desc: 'Open-source electronics platform with free learning resources.', category: 'Coding', icon: Database },
  { title: 'Figma (Free)', url: 'https://figma.com', desc: 'Free design tool for UI/UX, prototyping, and collaboration.', category: 'Arts', icon: Palette },
  { title: 'Canva (Free)', url: 'https://canva.com', desc: 'Free graphic design platform for presentations and posters.', category: 'Arts', icon: Palette },
  { title: 'Kaggle', url: 'https://kaggle.com', desc: 'Free datasets, notebooks, and competitions for data science.', category: 'Data', icon: Database },
  { title: 'Wikipedia', url: 'https://wikipedia.org', desc: 'Free encyclopedia with articles on virtually every topic.', category: 'Research', icon: Newspaper },
  { title: 'LibreTexts', url: 'https://libretexts.org', desc: 'Free open-access textbooks across sciences, math, and humanities.', category: 'Textbooks', icon: BookOpen },
  { title: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Free full-stack web development curriculum.', category: 'Coding', icon: Code },
  { title: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com', desc: 'Free digital skills training and career certificates.', category: 'Videos', icon: Trophy },
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

  const badgeClass = (active: boolean) =>
    active
      ? 'bg-yellow-400 text-slate-900'
      : 'bg-[#f5f2eb] dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>RESOURCES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Resource Hub</h1>
          <p className="text-base dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>
            Curated free resources for students — textbooks, coding, science, and more.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-6">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${badgeClass(category === c)}`}
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
              transition={{ delay: i * 0.02 }}
              className="glass-card p-5 group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                  <resource.icon size={18} className="dark:text-yellow-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-sm font-bold group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors truncate">{resource.title}</h3>
                    <ExternalLink size={10} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs mb-2 dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>{resource.desc}</p>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-gray-300">{resource.category}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No resources found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
