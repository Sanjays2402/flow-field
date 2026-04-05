import { useRef, useEffect, useCallback } from 'react'
import { ParticleSystem } from '../engine/particles.js'

export default function FlowCanvas({ config, onMouseMove }) {
  const canvasRef = useRef(null)
  const systemRef = useRef(null)
  const configRef = useRef(config)
  const rafRef = useRef(null)

  configRef.current = config

  const animate = useCallback(() => {
    const system = systemRef.current
    if (!system) return
    system.update(configRef.current)
    system.draw(configRef.current)
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const system = new ParticleSystem()
    systemRef.current = system
    system.init(canvas, configRef.current)
    rafRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      system.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      system.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [animate])

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

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

export function getSystemRef() {
  return null // Handled via ref in parent
}
