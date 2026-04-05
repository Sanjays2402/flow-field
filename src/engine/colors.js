// Color modes for particles

function hslToRgb(h, s, l) {
  h = h / 360
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export function getParticleColor(particle, config) {
  const { colorMode } = config
  const { speed, age, x, y, canvasWidth, canvasHeight } = particle

  switch (colorMode) {
    case 'monochrome': {
      const brightness = 140 + speed * 80
      return `rgba(${brightness}, ${brightness}, ${Math.min(255, brightness + 40)}, ${0.3 + speed * 0.4})`
    }
    case 'rainbow': {
      const hue = (age * 2 + speed * 120) % 360
      const [r, g, b] = hslToRgb(hue, 0.85, 0.55)
      return `rgba(${r}, ${g}, ${b}, ${0.3 + speed * 0.4})`
    }
    case 'gradient': {
      // Purple to cyan based on position
      const t = Math.sqrt((x / canvasWidth) ** 2 + (y / canvasHeight) ** 2) / Math.SQRT2
      const r = Math.round(99 + (0 - 99) * t)
      const g = Math.round(102 + (200 - 102) * t)
      const b = Math.round(241 + (255 - 241) * t)
      return `rgba(${r}, ${g}, ${b}, ${0.3 + speed * 0.4})`
    }
    case 'thermal': {
      // Speed-based thermal: blue → cyan → green → yellow → red
      const s = Math.min(1, speed * 1.5)
      let r, g, b
      if (s < 0.25) {
        const t = s / 0.25
        r = 0; g = Math.round(t * 100); b = Math.round(150 + t * 105)
      } else if (s < 0.5) {
        const t = (s - 0.25) / 0.25
        r = 0; g = Math.round(100 + t * 155); b = Math.round(255 - t * 155)
      } else if (s < 0.75) {
        const t = (s - 0.5) / 0.25
        r = Math.round(t * 255); g = 255; b = 0
      } else {
        const t = (s - 0.75) / 0.25
        r = 255; g = Math.round(255 - t * 255); b = 0
      }
      return `rgba(${r}, ${g}, ${b}, ${0.35 + speed * 0.4})`
    }
    default:
      return `rgba(180, 180, 200, 0.4)`
  }
}
