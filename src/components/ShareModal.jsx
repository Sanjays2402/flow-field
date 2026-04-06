import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportConfig, importConfig } from '../engine/config.js'

export default function ShareModal({ config, onImport, visible, onClose }) {
  const [mode, setMode] = useState('export')
  const [importText, setImportText] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  const configJson = exportConfig(config)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(configJson).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [configJson])

  const handleImport = useCallback(() => {
    try {
      setError(null)
      const parsed = importConfig(importText)
      onImport(parsed)
      onClose()
    } catch {
      setError('Invalid JSON config')
    }
  }, [importText, onImport, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-[min(90vw,420px)]"
            style={{
              background: 'rgba(30, 30, 40, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 16px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-white/80">Share Config</h3>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full flex items-center justify-center
                  bg-white/[0.05] hover:bg-white/[0.1] text-white/40 hover:text-white/60
                  transition-all duration-200 text-[12px]"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-0.5 rounded-lg bg-white/[0.04]">
              <button
                onClick={() => { setMode('export'); setError(null) }}
                className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all duration-200 ${
                  mode === 'export'
                    ? 'bg-[#6366f1]/20 text-[#818cf8] shadow-[0_0_8px_rgba(99,102,241,0.15)]'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Export
              </button>
              <button
                onClick={() => { setMode('import'); setError(null) }}
                className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all duration-200 ${
                  mode === 'import'
                    ? 'bg-[#6366f1]/20 text-[#818cf8] shadow-[0_0_8px_rgba(99,102,241,0.15)]'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Import
              </button>
            </div>

            {mode === 'export' ? (
              <>
                <textarea
                  ref={textareaRef}
                  readOnly
                  value={configJson}
                  className="w-full h-48 p-3 rounded-xl text-[11px] font-mono text-white/70 resize-none outline-none"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopy}
                  className="w-full mt-3 py-2 text-[11px] font-semibold tracking-wide uppercase rounded-xl
                    bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8]
                    hover:bg-[#6366f1]/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                    transition-all duration-200 active:scale-[0.98]"
                >
                  {copied ? '✓ Copied!' : '⎘ Copy to Clipboard'}
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={importText}
                  onChange={(e) => { setImportText(e.target.value); setError(null) }}
                  placeholder="Paste JSON config here..."
                  className="w-full h-48 p-3 rounded-xl text-[11px] font-mono text-white/70 resize-none outline-none placeholder:text-white/20"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                />
                {error && (
                  <p className="mt-1.5 text-[10px] text-red-400">{error}</p>
                )}
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="w-full mt-3 py-2 text-[11px] font-semibold tracking-wide uppercase rounded-xl
                    bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8]
                    hover:bg-[#6366f1]/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                    transition-all duration-200 active:scale-[0.98]
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#6366f1]/10"
                >
                  ↑ Load Config
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
