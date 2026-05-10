import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Search,
  MapPin,
  Check,
} from 'lucide-react'

interface University {
  id: string
  name: string
  location: string
  type: string
  tuition: string
  passingRate: number
  population: string
  courses: string[]
  accreditation: string
  region: string
}



const REGIONS = ['All', 'Luzon', 'Visayas', 'Mindanao']
const TYPES = ['All', 'Public', 'Private']

export default function UniversityFinder() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [type, setType] = useState('All')
  const [compareList, setCompareList] = useState<string[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ph-universities')
      .then((r) => r.json())
      .then((data) => {
        setUniversities(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const filtered = universities.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.location.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === 'All' || u.region === region
    const matchType = type === 'All' || u.type === type
    return matchSearch && matchRegion && matchType
  })

  const comparedUnis = universities.filter((u) => compareList.includes(u.id))

  return (
    <div className="min-h-[100dvh] pt-24 pb-16 px-4 md:px-6" style={{ background: '#f5f2eb' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={20} style={{ color: '#f5a623' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f5a623' }}>EXPLORE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Discover Your University</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Find the perfect school with smart comparisons</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="glass-card p-4">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-pill pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegion(r)} className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${region === r ? 'bg-[#f6e336] text-[#333]' : 'bg-[#f5f2eb] text-gray-500 hover:bg-gray-200'}`}>{r}</button>
              ))}
              <div className="w-[1px] h-6 bg-gray-200 mx-1 self-center" />
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${type === t ? 'bg-[#7cf0bd] text-[#333]' : 'bg-[#f5f2eb] text-gray-500 hover:bg-gray-200'}`}>{t}</button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-5 flex items-center gap-3">
            <p className="text-xs font-semibold">Comparing ({compareList.length}/3):</p>
            {comparedUnis.map((u) => (
              <span key={u.id} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#f6e33630] flex items-center gap-1">
                {u.name.substring(0, 20)}...
                <button onClick={() => toggleCompare(u.id)} className="ml-1 text-gray-500 hover:text-red-500">&times;</button>
              </span>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Loading universities...</p>
          </div>
        )}

        {/* University Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading && filtered.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${u.type === 'Public' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>{u.type}</span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100">{u.accreditation}</span>
                  </div>
                  <h3 className="text-base font-bold group-hover:text-yellow-700 transition-colors">{u.name}</h3>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={10} /> {u.location}
                  </p>
                </div>
                <button
                  onClick={() => toggleCompare(u.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${compareList.includes(u.id) ? 'bg-[#f6e336]' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Check size={14} className={compareList.includes(u.id) ? 'text-[#333]' : 'text-gray-400'} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 rounded-2xl" style={{ background: '#f5f2eb' }}>
                  <p className="text-xs font-semibold">{u.tuition}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Tuition</p>
                </div>
                <div className="text-center p-2 rounded-2xl" style={{ background: '#f5f2eb' }}>
                  <p className="text-xs font-semibold">{u.passingRate}%</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Passing Rate</p>
                </div>
                <div className="text-center p-2 rounded-2xl" style={{ background: '#f5f2eb' }}>
                  <p className="text-xs font-semibold">{u.population}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Students</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {u.courses.slice(0, 3).map((c) => (
                  <span key={c} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100">{c}</span>
                ))}
                {u.courses.length > 3 && <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100">+{u.courses.length - 3} more</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compare Table */}
        {comparedUnis.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-6 overflow-x-auto">
            <h3 className="text-base font-bold mb-4">Comparison</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <th className="text-left py-2 pr-4 font-semibold">Feature</th>
                  {comparedUnis.map((u) => <th key={u.id} className="text-left py-2 px-3 font-semibold min-w-[150px]">{u.name.substring(0, 25)}</th>)}
                </tr>
              </thead>
              <tbody>
                {['type', 'tuition', 'passingRate', 'population', 'accreditation', 'location'].map((field) => (
                  <tr key={field} className="border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <td className="py-2 pr-4 font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>{field === 'passingRate' ? 'Passing Rate' : field}</td>
                    {comparedUnis.map((u) => (
                      <td key={u.id} className="py-2 px-3">
                        {field === 'passingRate' ? `${(u as any)[field]}%` : (u as any)[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}
