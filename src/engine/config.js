// Shared configuration constants and utilities

export const FIELD_TYPES = ['perlin', 'curl', 'vortex', 'spiral', 'waves']
export const COLOR_MODES = ['monochrome', 'rainbow', 'gradient', 'thermal']
export const SYMMETRY_MODES = ['none', 'mirror', 'kaleidoscope-4', 'kaleidoscope-6']

export const DEFAULT_CONFIG = {
  particleCount: 8000,
  speed: 1.5,
  fieldScale: 3,
  noiseOctaves: 4,
  fieldType: 'perlin',
  colorMode: 'gradient',
  fadeRate: 0.05,
  mouseInfluence: 1,
  mouseX: null,
  mouseY: null,
  symmetryMode: 'none',
  evolutionEnabled: false,
  evolutionSpeed: 0.5,
  gravityWells: [],
}

export function randomConfig() {
  return {
    particleCount: Math.round((Math.random() * 20000 + 5000) / 1000) * 1000,
    speed: Math.round((Math.random() * 3 + 0.5) * 10) / 10,
    fieldScale: Math.round((Math.random() * 8 + 1) * 2) / 2,
    noiseOctaves: Math.floor(Math.random() * 6) + 2,
    fieldType: FIELD_TYPES[Math.floor(Math.random() * FIELD_TYPES.length)],
    colorMode: COLOR_MODES[Math.floor(Math.random() * COLOR_MODES.length)],
    fadeRate: Math.round((Math.random() * 0.15 + 0.02) * 100) / 100,
    mouseInfluence: Math.round(Math.random() * 20) / 10,
    mouseX: null,
    mouseY: null,
    symmetryMode: SYMMETRY_MODES[Math.floor(Math.random() * SYMMETRY_MODES.length)],
    evolutionEnabled: false,
    evolutionSpeed: 0.5,
    gravityWells: [],
  }
}

// Keys to export/import (exclude transient state)
const SHARE_KEYS = [
  'particleCount', 'speed', 'fieldScale', 'noiseOctaves',
  'fieldType', 'colorMode', 'fadeRate', 'mouseInfluence',
  'symmetryMode', 'evolutionEnabled', 'evolutionSpeed', 'gravityWells',
]

export function exportConfig(config) {
  const obj = {}
  for (const key of SHARE_KEYS) {
    if (config[key] !== undefined) obj[key] = config[key]
  }
  return JSON.stringify(obj, null, 2)
}

export function importConfig(jsonStr) {
  const obj = JSON.parse(jsonStr)
  const result = { ...DEFAULT_CONFIG }
  for (const key of SHARE_KEYS) {
    if (obj[key] !== undefined) result[key] = obj[key]
  }
  // Validate
  if (!FIELD_TYPES.includes(result.fieldType)) result.fieldType = 'perlin'
  if (!COLOR_MODES.includes(result.colorMode)) result.colorMode = 'gradient'
  if (!SYMMETRY_MODES.includes(result.symmetryMode)) result.symmetryMode = 'none'
  result.particleCount = Math.max(1000, Math.min(50000, result.particleCount))
  result.speed = Math.max(0.1, Math.min(5, result.speed))
  result.fieldScale = Math.max(0.5, Math.min(10, result.fieldScale))
  result.noiseOctaves = Math.max(1, Math.min(8, Math.round(result.noiseOctaves)))
  result.fadeRate = Math.max(0.01, Math.min(0.3, result.fadeRate))
  result.mouseInfluence = Math.max(0, Math.min(3, result.mouseInfluence))
  result.mouseX = null
  result.mouseY = null
  if (!Array.isArray(result.gravityWells)) result.gravityWells = []
  return result
}
