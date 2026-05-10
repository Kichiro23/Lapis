import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, CheckCircle, RotateCcw, Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import BackButton from '../components/BackButton'

export default function AiHumanizer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleHumanize = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await api.aiChat(
        [{ sender: 'user', text: `Humanize this text to sound natural and human-written. Remove AI-like patterns, vary sentence structure, and make it flow like someone actually wrote it. Only return the humanized text, no explanations:\n\n${input}` }],
        'AI Humanizer tool'
      )
      setOutput(res.response || 'Could not humanize text.')
    } catch {
      setOutput('Service temporarily unavailable. Please try again.')
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
            <Sparkles size={20} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">AI TOOL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">AI Humanizer</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Paste AI-generated text and make it sound natural and human-written.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-5 h-full flex flex-col">
              <label className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Wand2 size={14} className="text-yellow-600 dark:text-yellow-400" /> Original Text
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your AI-generated text here..."
                className="flex-1 min-h-[300px] w-full p-4 rounded-2xl text-sm resize-none outline-none bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-yellow-400 transition-colors"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleHumanize}
                  disabled={loading || !input.trim()}
                  className="pill-btn pill-btn-primary text-sm flex-1 disabled:opacity-50"
                >
                  {loading ? 'Humanizing...' : 'Humanize'}
                </button>
                <button onClick={() => { setInput(''); setOutput('') }} className="pill-btn pill-btn-ghost text-sm">
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
                  <Sparkles size={14} className="text-yellow-600 dark:text-yellow-400" /> Humanized Result
                </label>
                {output && (
                  <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-slate-500 hover:text-yellow-600 transition-colors">
                    {copied ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-[300px] w-full p-4 rounded-2xl text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-y-auto">
                {output ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{output}</p>
                ) : (
                  <p className="text-slate-400 italic">Humanized text will appear here...</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
