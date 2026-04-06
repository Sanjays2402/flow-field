import { motion, AnimatePresence } from 'framer-motion'

export default function FpsCounter({ fps, particleCount, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50"
          style={{
            background: 'rgba(30, 30, 40, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '8px 14px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444',
                  boxShadow: `0 0 6px ${fps >= 50 ? 'rgba(34,197,94,0.5)' : fps >= 30 ? 'rgba(234,179,8,0.5)' : 'rgba(239,68,68,0.5)'}`,
                }}
              />
              <span className="text-[11px] font-mono text-white/70">
                {fps}<span className="text-white/30 ml-0.5">fps</span>
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[11px] font-mono text-[#818cf8]">
              {particleCount >= 1000 ? `${(particleCount / 1000).toFixed(0)}k` : particleCount}
              <span className="text-white/30 ml-0.5">particles</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
