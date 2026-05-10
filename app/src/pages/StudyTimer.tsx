import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Clock, Flame, Target } from 'lucide-react'
import BackButton from '../components/BackButton'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25 },
  { id: 'short', label: 'Short Break', minutes: 5 },
  { id: 'long', label: 'Long Break', minutes: 15 },
  { id: 'custom', label: 'Custom', minutes: 0 },
]

export default function StudyTimer() {
  const [activeMode, setActiveMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsToday, setSessionsToday] = useState(0)
  const [totalFocusMins, setTotalFocusMins] = useState(0)
  const [customMins, setCustomMins] = useState(30)
  const [taskName, setTaskName] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentMode = MODES.find((m) => m.id === activeMode)!
  const totalTime = activeMode === 'custom' ? customMins * 60 : currentMode.minutes * 60
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setSessionsToday((s) => s + 1)
          setTotalFocusMins((m) => m + Math.floor(totalTime / 60))
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setIsRunning(true)
  }, [totalTime])

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(activeMode === 'custom' ? customMins * 60 : currentMode.minutes * 60)
  }, [activeMode, customMins, currentMode.minutes])

  const skipTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(0)
    setSessionsToday((s) => s + 1)
  }, [])

  useEffect(() => {
    resetTimer()
  }, [activeMode, customMins])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="min-h-[100dvh] bg-slate-900 text-white">
      <div className="pt-24 pb-16 px-4 md:px-6 flex flex-col items-center justify-center min-h-[100dvh]">
        <div className="w-full max-w-[480px]">
          <BackButton className="mb-4 text-gray-400 hover:text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px]"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={18} style={{ color: '#f6e336' }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#f6e336' }}>FOCUS</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Focus Mode</h1>
            <p className="text-sm text-gray-400 mt-1">Train your brain to concentrate deeply</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex justify-center gap-1 mb-8 p-1 rounded-full bg-white/5">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all ${
                  activeMode === mode.id
                    ? 'bg-[#f6e336] text-[#333]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Timer Card */}
          <div className="rounded-[40px] p-8 mb-6 bg-slate-800 border border-slate-700">
            {activeMode === 'custom' && (
              <div className="text-center mb-4">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mr-2">Minutes</label>
                <input
                  type="number"
                  value={customMins}
                  onChange={(e) => setCustomMins(Math.max(1, Math.min(120, Number(e.target.value))))}
                  className="w-20 text-center text-sm rounded-full px-3 py-2 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}

            {/* Circular Timer */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  {/* Background ring */}
                  <circle cx="140" cy="140" r={radius} fill="none" stroke="#e9e7e0" strokeWidth="8" />
                  {/* Progress ring */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="none"
                    stroke="#f6e336"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 140 140)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold font-mono text-white">
                    {formatTime(timeLeft)}
                  </span>
                  <p className="text-xs mt-1 text-gray-400">
                    {activeMode === 'pomodoro' ? 'Focus session' : 'Take a break'}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <button onClick={startTimer} className="pill-btn text-sm flex items-center gap-1" style={{ background: '#f6e336', color: '#333' }}>
                  <Play size={14} fill="#333" /> Start
                </button>
              ) : (
                <button onClick={pauseTimer} className="pill-btn text-sm flex items-center gap-1" style={{ background: '#f6e336', color: '#333' }}>
                  <Pause size={14} /> Pause
                </button>
              )}
              <button onClick={resetTimer} className="pill-btn text-sm text-gray-500 hover:bg-gray-100 flex items-center gap-1">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={skipTimer} className="pill-btn text-sm text-gray-500 hover:bg-gray-100 flex items-center gap-1">
                <SkipForward size={14} /> Skip
              </button>
            </div>
          </div>

          {/* Task Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="What are you working on?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Flame size={16} className="mx-auto mb-1 text-orange-400" />
              <p className="text-lg font-bold text-white">{sessionsToday}</p>
              <p className="text-[10px] text-gray-400">Sessions</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Clock size={16} className="mx-auto mb-1 text-blue-400" />
              <p className="text-lg font-bold text-white">{totalFocusMins}m</p>
              <p className="text-[10px] text-gray-400">Focus Time</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Target size={16} className="mx-auto mb-1 text-green-400" />
              <p className="text-lg font-bold text-white">{Math.floor(totalFocusMins / 25)}</p>
              <p className="text-[10px] text-gray-400">Pomodoros</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
