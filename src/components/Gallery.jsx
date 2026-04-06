import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { randomConfig, FIELD_TYPES, COLOR_MODES } from '../engine/config.js'
import { ParticleSystem } from '../engine/particles.js'

function generateThumbnail(cfg, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const system = new ParticleSystem()
  // Override resize for our tiny canvas
  system.canvas = canvas
  system.ctx = canvas.getContext('2d')
  system.width = width
  system.height = height
  system.setParticleCount(Math.min(cfg.particleCount, 2000))

  // Fill with bg
  system.ctx.fillStyle = '#0a0a0a'
  system.ctx.fillRect(0, 0, width, height)

  // Simulate a few frames
  const smallCfg = { ...cfg, mouseX: null, mouseY: null, gravityWells: [] }
  for (let i = 0; i < 120; i++) {
    system.update(smallCfg)
    system.draw(smallCfg)
  }

  const dataUrl = canvas.toDataURL('image/png')
  system.destroy()
  return dataUrl
}

function GalleryItem({ config, thumbnail, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, delay: index * 0.06 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group rounded-xl overflow-hidden border border-white/[0.08] hover:border-[#6366f1]/40 transition-all duration-300"
      style={{
        background: 'rgba(30, 30, 40, 0.4)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        aspectRatio: '16/10',
      }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`Preset ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-[#6366f1]/40 border-t-[#6366f1] animate-spin" />
        </div>
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[9px] font-mono text-white/70 uppercase tracking-wide">
          {config.fieldType} · {config.colorMode}
        </span>
      </div>
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.15)' }}
      />
    </motion.button>
  )
}

export default function Gallery({ onSelect, visible }) {
  const [items, setItems] = useState([])
  const [thumbnails, setThumbnails] = useState({})
  const generatingRef = useRef(false)

  const generateItems = useCallback(() => {
    const newItems = Array.from({ length: 6 }, () => randomConfig())
    setItems(newItems)
    setThumbnails({})
    return newItems
  }, [])

  // Generate initial items
  useEffect(() => {
    if (visible && items.length === 0) {
      generateItems()
    }
  }, [visible, items.length, generateItems])

  // Generate thumbnails in background
  useEffect(() => {
    if (!visible || items.length === 0 || generatingRef.current) return
    generatingRef.current = true

    let cancelled = false
    const gen = async () => {
      for (let i = 0; i < items.length; i++) {
        if (cancelled) break
        await new Promise((r) => setTimeout(r, 50))
        if (cancelled) break
        const thumb = generateThumbnail(items[i], 320, 200)
        if (!cancelled) {
          setThumbnails((prev) => ({ ...prev, [i]: thumb }))
        }
      }
      generatingRef.current = false
    }
    gen()

    return () => { cancelled = true; generatingRef.current = false }
  }, [visible, items])

  const handleRegenerate = useCallback(() => {
    generatingRef.current = false
    generateItems()
  }, [generateItems])

  // Memoize gallery items to avoid recreating on every render
  const renderedItems = useMemo(() => {
    return items.map((cfg, i) => (
      <GalleryItem
        key={`${cfg.fieldType}-${cfg.colorMode}-${i}`}
        config={cfg}
        thumbnail={thumbnails[i]}
        index={i}
        onClick={() => onSelect(cfg)}
      />
    ))
  }, [items, thumbnails, onSelect])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(90vw,720px)]"
          style={{
            background: 'rgba(30, 30, 40, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-tight text-white/70">Gallery</span>
              <span className="text-[9px] font-mono text-white/20 uppercase">Click to load</span>
            </div>
            <button
              onClick={handleRegenerate}
              className="px-3 py-1 text-[10px] font-medium rounded-full
                bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8]
                hover:bg-[#6366f1]/20 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]
                transition-all duration-200 active:scale-95"
            >
              ↻ Regenerate
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {renderedItems}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
