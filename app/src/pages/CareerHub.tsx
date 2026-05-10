import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Search,
  DollarSign,
  Building2,
  FileText,
  MessageSquare,
  Compass,
  ArrowRight,
  MapPin,
  Globe,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const INTERNSHIPS = [
  { id: '1', title: 'Software Engineering Intern', company: 'Google', location: 'Remote / Global', type: 'Paid', remote: true, field: 'Tech' },
  { id: '2', title: 'Data Science Intern', company: 'Microsoft', location: 'Remote / Global', type: 'Paid', remote: true, field: 'Tech' },
  { id: '3', title: 'Marketing Intern', company: 'Unilever', location: 'London, UK', type: 'Paid', remote: false, field: 'Business' },
  { id: '4', title: 'Research Assistant', company: 'NASA', location: 'Remote / US', type: 'Paid', remote: true, field: 'Science' },
  { id: '5', title: 'Graphic Design Intern', company: 'Canva', location: 'Remote / Global', type: 'Paid', remote: true, field: 'Arts' },
  { id: '6', title: 'Finance Analyst Intern', company: 'J.P. Morgan', location: 'New York, US', type: 'Paid', remote: false, field: 'Business' },
  { id: '7', title: 'UX Design Intern', company: 'Figma', location: 'San Francisco, US', type: 'Paid', remote: true, field: 'Arts' },
  { id: '8', title: 'Content Writer', company: 'Medium', location: 'Remote / Global', type: 'Paid', remote: true, field: 'Arts' },
  { id: '9', title: 'AI/ML Intern', company: 'OpenAI', location: 'San Francisco, US', type: 'Paid', remote: false, field: 'Tech' },
  { id: '10', title: 'Teaching Assistant', company: 'Coursera', location: 'Remote / Global', type: 'Paid', remote: true, field: 'Education' },
]

const JOBS = [
  { id: '1', title: 'Junior Web Developer', company: 'RemoteStart', salary: '$30k-$50k', location: 'Remote', level: 'Entry' },
  { id: '2', title: 'Data Analyst', company: 'Accenture', salary: '$40k-$60k', location: 'Global', level: 'Entry' },
  { id: '3', title: 'Customer Success Associate', company: 'Shopify', salary: '$35k-$50k', location: 'Remote', level: 'Entry' },
  { id: '4', title: 'QA Engineer', company: 'Atlassian', salary: '$45k-$65k', location: 'Remote', level: 'Entry' },
  { id: '5', title: 'Technical Writer', company: 'Stripe', salary: '$40k-$55k', location: 'Remote', level: 'Entry' },
]

const COURSE_OPTIONS = ['Computer Science', 'Business Administration', 'Engineering', 'Psychology', 'Nursing', 'Architecture', 'Education', 'Accountancy', 'Data Science', 'Medicine']

const INTERVIEW_QUESTIONS = [
  { category: 'General', question: 'Tell me about yourself.' },
  { category: 'General', question: 'What are your strengths and weaknesses?' },
  { category: 'General', question: 'Where do you see yourself in 5 years?' },
  { category: 'Behavioral', question: 'Describe a time you faced a challenge at school.' },
  { category: 'Behavioral', question: 'How do you handle tight deadlines?' },
  { category: 'Behavioral', question: 'Tell me about a time you worked in a team.' },
  { category: 'Technical', question: 'Explain a project you are proud of.' },
  { category: 'Technical', question: 'How do you stay updated in your field?' },
  { category: 'Technical', question: 'Walk me through how you would approach a new problem.' },
]

const CAREER_TIPS = [
  { icon: FileText, title: 'Tailor Your Resume', desc: 'Customize your resume for every application. Highlight relevant skills and quantify achievements.' },
  { icon: Globe, title: 'Build an Online Presence', desc: 'Create a LinkedIn profile, GitHub portfolio, or personal website to showcase your work.' },
  { icon: MessageSquare, title: 'Practice Interviews', desc: 'Use the STAR method for behavioral questions. Record yourself and review your answers.' },
  { icon: Compass, title: 'Network Strategically', desc: 'Attend virtual events, join Discord communities, and reach out to professionals for informational interviews.' },
]

