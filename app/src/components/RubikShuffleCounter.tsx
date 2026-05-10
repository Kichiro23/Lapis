import { useEffect, useRef, useState, useCallback } from 'react'

interface RubikShuffleCounterProps {
  target: string
  trigger: boolean
  onComplete?: () => void
}

export default function RubikShuffleCounter({ target, trigger, onComplete }: RubikShuffleCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalsRef = useRef<number[]>([])
  const [initialized, setInitialized] = useState(false)

  const initCounter = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''

    for (let i = 0; i < 7; i++) {
      const cell = document.createElement('div')
      cell.className = 'gwa-digit'

      for (let d = 0; d < 10; d++) {
        const numEl = document.createElement('div')
        numEl.className = 'gwa-number'
        numEl.textContent = d.toString()
        numEl.style.opacity = d === 9 ? '1' : '0'
        cell.appendChild(numEl)
      }

      // Decimal point at position 1
      if (i === 1) {
        cell.innerHTML = ''
        const dot = document.createElement('div')
        dot.className = 'gwa-number'
        dot.textContent = '.'
        dot.style.opacity = '1'
        cell.appendChild(dot)
      }

      container.appendChild(cell)
    }

    setInitialized(true)
  }, [target])

  const startCounter = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous intervals
    intervalsRef.current.forEach((id) => clearInterval(id))
    intervalsRef.current = []

    const cells = container.querySelectorAll('.gwa-digit')
    const targetStr = target.padStart(7, '0')

    cells.forEach((cell, cellIndex) => {
      if (cellIndex === 1) return // skip decimal point

      const numEls = cell.querySelectorAll('.gwa-number')

      const interval = window.setInterval(() => {
        numEls.forEach((el) => ((el as HTMLElement).style.opacity = '0'))
        const r = Math.floor(Math.random() * 10)
        ;(numEls[r] as HTMLElement).style.opacity = '1'
      }, 20)

      intervalsRef.current.push(interval)

      window.setTimeout(() => {
        clearInterval(interval)
        numEls.forEach((el) => ((el as HTMLElement).style.opacity = '0'))
        const finalChar = targetStr[cellIndex]
        const finalIdx = parseInt(finalChar)
        if (numEls[finalIdx]) {
          ;(numEls[finalIdx] as HTMLElement).style.opacity = '1'
        }
      }, 1000 + cellIndex * 200)
    })

    window.setTimeout(() => {
      onComplete?.()
    }, 2500)
  }, [target, onComplete])

  useEffect(() => {
    initCounter()
  }, [initCounter])

  useEffect(() => {
    if (trigger && initialized) {
      startCounter()
    }
    return () => {
      intervalsRef.current.forEach((id) => clearInterval(id))
    }
  }, [trigger, initialized, startCounter])

  return <div ref={containerRef} className="gwa-counter" />
}
