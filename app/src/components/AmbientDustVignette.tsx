import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const dustVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const dustFragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSpread;
  uniform vec2 uCenter;
  uniform vec2 uResolution;
  uniform float uNoiseIntensity;

  float random(vec2 coord) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(coord.xy, vec2(a, b));
    return fract(sin(mod(dt, 3.14)) * c);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 6; i++) {
      sum += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return sum;
  }

  void main() {
    vec2 centerCorrection = uCenter * (0.5 - vUv);
    float aspect = uResolution.x / uResolution.y;
    vec2 distUV = vUv + centerCorrection;
    vec2 distVec = vec2((distUV.x - 0.5) * aspect, distUV.y - 0.5);
    float dist = length(distVec);
    float vignette = 1.0 - smoothstep(uSpread, uSpread + 0.5, dist);
    vignette *= uOpacity;

    float noiseTime = uTime * 0.2;
    vec2 q = vec2(fbm(vec2(vUv + noiseTime * 0.1)), fbm(vec2(vUv + vec2(1.0))));
    vec2 r = vec2(
      fbm(vec2(vUv + 1.0 * q + vec2(1.7, 9.2) + noiseTime * 0.2)),
      fbm(vec2(vUv + 8.3 * q + vec2(5.3, 2.8) + noiseTime * 0.2))
    );
    float f = fbm(vUv + r);
    f = smoothstep(0.0, 1.0, f);
    vignette = mix(vignette, vignette * f, uNoiseIntensity);

    gl_FragColor = vec4(uColor, vignette);
  }
`

export default function AmbientDustVignette() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const uniforms = {
      uColor: { value: new THREE.Vector3(1.0, 0.95, 0.9) },
      uOpacity: { value: 0.75 },
      uTime: { value: 0.0 },
      uSpread: { value: 0.5 },
      uCenter: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uNoiseIntensity: { value: 0.4 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms,
      transparent: true,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      uniforms.uResolution.value.set(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