export default function CareerHub() {
  const [activeTab, setActiveTab] = useState<'internships' | 'jobs' | 'interview' | 'explorer' | 'tips'>('internships')
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0])
  const [fieldFilter, setFieldFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')

  const filteredInternships = INTERNSHIPS.filter((i) => {
    const matchField = fieldFilter === 'All' || i.field === fieldFilter
    const matchLocation = locationFilter === 'All' || i.remote || i.location.includes(locationFilter)
    return matchField && matchLocation
  })

  const [careerData, setCareerData] = useState<{ careers: { title: string; salary: string; growth: string; companies: string[] }[] } | null>(null)
  const [careerLoading, setCareerLoading] = useState(false)

  useEffect(() => {
    setCareerLoading(true)
    fetch(`/api/careers/${encodeURIComponent(selectedCourse)}`)
      .then((r) => r.json())
      .then((data) => {
        setCareerData(data)
        setCareerLoading(false)
      })
      .catch(() => setCareerLoading(false))
  }, [selectedCourse])

  const tabs = [
    { id: 'internships' as const, label: 'Internships', icon: Briefcase },
    { id: 'jobs' as const, label: 'Jobs', icon: Search },
    { id: 'interview' as const, label: 'Interview', icon: MessageSquare },
    { id: 'explorer' as const, label: 'Career Explorer', icon: Compass },
    { id: 'tips' as const, label: 'Career Tips', icon: Globe },
  ]

  const badgeClass = (active: boolean) =>
    active
      ? 'bg-yellow-400 text-slate-900'
      : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1100px] mx-auto">
        {/* Hero + Resume CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>CAREER</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Build Your Future</h1>
              <p className="text-base dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>Internships, jobs, and career guidance for students worldwide</p>
            </div>
            <Link to="/resume" className="pill-btn pill-btn-primary text-sm shrink-0 inline-flex items-center gap-1.5">
              <FileText size={14} />
              Resume Builder
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-1 mb-6 p-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-black/5 dark:border-white/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all ${badgeClass(activeTab === tab.id)}`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Internships Tab */}
        {activeTab === 'internships' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Tech', 'Business', 'Science', 'Arts', 'Education'].map((f) => (
                <button key={f} onClick={() => setFieldFilter(f)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${badgeClass(fieldFilter === f)}`}>{f}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Remote', 'US', 'UK'].map((l) => (
                <button key={l} onClick={() => setLocationFilter(l)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${badgeClass(locationFilter === l)}`}>{l}</button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {filteredInternships.map((i) => (
                <div key={i.id} className="glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                    <Building2 size={18} className="dark:text-yellow-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold">{i.title}</h3>
                    <p className="text-xs dark:text-gray-400 flex items-center gap-1 flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                      <span>{i.company}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><MapPin size={10} />{i.location}</span>
                      {i.remote && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">Remote</span>}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${i.type === 'Paid' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'}`}>{i.type}</span>
                </div>
              ))}
            </div>
            {filteredInternships.length === 0 && (
              <div className="text-center py-12">
                <Search size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No internships match your filters.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {JOBS.map((j) => (
              <div key={j.id} className="glass-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#7cf0bd30' }}>
                  <Briefcase size={18} className="dark:text-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold">{j.title}</h3>
                  <p className="text-xs dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>{j.company} · {j.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold dark:text-white">{j.salary}</p>
                  <p className="text-[10px] dark:text-gray-500" style={{ color: 'var(--text-secondary)' }}>{j.level}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INTERVIEW_QUESTIONS.map((q, i) => (
                <div key={i} className="glass-card p-5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 dark:text-gray-300 mb-2 inline-block">{q.category}</span>
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Career Explorer Tab */}
        {activeTab === 'explorer' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card p-6 mb-5">
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>I study</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-3 appearance-none cursor-pointer"
              >
                {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-xs dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>Possible careers with salary ranges:</p>
            </div>

            {careerLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {careerData && !careerLoading && (
              <div className="flex flex-col gap-3">
                {careerData.careers.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                      <Compass size={18} className="dark:text-yellow-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold">{c.title}</h3>
                      <p className="text-[10px] dark:text-gray-400" style={{ color: 'var(--text-secondary)' }}>Growth: {c.growth}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <DollarSign size={13} style={{ color: '#f5a623' }} />
                      <span className="text-sm font-semibold">{c.salary}</span>
                      <span className="text-[10px] dark:text-gray-500" style={{ color: 'var(--text-secondary)' }}>/mo</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Career Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAREER_TIPS.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#f6e33630' }}>
                    <tip.icon size={18} className="dark:text-yellow-300" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{tip.title}</h3>
                  <p className="text-xs dark:text-gray-400 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
