import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { reducedMotion } from '../lib/util'

/**
 * Landing hero: the photo tilts in 3D with the pointer (gentle sway on touch screens),
 * and brass suit buttons float around it in a transparent WebGL layer.
 */
export function Hero3D({ active, children }: { active: boolean; children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const startRef = useRef<() => void>(() => {})

  useEffect(() => {
    activeRef.current = active
    if (active) startRef.current()
  }, [active])

  useEffect(() => {
    const box = boxRef.current!, tilt = tiltRef.current!, cv = canvasRef.current!
    const hero = box.parentElement!
    const RM = reducedMotion()
    let px = 0, py = 0, lastMove = -1e9, raf = 0

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      lastMove = performance.now()
    }
    hero.addEventListener('pointermove', onMove)

    let R: THREE.WebGLRenderer | null = null
    const sc = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    cam.position.set(0, 0, 10)
    const floaters: THREE.Group[] = []
    const disposables: { dispose: () => void }[] = []
    try {
      R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(devicePixelRatio, 2))
      sc.add(new THREE.HemisphereLight(0xf0ece2, 0x0d1210, 1.6))
      const key = new THREE.DirectionalLight(0xfff0d8, 2.6)
      key.position.set(4, 6, 8)
      sc.add(key)
      const warm = new THREE.PointLight(0xc49a52, 60, 30, 2)
      warm.position.set(-5, -1, 5)
      sc.add(warm)
      const brass = new THREE.MeshStandardMaterial({ color: 0xc49a52, metalness: 0.6, roughness: 0.28 })
      const holeM = new THREE.MeshStandardMaterial({ color: 0x2a1d0e, roughness: 0.9 })
      disposables.push(brass, holeM)
      const makeButton = (r: number) => {
        const g = new THREE.Group()
        const discG = new THREE.CylinderGeometry(r, r * 0.96, r * 0.22, 40)
        const disc = new THREE.Mesh(discG, brass)
        disc.rotation.x = Math.PI / 2
        g.add(disc)
        const rimG = new THREE.TorusGeometry(r * 0.88, r * 0.09, 10, 40)
        const rim = new THREE.Mesh(rimG, brass)
        rim.position.z = r * 0.11
        g.add(rim)
        const holeG = new THREE.CylinderGeometry(r * 0.12, r * 0.12, r * 0.26, 12)
        for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const h = new THREE.Mesh(holeG, holeM)
          h.rotation.x = Math.PI / 2
          h.position.set(a * r * 0.26, b * r * 0.26, 0)
          g.add(h)
        }
        disposables.push(discG, rimG, holeG)
        return g
      }
      ;[[-0.92, 0.62, 1.5, 0.34], [0.9, 0.78, 0.6, 0.26], [0.95, -0.35, 1.8, 0.3], [-0.88, -0.7, 1, 0.24], [0.2, 1.02, -1, 0.2]].forEach(
        ([fx, fy, z, r], i) => {
          const b = makeButton(r)
          b.userData = { fx, fy, z, i }
          sc.add(b)
          floaters.push(b)
        },
      )
    } catch {
      R = null // no WebGL: the photo tilt still works
    }

    let w = 0
    const size = () => {
      if (!R) return
      const r = cv.getBoundingClientRect()
      w = r.width
      if (!w || !r.height) return
      R.setSize(w, r.height, false)
      cam.aspect = w / r.height
      cam.updateProjectionMatrix()
    }
    addEventListener('resize', size)
    size()

    const frame = (t: number) => {
      let x = px, y = py
      if (performance.now() - lastMove > 2500) { x = Math.sin(t / 1600) * 0.55; y = Math.cos(t / 2100) * 0.35 }
      tilt.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg)`
      if (R && w) {
        const hh = Math.tan((17.5 * Math.PI) / 180) * 10, hw = hh * cam.aspect
        for (const b of floaters) {
          const { fx, fy, z, i } = b.userData as { fx: number; fy: number; z: number; i: number }
          const k = (10 - z) / 10
          b.position.set(fx * hw * k * 0.92, fy * hh * k * 0.9 + Math.sin(t / 900 + i) * 0.12, z)
          b.rotation.y = Math.sin(t / 1800 + i) * 0.8 + px * 0.4
          b.rotation.x = Math.cos(t / 2200 + i) * 0.4 - py * 0.3
        }
        cam.position.x += (px * 0.5 - cam.position.x) * 0.05
        cam.position.y += (-py * 0.4 - cam.position.y) * 0.05
        cam.lookAt(0, 0, 0)
        R.render(sc, cam)
      }
      raf = activeRef.current && !RM ? requestAnimationFrame(frame) : 0
    }
    startRef.current = () => { size(); if (!raf) raf = requestAnimationFrame(frame) }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onMove)
      removeEventListener('resize', size)
      disposables.forEach(d => d.dispose())
      R?.dispose()
    }
  }, [])

  return (
    <div className="lh-media" id="hero3d" ref={boxRef}>
      <div className="tilt" ref={tiltRef}>{children}</div>
      <canvas id="c3d" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
