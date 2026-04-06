import { useState, useCallback, useRef, useEffect } from 'react'
import FlowCanvas from './components/FlowCanvas.jsx'
import ControlPanel from './components/ControlPanel.jsx'
import FpsCounter from './components/FpsCounter.jsx'
import Gallery from './components/Gallery.jsx'
import ShareModal from './components/ShareModal.jsx'
import { DEFAULT_CONFIG, randomConfig } from './engine/config.js'

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [panelVisible, setPanelVisible] = useState(true)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const [gravityMode, setGravityMode] = useState(null)
  const [fps, setFps] = useState(0)
  const [particleCount, setParticleCount] = useState(DEFAULT_CONFIG.particleCount)
  const hideTimerRef = useRef(null)
  const evolutionRef = useRef(null)

  // Auto-hide controls after 5s of inactivity
  const resetHideTimer = useCallback(() => {
    setPanelVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setPanelVisible(false)
    }, 5000)
  }, [])

  // Set initial hide timer on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPanelVisible(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMove = () => resetHideTimer()
    const handleKey = (e) => {
      resetHideTimer()
      if (e.key === 'h' || e.key === 'H') {
        setPanelVisible((v) => !v)
      }
      if (e.key === 'g' || e.key === 'G') {
        setGalleryVisible((v) => !v)
      }
      if (e.key === 'Escape') {
        setGalleryVisible(false)
        setShareVisible(false)
        setGravityMode(null)
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

  // Time-based evolution
  useEffect(() => {
    if (config.evolutionEnabled) {
      const interval = setInterval(() => {
        setConfig((prev) => {
          const drift = prev.evolutionSpeed * 0.02
          const newScale = prev.fieldScale + (Math.random() - 0.5) * drift * 2
          const newSpeed = prev.speed + (Math.random() - 0.5) * drift * 0.5
          const newFade = prev.fadeRate + (Math.random() - 0.5) * drift * 0.02
          return {
            ...prev,
            fieldScale: Math.max(0.5, Math.min(10, newScale)),
            speed: Math.max(0.1, Math.min(5, newSpeed)),
            fadeRate: Math.max(0.01, Math.min(0.3, newFade)),
          }
        })
      }, 200)
      evolutionRef.current = interval
      return () => clearInterval(interval)
    } else {
      if (evolutionRef.current) clearInterval(evolutionRef.current)
    }
  }, [config.evolutionEnabled, config.evolutionSpeed])

  const handleMouseMove = useCallback((x, y) => {
    setConfig((prev) => ({ ...prev, mouseX: x, mouseY: y }))
  }, [])

  const handleCanvasClick = useCallback((x, y, shiftKey) => {
    if (!gravityMode) return
    const type = shiftKey
      ? (gravityMode === 'attractor' ? 'repulsor' : 'attractor')
      : gravityMode
    setConfig((prev) => ({
      ...prev,
      gravityWells: [
        ...prev.gravityWells,
        { x, y, type, strength: 1 },
      ],
    }))
  }, [gravityMode])

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

  const handleGallerySelect = useCallback((cfg) => {
    setConfig((prev) => ({ ...cfg, mouseX: prev.mouseX, mouseY: prev.mouseY }))
    setGalleryVisible(false)
  }, [])

  const handleImportConfig = useCallback((cfg) => {
    setConfig((prev) => ({ ...cfg, mouseX: prev.mouseX, mouseY: prev.mouseY }))
  }, [])

  const handleFpsUpdate = useCallback((newFps, count) => {
    setFps(newFps)
    setParticleCount(count)
  }, [])

  const handleToggleGravityMode = useCallback((mode) => {
    setGravityMode((prev) => prev === mode ? null : mode)
  }, [])

  return (
    <>
      {/* Background gradient mesh blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <FlowCanvas
        config={config}
        onMouseMove={handleMouseMove}
        onCanvasClick={handleCanvasClick}
        onFpsUpdate={handleFpsUpdate}
      />

      <FpsCounter fps={fps} particleCount={particleCount} visible={panelVisible} />

      <ControlPanel
        config={config}
        onChange={setConfig}
        onExport={handleExport}
        onRandomize={handleRandomize}
        onFullscreen={handleFullscreen}
        onToggleGallery={() => setGalleryVisible((v) => !v)}
        onToggleShare={() => setShareVisible((v) => !v)}
        visible={panelVisible}
        gravityMode={gravityMode}
        onToggleGravityMode={handleToggleGravityMode}
      />

      <Gallery
        onSelect={handleGallerySelect}
        visible={galleryVisible}
      />

      <ShareModal
        config={config}
        onImport={handleImportConfig}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
      />
    </>
  )
}
