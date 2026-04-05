import { useState, useCallback, useRef, useEffect } from 'react'
import FlowCanvas from './components/FlowCanvas.jsx'
import ControlPanel from './components/ControlPanel.jsx'

const DEFAULT_CONFIG = {
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
}

const FIELD_TYPES = ['perlin', 'curl', 'vortex', 'spiral', 'waves']
const COLOR_MODES = ['monochrome', 'rainbow', 'gradient', 'thermal']

function randomConfig() {
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
  }
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [panelVisible, setPanelVisible] = useState(true)
  const hideTimerRef = useRef(null)
  const canvasRef = useRef(null)

  // Auto-hide controls after 3s of inactivity
  const resetHideTimer = useCallback(() => {
    setPanelVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setPanelVisible(false)
    }, 3000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    const handleMove = () => resetHideTimer()
    const handleKey = (e) => {
      resetHideTimer()
      if (e.key === 'h' || e.key === 'H') {
        setPanelVisible((v) => !v)
      }
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('keydown', handleKey)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [resetHideTimer])

  const handleMouseMove = useCallback((x, y) => {
    setConfig((prev) => ({ ...prev, mouseX: x, mouseY: y }))
  }, [])

  const handleExport = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `flow-field-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const handleRandomize = useCallback(() => {
    setConfig((prev) => ({
      ...randomConfig(),
      mouseX: prev.mouseX,
      mouseY: prev.mouseY,
    }))
  }, [])

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }, [])

  return (
    <>
      <FlowCanvas config={config} onMouseMove={handleMouseMove} />
      <ControlPanel
        config={config}
        onChange={setConfig}
        onExport={handleExport}
        onRandomize={handleRandomize}
        onFullscreen={handleFullscreen}
        visible={panelVisible}
      />
    </>
  )
}
