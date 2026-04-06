import { useRef, useEffect, useCallback } from 'react'
import { ParticleSystem } from '../engine/particles.js'

export default function FlowCanvas({ config, onMouseMove, onFpsUpdate, onCanvasClick }) {
  const canvasRef = useRef(null)
  const systemRef = useRef(null)
  const configRef = useRef(config)
  const rafRef = useRef(null)
  const animateRef = useRef(null)

  // Keep config ref in sync
  useEffect(() => {
    configRef.current = config
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const system = new ParticleSystem()
    systemRef.current = system
    system.init(canvas, configRef.current)
    system.onFpsUpdate = (fps, count) => {
      if (onFpsUpdate) onFpsUpdate(fps, count)
    }

    const loop = () => {
      system.update(configRef.current)
      system.draw(configRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    animateRef.current = loop
    rafRef.current = requestAnimationFrame(loop)

    const handleResize = () => {
      system.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      system.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [onFpsUpdate])

  // Update particle count when config changes
  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setParticleCount(config.particleCount)
    }
  }, [config.particleCount])

  const handleMouseMove = useCallback((e) => {
    onMouseMove(e.clientX, e.clientY)
  }, [onMouseMove])

  const handleMouseLeave = useCallback(() => {
    onMouseMove(null, null)
  }, [onMouseMove])

  const handleClick = useCallback((e) => {
    if (onCanvasClick) {
      onCanvasClick(e.clientX, e.clientY, e.shiftKey)
    }
  }, [onCanvasClick])

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
      }}
    />
  )
}
