import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

const COLORS = ['#8B5CF6', '#3B82F6', '#22D3EE']

export function HoloBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

    const particles: Particle[] = []
    const maxParticles = 95
    const linkDistance = 115

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      particles.length = 0
      const count = Math.floor(maxParticles * Math.min(1, (w * h) / (1100 * 700)))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1 + Math.random() * 2.2,
          a: 0.25 + Math.random() * 0.55,
        })
      }
    }

    const draw = () => {
      if (!running) return
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Clear with transparency to feel “holographic”.
      ctx.clearRect(0, 0, w, h)

      // Subtle glow haze.
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        ctx.beginPath()
        const color = COLORS[Math.floor((p.x + p.y) % COLORS.length)]
        ctx.fillStyle = color
        ctx.globalAlpha = p.a * 0.35
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Neural links.
      ctx.globalAlpha = 0.35
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDistance) {
            const t = 1 - dist / linkDistance
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.22 * t})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      ctx.globalCompositeOperation = 'source-over'

      // Update motion.
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
      }

      raf = window.requestAnimationFrame(draw)
    }

    resize()
    raf = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      running = false
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ opacity: 0.55 }}
    />
  )
}

