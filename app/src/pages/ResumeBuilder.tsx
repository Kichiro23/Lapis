import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Download, User, GraduationCap, Briefcase, Wrench, Folder } from 'lucide-react'
import { api, downloadBlob } from '../lib/api'

interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  education: { school: string; degree: string; year: string }[]
  experience: { company: string; role: string; duration: string; description: string }[]
  skills: string[]
  projects: { name: string; description: string; link: string }[]
}

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>({
    fullName: '', email: '', phone: '', location: '', summary: '',
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    skills: [''],
    projects: [{ name: '', description: '', link: '' }],
  })
  const [generating, setGenerating] = useState(false)

  const updateField = (field: keyof ResumeData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const updateArrayItem = (field: 'education' | 'experience' | 'projects', idx: number, key: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === idx ? { ...item, [key]: value } : item)
    }))
  }

  const addItem = (field: 'education' | 'experience' | 'projects') => {
    const defaults = {
      education: { school: '', degree: '', year: '' },
      experience: { company: '', role: '', duration: '', description: '' },
      projects: { name: '', description: '', link: '' },
    }
    setData(prev => ({ ...prev, [field]: [...prev[field], defaults[field]] }))
  }

  const removeItem = (field: 'education' | 'experience' | 'projects', idx: number) => {
    setData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))
  }

  const updateSkill = (idx: number, value: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.map((s, i) => i === idx ? value : s) }))
  }

  const addSkill = () => setData(prev => ({ ...prev, skills: [...prev.skills, ''] }))
  const removeSkill = (idx: number) => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))

  const generatePdf = async () => {
    setGenerating(true)
    const content = [
      `# ${data.fullName}`,
      `${data.email} | ${data.phone} | ${data.location}`,
      '',
      '## Summary',
      data.summary,
      '',
      '## Education',
      ...data.education.map(e => `- ${e.degree}, ${e.school} (${e.year})`),
      '',
      '## Experience',
      ...data.experience.map(e => `- **${e.role}** at ${e.company} (${e.duration})\\n  ${e.description}`),
      '',
      '## Skills',
      data.skills.filter(Boolean).join(', '),
      '',
      '## Projects',
      ...data.projects.map(p => `- **${p.name}**: ${p.description}${p.link ? ` [${p.link}]` : ''}`),
    ].join('\n')

    try {
      const res = await api.generatePdf(`${data.fullName} - Resume`, content)
      const blob = await res.blob()
      downloadBlob(blob, `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
    } catch {
      alert('PDF generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="glass-card p-5 sm:p-6 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1000px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">TOOLS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Resume Builder</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Build a clean, ATS-friendly resume and export as PDF.
          </p>
        </motion.div>

        {/* Personal Info */}
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input-pill" placeholder="Full Name" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} />
            <input className="input-pill" placeholder="Email" value={data.email} onChange={e => updateField('email', e.target.value)} />
            <input className="input-pill" placeholder="Phone" value={data.phone} onChange={e => updateField('phone', e.target.value)} />
            <input className="input-pill" placeholder="Location" value={data.location} onChange={e => updateField('location', e.target.value)} />
          </div>
          <textarea className="w-full mt-3 input-pill resize-none h-24" placeholder="Professional Summary" value={data.summary} onChange={e => updateField('summary', e.target.value)} />
        </Section>

        {/* Education */}
        <Section title="Education" icon={GraduationCap}>
          {data.education.map((edu, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input className="input-pill" placeholder="School" value={edu.school} onChange={e => updateArrayItem('education', idx, 'school', e.target.value)} />
              <input className="input-pill" placeholder="Degree" value={edu.degree} onChange={e => updateArrayItem('education', idx, 'degree', e.target.value)} />
              <div className="flex gap-2">
                <input className="input-pill" placeholder="Year" value={edu.year} onChange={e => updateArrayItem('education', idx, 'year', e.target.value)} />
                {data.education.length > 1 && (
                  <button onClick={() => removeItem('education', idx)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={() => addItem('education')} className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <Plus size={12} /> Add Education
          </button>
        </Section>

        {/* Experience */}
        <Section title="Experience" icon={Briefcase}>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                <input className="input-pill" placeholder="Company" value={exp.company} onChange={e => updateArrayItem('experience', idx, 'company', e.target.value)} />
                <input className="input-pill" placeholder="Role" value={exp.role} onChange={e => updateArrayItem('experience', idx, 'role', e.target.value)} />
                <div className="flex gap-2">
                  <input className="input-pill" placeholder="Duration" value={exp.duration} onChange={e => updateArrayItem('experience', idx, 'duration', e.target.value)} />
                  {data.experience.length > 1 && (
                    <button onClick={() => removeItem('experience', idx)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <textarea className="w-full input-pill resize-none h-16" placeholder="Description" value={exp.description} onChange={e => updateArrayItem('experience', idx, 'description', e.target.value)} />
            </div>
          ))}
          <button onClick={() => addItem('experience')} className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <Plus size={12} /> Add Experience
          </button>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={Wrench}>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <input
                  className="input-pill py-1.5 px-3 text-xs w-32 sm:w-40"
                  placeholder="Skill"
                  value={skill}
                  onChange={e => updateSkill(idx, e.target.value)}
                />
                {data.skills.length > 1 && (
                  <button onClick={() => removeSkill(idx)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addSkill} className="mt-2 text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <Plus size={12} /> Add Skill
          </button>
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={Folder}>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-3 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50">
              <div className="flex gap-2 mb-2">
                <input className="input-pill flex-1" placeholder="Project Name" value={proj.name} onChange={e => updateArrayItem('projects', idx, 'name', e.target.value)} />
                <input className="input-pill flex-1" placeholder="Link (optional)" value={proj.link} onChange={e => updateArrayItem('projects', idx, 'link', e.target.value)} />
                {data.projects.length > 1 && (
                  <button onClick={() => removeItem('projects', idx)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <textarea className="w-full input-pill resize-none h-16" placeholder="Description" value={proj.description} onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} />
            </div>
          ))}
          <button onClick={() => addItem('projects')} className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <Plus size={12} /> Add Project
          </button>
        </Section>

        {/* Export */}
        <div className="flex justify-center">
          <button
            onClick={generatePdf}
            disabled={generating || !data.fullName.trim()}
            className="pill-btn pill-btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? 'Generating...' : <><Download size={14} /> Export PDF</>}
          </button>
        </div>
      </div>
    </div>
  )
}
