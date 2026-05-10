import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function splitTextToChars(element: HTMLElement) {
  const words = element.querySelectorAll('.word')
  words.forEach((word) => {
    const text = word.textContent || ''
    word.innerHTML = ''
    text.split('').forEach((char) => {
      const span = document.createElement('span')
      span.className = 'char'
      span.textContent = char === ' ' ? '\u00A0' : char
      word.appendChild(span)
    })
  })
}

interface StaggeredTextRevealProps {
  children: string
  highlightWords?: string[]
  className?: string
}

export default function StaggeredTextReveal({ children, highlightWords = [], className = '' }: StaggeredTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    splitTextToChars(el)

    const chars = el.querySelectorAll('.char')
    gsap.set(chars, { y: '100%', opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=25%',
        once: true,
      },
    })

    tl.set(el, { perspective: 1000 })
    tl.to(chars, {
      y: '0%',
      opacity: 1,
      duration: 1.2,
      ease: 'expo.out',
      stagger: { each: 0.02, from: 0 },
    })

    // Glow effect on highlighted words
    const highlightEls = el.querySelectorAll('.highlight')
    highlightEls.forEach((word) => {
      const wordChars = word.querySelectorAll('.char')
      gsap.fromTo(
        wordChars,
        { color: 'rgba(246, 227, 54, 1)' },
        {
          color: '#f6e336',
          duration: 1.5,
          ease: 'expo.out',
          stagger: { each: 0.03, from: 0 },
          delay: 0.3,
        }
      )
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill())
    }
  }, [])

  // Split text into words, marking highlighted ones
  const words = children.split(' ')

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        )
        return (
          <span key={i} className={`word ${isHighlight ? 'highlight' : ''}`}>
            {word}
          </span>
        )
      })}
    </div>
  )
}
