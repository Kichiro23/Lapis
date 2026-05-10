import { useState, useEffect } from 'react'
import NeonCoordinateCanvas from './NeonCoordinateCanvas'

export default function SafeCanvas() {
  const [hasError, setHasError] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (hasError || !webglSupported) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(135deg, #f5f2eb 0%, #e9e7e0 100%)',
        }}
      />
    )
  }

  return (
    <ErrorCatcher onError={() => setHasError(true)}>
      <NeonCoordinateCanvas />
    </ErrorCatcher>
  )
}

function ErrorCatcher({ children, onError }: { children: React.ReactNode; onError: () => void }) {
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.message?.includes('three') || e.message?.includes('webgl') || e.message?.includes('r3f')) {
        onError()
      }
    }
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [onError])

  return <>{children}</>
}
