import { getFieldVector } from './fields.js'
import { getParticleColor } from './colors.js'

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.prevX = this.x
    this.prevY = this.y
    this.vx = 0
    this.vy = 0
    this.speed = 0
    this.age = Math.random() * 100
    this.life = 200 + Math.random() * 300
    this.canvasWidth = width
    this.canvasHeight = height
  }

  reset(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.prevX = this.x
    this.prevY = this.y
    this.vx = 0
    this.vy = 0
    this.speed = 0
    this.age = 0
    this.life = 200 + Math.random() * 300
    this.canvasWidth = width
    this.canvasHeight = height
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = []
    this.width = 0
    this.height = 0
    this.animationId = null
    this.startTime = performance.now()
    this.frameCount = 0
    this.fps = 0
    this.lastFpsTime = performance.now()
    this.onFpsUpdate = null
  }

  init(canvas, config) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.resize()
    this.setParticleCount(config.particleCount)
  }

  resize() {
    const dpr = window.devicePixelRatio || 1
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.canvas.style.width = this.width + 'px'
    this.canvas.style.height = this.height + 'px'
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  setParticleCount(count) {
    const current = this.particles.length
    if (count > current) {
      for (let i = current; i < count; i++) {
        this.particles.push(new Particle(this.width, this.height))
      }
    } else if (count < current) {
      this.particles.length = count
    }
  }

  update(config) {
    const { speed } = config
    const time = performance.now() - this.startTime
    const w = this.width
    const h = this.height

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.prevX = p.x
      p.prevY = p.y

      const field = getFieldVector(p.x, p.y, w, h, config, time)
      p.vx = p.vx * 0.92 + field.x * speed * 1.5
      p.vy = p.vy * 0.92 + field.y * speed * 1.5

      p.x += p.vx
      p.y += p.vy
      p.speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) / (speed * 2 + 0.01)
      p.age++

      // Reset if out of bounds or too old
      if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.age > p.life) {
        p.reset(w, h)
      }

      p.canvasWidth = w
      p.canvasHeight = h
    }

    // FPS tracking
    this.frameCount++
    const now = performance.now()
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastFpsTime = now
      if (this.onFpsUpdate) {
        this.onFpsUpdate(this.fps, this.particles.length)
      }
    }
  }

  draw(config) {
    const { fadeRate, symmetryMode } = config
    const ctx = this.ctx
    const w = this.width
    const h = this.height

    // Fade effect for trails
    ctx.fillStyle = `rgba(10, 10, 10, ${fadeRate})`
    ctx.fillRect(0, 0, w, h)

    const drawLines = (transformFn) => {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i]
        const color = getParticleColor(p, config)
        const lw = 0.8 + p.speed * 0.6

        if (transformFn) {
          const points = transformFn(p.prevX, p.prevY, p.x, p.y, w, h)
          for (let j = 0; j < points.length; j++) {
            const pt = points[j]
            ctx.beginPath()
            ctx.moveTo(pt.x1, pt.y1)
            ctx.lineTo(pt.x2, pt.y2)
            ctx.strokeStyle = color
            ctx.lineWidth = lw
            ctx.stroke()
          }
        } else {
          ctx.beginPath()
          ctx.moveTo(p.prevX, p.prevY)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = color
          ctx.lineWidth = lw
          ctx.stroke()
        }
      }
    }

    if (!symmetryMode || symmetryMode === 'none') {
      drawLines(null)
    } else if (symmetryMode === 'mirror') {
      drawLines((px1, py1, px2, py2, cw) => [
        { x1: px1, y1: py1, x2: px2, y2: py2 },
        { x1: cw - px1, y1: py1, x2: cw - px2, y2: py2 },
      ])
    } else if (symmetryMode === 'kaleidoscope-4') {
      drawLines((px1, py1, px2, py2, cw, ch) => {
        const cx = cw / 2, cy = ch / 2
        const dx1 = px1 - cx, dy1 = py1 - cy
        const dx2 = px2 - cx, dy2 = py2 - cy
        return [
          { x1: cx + dx1, y1: cy + dy1, x2: cx + dx2, y2: cy + dy2 },
          { x1: cx - dx1, y1: cy + dy1, x2: cx - dx2, y2: cy + dy2 },
          { x1: cx + dx1, y1: cy - dy1, x2: cx + dx2, y2: cy - dy2 },
          { x1: cx - dx1, y1: cy - dy1, x2: cx - dx2, y2: cy - dy2 },
        ]
      })
    } else if (symmetryMode === 'kaleidoscope-6') {
      drawLines((px1, py1, px2, py2, cw, ch) => {
        const cx = cw / 2, cy = ch / 2
        const result = []
        for (let k = 0; k < 6; k++) {
          const angle = (k * Math.PI * 2) / 6
          const cos = Math.cos(angle), sin = Math.sin(angle)
          const dx1 = px1 - cx, dy1 = py1 - cy
          const dx2 = px2 - cx, dy2 = py2 - cy
          result.push({
            x1: cx + dx1 * cos - dy1 * sin,
            y1: cy + dx1 * sin + dy1 * cos,
            x2: cx + dx2 * cos - dy2 * sin,
            y2: cy + dx2 * sin + dy2 * cos,
          })
        }
        return result
      })
    }

    // Draw gravity wells
    const wells = config.gravityWells
    if (wells && wells.length > 0) {
      for (let i = 0; i < wells.length; i++) {
        const well = wells[i]
        const isAttractor = well.type === 'attractor'
        const color = isAttractor ? 'rgba(99, 102, 241, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        const glowColor = isAttractor ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.15)'

        // Outer glow
        const gradient = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, 40)
        gradient.addColorStop(0, glowColor)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(well.x - 40, well.y - 40, 80, 80)

        // Core dot
        ctx.beginPath()
        ctx.arc(well.x, well.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Ring
        ctx.beginPath()
        ctx.arc(well.x, well.y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }

  clear() {
    this.ctx.fillStyle = '#0a0a0a'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  exportPNG() {
    return this.canvas.toDataURL('image/png')
  }

  destroy() {
    this.particles = []
  }
}
