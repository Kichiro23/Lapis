import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileEdit, RotateCcw, Check, Copy, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import BackButton from '../components/BackButton'

export default function AutoCorrector() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [changes, setChanges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCorrect = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await api.aiChat(
        [{ sender: 'user', text: `Correct and improve this text. Fix grammar, spelling, punctuation, and improve clarity. Respond in this exact format:\n\nCorrected: [the corrected text]\n\nChanges made:\n- [change 1]\n- [change 2]\n\nText:\n${input}` }],
        'Auto Corrector tool'
      )
      const text = res.response || ''
      const correctedMatch = text.match(/Corrected:\s*([\s\S]+?)(?=\n\nChanges made:|$)/i)
      const changesMatch = text.match(/Changes made:\s*([\s\S]+)/i)
      
      setOutput(correctedMatch ? correctedMatch[1].trim() : text)
      if (changesMatch) {
        const changeLines = changesMatch[1].trim().split('\n').filter((l: string) => l.trim().startsWith('-'))
        setChanges(changeLines.map((l: string) => l.trim().substring(1).trim()))
      } else {
        setChanges([])
      }
    } catch {
      setOutput('Service temporarily unavailable. Please try again.')
      setChanges([])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[100dvh] pt-28 pb-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[900px] mx-auto">
        <BackButton className="mb-4" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileEdit size={20} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">AI TOOL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Auto Corrector</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Fix grammar, spelling, and improve clarity in your writing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-5 h-full flex flex-col">
              <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileEdit size={14} className="text-yellow-600 dark:text-yellow-400" /> Original
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your text here..."
                className="flex-1 min-h-[250px] w-full p-4 rounded-2xl text-sm resize-none outline-none bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-yellow-400 transition-colors"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCorrect}
                  disabled={loading || !input.trim()}
                  className="pill-btn pill-btn-primary text-sm flex-1 disabled:opacity-50"
                >
                  {loading ? 'Correcting...' : <><Check size={14} className="mr-1" /> Correct</>}
                </button>
                <button onClick={() => { setInput(''); setOutput(''); setChanges([]) }} className="pill-btn pill-btn-ghost text-sm">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Check size={14} className="text-yellow-600 dark:text-yellow-400" /> Corrected
                </label>
                {output && (
                  <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-slate-500 hover:text-yellow-600 transition-colors">
                    {copied ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-[250px] w-full p-4 rounded-2xl text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-y-auto">
                {output ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{output}</p>
                ) : (
                  <p className="text-slate-400 italic">Corrected text will appear here...</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Changes List */}
        {changes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mt-4">
            <h3 className="text-sm font-semibold mb-3">Changes Made</h3>
            <ul className="flex flex-col gap-2">
              {changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {change}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}
