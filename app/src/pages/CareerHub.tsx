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
} from 'lucide-react'

const INTERNSHIPS = [
  { id: '1', title: 'Software Engineering Intern', company: 'Google Philippines', location: 'Makati', type: 'Paid', remote: true, field: 'Tech' },
  { id: '2', title: 'Marketing Intern', company: 'Unilever Philippines', location: 'Taguig', type: 'Paid', remote: false, field: 'Business' },
  { id: '3', title: 'Research Assistant', company: 'DOST-ASTI', location: 'Quezon City', type: 'Paid', remote: false, field: 'Science' },
  { id: '4', title: 'Graphic Design Intern', company: 'Canva Manila', location: 'Makati', type: 'Paid', remote: true, field: 'Arts' },
  { id: '5', title: 'Finance Analyst Intern', company: 'J.P. Morgan', location: 'Makati', type: 'Paid', remote: false, field: 'Business' },
  { id: '6', title: 'Content Writer', company: 'Rappler', location: 'Pasig', type: 'Unpaid', remote: true, field: 'Arts' },
]

const JOBS = [
  { id: '1', title: 'Junior Web Developer', company: 'StartUp PH', salary: '₱25k-35k', location: 'Remote', level: 'Entry' },
  { id: '2', title: 'Data Analyst', company: 'Accenture', salary: '₱30k-45k', location: 'Manila', level: 'Entry' },
  { id: '3', title: 'Customer Success Associate', company: 'Shopify', salary: '₱28k-38k', location: 'Remote', level: 'Entry' },
]

const COURSE_OPTIONS = ['Computer Science', 'Business Administration', 'Engineering', 'Psychology', 'Nursing', 'Architecture', 'Education', 'Accountancy']

const INTERVIEW_QUESTIONS = [
  { category: 'General', question: 'Tell me about yourself.' },
  { category: 'General', question: 'What are your strengths and weaknesses?' },
  { category: 'Behavioral', question: 'Describe a time you faced a challenge at school.' },
  { category: 'Behavioral', question: 'How do you handle tight deadlines?' },
  { category: 'Technical', question: 'Explain a project you are proud of.' },
  { category: 'Technical', question: 'How do you stay updated in your field?' },
]

export default function CareerHub() {
  const [activeTab, setActiveTab] = useState<'internships' | 'jobs' | 'resume' | 'interview' | 'explorer'>('internships')
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0])
  const [fieldFilter, setFieldFilter] = useState('All')
  const [locationFilter] = useState('All')

  const filteredInternships = INTERNSHIPS.filter((i) => {
    const matchField = fieldFilter === 'All' || i.field === fieldFilter
    const matchLocation = locationFilter === 'All' || i.remote || i.location === locationFilter
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
    { id: 'resume' as const, label: 'Resume', icon: FileText },
    { id: 'interview' as const, label: 'Interview', icon: MessageSquare },
    { id: 'explorer' as const, label: 'Career Explorer', icon: Compass },
  ]

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6" style={{ background: '#f5f2eb' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>CAREER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Build Your Future</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Internships, jobs, and career guidance</p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-1 mb-6 p-1 rounded-full bg-white/60 backdrop-blur-sm border border-black/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-[#f6e336] text-[#333]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
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
              {['All', 'Tech', 'Business', 'Science', 'Arts'].map((f) => (
                <button key={f} onClick={() => setFieldFilter(f)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${fieldFilter === f ? 'bg-[#f6e336] text-[#333]' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>{f}</button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {filteredInternships.map((i) => (
                <div key={i.id} className="glass-card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#f6e33630' }}>
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold">{i.title}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{i.company} · {i.location} {i.remote && '· Remote'}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${i.type === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{i.type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {JOBS.map((j) => (
              <div key={j.id} className="glass-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#7cf0bd30' }}>
                  <Briefcase size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold">{j.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{j.company} · {j.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold">{j.salary}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{j.level}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[600px]">
            <div className="glass-card p-8 text-center">
              <FileText size={40} className="mx-auto mb-4" style={{ color: '#f5a623' }} />
              <h3 className="text-lg font-bold mb-2">Resume Builder</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                Create a professional resume tailored for Filipino employers. Choose a template, fill in your details, and export as PDF.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Modern', 'Classic', 'Creative'].map((template) => (
                  <button key={template} className="glass-card p-4 hover:scale-[1.02] transition-transform text-center">
                    <div className="w-full h-24 rounded-2xl mb-2" style={{ background: template === 'Modern' ? '#f6e33620' : template === 'Classic' ? '#7cf0bd20' : '#d2f75420' }} />
                    <p className="text-xs font-semibold">{template}</p>
                  </button>
                ))}
              </div>
              <button className="pill-btn pill-btn-primary mt-5">Start Building</button>
            </div>
          </motion.div>
        )}

        {/* Interview Tab */}
        {activeTab === 'interview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INTERVIEW_QUESTIONS.map((q, i) => (
                <div key={i} className="glass-card p-5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 mb-2 inline-block">{q.category}</span>
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
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>I study</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-pill appearance-none cursor-pointer mb-3"
              >
                {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Possible careers with salary ranges:</p>
            </div>

            {careerData && (
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
                      <Compass size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold">{c.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <DollarSign size={13} style={{ color: '#f5a623' }} />
                      <span className="text-sm font-semibold">{c.salary}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>/mo</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
