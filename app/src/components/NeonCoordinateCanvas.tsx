import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'

// R3F Three.js elements are globally available via @react-three/fiber

/* ─── Glow Shader Material ─── */
const glowVertexShader = `
  varying vec2 vUv;
  varying vec4 viewPosition;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    viewPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const glowFragmentShader = `
  varying vec2 vUv;
  varying vec4 viewPosition;
  uniform float uOpacity;
  uniform float uFadeDistance;
  uniform sampler2D uGradientTexture;
  void main() {
    vec4 gradientColor = texture2D(uGradientTexture, vec2(vUv.y, 0.5));
    float verticalFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    float distanceFade = max(0.0, 1.0 - length(viewPosition.xyz) / uFadeDistance);
    vec3 finalColor = gradientColor.rgb * verticalFade * distanceFade;
    gl_FragColor = vec4(finalColor, verticalFade * distanceFade * uOpacity);
  }
`

/* ─── Text Texture Helper ─── */
function createTextTexture(text: string, color = '#333'): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 1024, 512)
  ctx.font = '900 140px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(text, 512, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/* ─── Gradient Texture for Glow ─── */
function createGradientTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 1
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 256, 0)
  grad.addColorStop(0, '#ffaa00')
  grad.addColorStop(0.5, '#f6e336')
  grad.addColorStop(1, '#ff4444')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 1)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

/* ─── Floating Grid Cubes ─── */
function FloatingGrid() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 900

  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = []
    let idx = 0
    for (let x = -7; x <= 7; x += 0.5) {
      for (let y = -6; y <= 5; y += 0.5) {
        if (idx >= count) break
        const z = -8 + Math.random() * 12
        pos.push(new THREE.Vector3(x, y, z))
        idx++
      }
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i]
      dummy.position.set(p.x, p.y + Math.sin(time * 2 + p.x * 0.5) * 0.25, p.z)
      const scale = 0.08 + Math.sin(time + p.x) * 0.03
      dummy.scale.setScalar(Math.max(0.02, scale))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.7, metalness: 0.1 }), positions.length]}>
    </instancedMesh>
  )
}

/* ─── Glowing Path (Tube) ─── */
function GlowingPath() {
  const tubeRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  const { tubeGeo, innerGeo, glowMat } = useMemo(() => {
    const points = [
      new THREE.Vector3(-4, -1, -6),
      new THREE.Vector3(-2, 0.5, -4),
      new THREE.Vector3(0, -0.5, -2),
      new THREE.Vector3(1.5, 1, 0),
      new THREE.Vector3(0.5, -0.5, 2),
      new THREE.Vector3(2.5, 0.8, 4),
      new THREE.Vector3(4, -0.3, 6),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.15, 8, false)
    const innerGeo = new THREE.TubeGeometry(curve, 100, 0.06, 6, false)

    const glowMat = new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      uniforms: {
        uOpacity: { value: 1.0 },
        uFadeDistance: { value: 15 },
        uGradientTexture: { value: createGradientTexture() },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    return { tubeGeo, innerGeo, glowMat }
  }, [])

  return (
    <group>
      <mesh ref={tubeRef} geometry={tubeGeo} material={glowMat} />
      <mesh ref={innerRef} geometry={innerGeo}>
        <meshBasicMaterial color="#f2db27" transparent opacity={0.85} />
      </mesh>
      <pointLight color={0xffaa00} intensity={3} distance={15} position={[0, 0, 0]} />
    </group>
  )
}

/* ─── Editorial Text Planes ─── */
function TextPlane({ text, position }: { text: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => createTextTexture(text), [text])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[4.5, 2]} />
      <meshBasicMaterial map={texture} transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ─── Camera Rig ─── */
function CameraRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2 * 0.05
      target.current.y = (e.clientY / window.innerHeight - 0.5) * -2 * 0.05
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.05
    camera.position.y += (target.current.y - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── Main Canvas Component ─── */
export default function NeonCoordinateCanvas() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ fov: 50, position: [0, 0, 10] }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#f5f2eb']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />

        <CameraRig />
        <GlowingPath />
        <FloatingGrid />
        <TextPlane text="LEARN" position={[-1, 0.5, -3]} />
        <TextPlane text="GROW" position={[1.5, 0.5, 0]} />
        <TextPlane text="BUILD" position={[-0.5, 0.5, 3]} />

        <Html position={[0, -3.5, 0]} center zIndexRange={[100, 0]}>
          <button
            onClick={() => navigate('/gwa-calculator')}
            className="pill-btn pill-btn-bordered text-base font-semibold px-8 py-3.5"
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            START FOR FREE
          </button>
        </Html>
      </Canvas>
    </div>
  )
}
