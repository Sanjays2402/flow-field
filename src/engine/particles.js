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
    const { speed, trailLength } = config
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
  }

  draw(config) {
    const { fadeRate } = config
    const ctx = this.ctx

    // Fade effect for trails
    ctx.fillStyle = `rgba(10, 10, 10, ${fadeRate})`
    ctx.fillRect(0, 0, this.width, this.height)

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      const color = getParticleColor(p, config)

      ctx.beginPath()
      ctx.moveTo(p.prevX, p.prevY)
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = color
      ctx.lineWidth = 0.8 + p.speed * 0.6
      ctx.stroke()
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
