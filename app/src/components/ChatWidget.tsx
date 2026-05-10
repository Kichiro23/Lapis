import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const quickReplies = [
  'How do I compute my GWA?',
  'Find scholarships for STEM',
  'Best universities in Manila',
  'Pomodoro technique tips',
]

const knowledgeBase: Record<string, string> = {
  'How do I compute my GWA?':
    'To compute your GWA, add up all (Grade x Units) for each subject, then divide by the total number of units. For example, if you got 1.5 in a 3-unit subject and 2.0 in a 3-unit subject: (1.5x3 + 2.0x3) / 6 = 1.75. Try our GWA Calculator tool!',
  'Find scholarships for STEM':
    'Great choice! For STEM students in the Philippines, check out: DOST-SEI Scholarship (₱40k/yr + full tuition), SM Foundation Scholarship (full tuition + allowance), Megaworld Foundation Scholarship (₱50k/yr), and CHED TES (₱60k/yr). Most require a GWA of 2.0 or better. Head to our Scholarship Finder for more!',
  'Best universities in Manila':
    'Top universities in Manila include: UP Diliman (ranked #1 in PH, free tuition), Ateneo de Manila (₱80-100k/sem), De La Salle University (₱70-95k/sem), UST (₱50-70k/sem), and PUP (free, 70k+ students). Check our University Finder for detailed comparisons!',
  'Pomodoro technique tips':
    'The Pomodoro Technique: Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. Tips: Remove distractions, have a specific task ready, use our Focus Timer tool, and stay consistent. Small breaks prevent burnout!',
}

const defaultResponse =
  "I'm Lapis Assistant, your AI study buddy! I can help with GWA calculation, scholarship searches, university info, study tips, and career guidance. What would you like to know?"

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Kamusta! I'm Lapis Assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Smart response logic
    setTimeout(async () => {
      let response = knowledgeBase[text.trim()]
      if (!response) {
        const lower = text.trim().toLowerCase()
        if (lower.includes('scholarship') || lower.includes('financial aid')) {
          response = 'We have 8+ real scholarship programs in our database including DOST-SEI, SM Foundation, CHED TES, Megaworld, Metrobank, Ayala, Aboitiz, and Jollibee Foundation. Visit our Scholarship Finder to filter by type, course, and GWA requirements!'
        } else if (lower.includes('university') || lower.includes('college')) {
          response = 'Our University Finder has real data on 10+ Philippine universities including UP Diliman, Ateneo, DLSU, UST, Mapua, Silliman, and more. You can compare tuition, passing rates, and courses side by side!'
        } else if (lower.includes('gwa') || lower.includes('grade')) {
          response = 'Use our GWA Calculator to track your grades, predict honors standing (Cum Laude, Magna, Summa), and generate a PDF report. It supports UP\'s 1.00-5.00 scale and other grading systems!'
        } else if (lower.includes('career') || lower.includes('job') || lower.includes('internship')) {
          response = 'Our Career Hub has real career data for courses like Computer Science, Engineering, Nursing, Business, and more. Explore salary ranges, internship opportunities, and interview questions!'
        } else if (lower.includes('pdf') || lower.includes('document')) {
          response = 'You can generate PDF and Word documents in our Converters section. Great for creating reports, resumes, and study notes!'
        } else if (lower.includes('timer') || lower.includes('focus') || lower.includes('pomodoro')) {
          response = 'Our Focus Timer supports Pomodoro (25 min), short breaks (5 min), long breaks (15 min), and custom durations. It tracks your daily sessions and focus time!'
        } else {
          response = defaultResponse
        }
      }
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setTyping(false)
    }, 1200)
  }

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #f6e336, #f2db27)',
              boxShadow: '0 4px 20px rgba(246, 227, 54, 0.4)',
            }}
          >
            <Sparkles size={22} color="#333" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden"
            style={{
              width: 380,
              maxWidth: 'calc(100vw - 2.5rem)',
              height: 560,
              maxHeight: 'calc(100dvh - 6rem)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px) saturate(200%)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent-yellow)' }}
              >
                <Bot size={18} color="#333" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Lapis Assistant</p>
                <p className="text-[11px] text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 self-start"
                    style={{
                      background: msg.sender === 'ai' ? 'var(--accent-yellow)' : '#e9e7e0',
                    }}
                  >
                    {msg.sender === 'ai' ? <Bot size={13} color="#333" /> : <User size={13} />}
                  </div>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'rounded-2xl rounded-br-sm'
                        : 'rounded-2xl rounded-bl-sm'
                    }`}
                    style={{
                      background: msg.sender === 'ai' ? '#f5f2eb' : 'var(--accent-yellow)',
                      color: msg.sender === 'ai' ? 'var(--text-primary)' : '#333',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-yellow)' }}
                  >
                    <Bot size={13} color="#333" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{ background: '#f5f2eb' }}
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full border hover:bg-yellow-50 transition-colors"
                    style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2.5 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(input)
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 text-sm px-4 py-2.5 rounded-2xl outline-none"
                  style={{ background: '#f5f2eb' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ background: input.trim() ? 'var(--accent-yellow)' : '#e9e7e0' }}
                >
                  <Send size={14} color="#333" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
