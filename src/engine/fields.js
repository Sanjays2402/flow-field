import { createNoise3D } from 'simplex-noise'

const noise3D = createNoise3D()

// Fractal noise with octaves
function fractalNoise(x, y, z, octaves) {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z)
    maxValue += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return value / maxValue
}

// Curl noise (2D) — divergence-free field
function curlNoise(x, y, z, scale, octaves) {
  const eps = 0.001
  const n1 = fractalNoise(x, y + eps, z, octaves)
  const n2 = fractalNoise(x, y - eps, z, octaves)
  const n3 = fractalNoise(x + eps, y, z, octaves)
  const n4 = fractalNoise(x - eps, y, z, octaves)
  const dx = (n1 - n2) / (2 * eps)
  const dy = (n3 - n4) / (2 * eps)
  return { x: dx, y: -dy }
}

export function getFieldVector(px, py, width, height, config, time) {
  const { fieldType, fieldScale, noiseOctaves, mouseX, mouseY, mouseInfluence } = config
  const scale = fieldScale * 0.003
  const x = px * scale
  const y = py * scale
  const z = time * 0.0003

  let vx = 0
  let vy = 0

  switch (fieldType) {
    case 'perlin': {
      const angle = fractalNoise(x, y, z, noiseOctaves) * Math.PI * 4
      vx = Math.cos(angle)
      vy = Math.sin(angle)
      break
    }
    case 'curl': {
      const c = curlNoise(x, y, z, scale, noiseOctaves)
      vx = c.x
      vy = c.y
      const mag = Math.sqrt(vx * vx + vy * vy) || 1
      vx /= mag
      vy /= mag
      break
    }
    case 'vortex': {
      const cx = width / 2
      const cy = height / 2
      const dx = px - cx
      const dy = py - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const noise = fractalNoise(x, y, z, noiseOctaves) * 0.5
      vx = -dy / dist + noise
      vy = dx / dist + noise
      const mag = Math.sqrt(vx * vx + vy * vy) || 1
      vx /= mag
      vy /= mag
      break
    }
    case 'spiral': {
      const cx = width / 2
      const cy = height / 2
      const dx = px - cx
      const dy = py - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const angle = Math.atan2(dy, dx) + 0.5 + fractalNoise(x, y, z, noiseOctaves) * 0.8
      vx = Math.cos(angle) + dx / dist * 0.3
      vy = Math.sin(angle) + dy / dist * 0.3
      const mag = Math.sqrt(vx * vx + vy * vy) || 1
      vx /= mag
      vy /= mag
      break
    }
    case 'waves': {
      const noise = fractalNoise(x, y, z, noiseOctaves)
      vx = Math.sin(y * 0.8 + time * 0.001 + noise * 2)
      vy = Math.cos(x * 0.6 + time * 0.0008 + noise * 2) * 0.5
      const mag = Math.sqrt(vx * vx + vy * vy) || 1
      vx /= mag
      vy /= mag
      break
    }
    default: {
      const angle = fractalNoise(x, y, z, noiseOctaves) * Math.PI * 4
      vx = Math.cos(angle)
      vy = Math.sin(angle)
    }
  }

  // Mouse influence
  if (mouseX !== null && mouseY !== null && mouseInfluence > 0) {
    const dx = mouseX - px
    const dy = mouseY - py
    const dist = Math.sqrt(dx * dx + dy * dy)
    const radius = 200
    if (dist < radius && dist > 1) {
      const force = (1 - dist / radius) * mouseInfluence * 0.5
      vx += (dx / dist) * force
      vy += (dy / dist) * force
    }
  }

  return { x: vx, y: vy }
}
