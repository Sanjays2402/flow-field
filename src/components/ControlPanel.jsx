import { motion, AnimatePresence } from 'framer-motion'

const FIELD_TYPES = [
  { value: 'perlin', label: 'Perlin Noise' },
  { value: 'curl', label: 'Curl Noise' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'waves', label: 'Waves' },
]

const COLOR_MODES = [
  { value: 'monochrome', label: 'Mono' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'thermal', label: 'Thermal' },
]

function SliderControl({ label, value, min, max, step, onChange, formatValue }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] font-medium tracking-wide uppercase text-white/50">
          {label}
        </span>
        <span className="text-[11px] font-mono text-[#818cf8]">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}

function ButtonGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all duration-200 border ${
            value === opt.value
              ? 'bg-[#6366f1]/20 border-[#6366f1]/50 text-[#818cf8] shadow-[0_0_12px_rgba(99,102,241,0.2)]'
              : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function ControlPanel({ config, onChange, onExport, onRandomize, onFullscreen, visible }) {
  const update = (key, value) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 left-4 z-50 w-[260px] max-h-[calc(100vh-32px)] overflow-y-auto"
        >
          {/* Grain overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div
            className="relative rounded-2xl p-4"
            style={{
              background: 'rgba(30, 30, 40, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
              <div className="w-2 h-2 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              <h2 className="text-[13px] font-semibold tracking-tight text-white/80">
                Flow Field
              </h2>
              <span className="ml-auto text-[9px] font-mono text-white/20 uppercase tracking-widest">
                Controls
              </span>
            </div>

            {/* Field Type */}
            <div className="mb-4">
              <span className="text-[11px] font-medium tracking-wide uppercase text-white/50 block mb-1.5">
                Field Type
              </span>
              <ButtonGroup
                options={FIELD_TYPES}
                value={config.fieldType}
                onChange={(v) => update('fieldType', v)}
              />
            </div>

            {/* Color Mode */}
            <div className="mb-4">
              <span className="text-[11px] font-medium tracking-wide uppercase text-white/50 block mb-1.5">
                Color Mode
              </span>
              <ButtonGroup
                options={COLOR_MODES}
                value={config.colorMode}
                onChange={(v) => update('colorMode', v)}
              />
            </div>

            {/* Sliders */}
            <SliderControl
              label="Particles"
              value={config.particleCount}
              min={1000}
              max={50000}
              step={1000}
              onChange={(v) => update('particleCount', v)}
              formatValue={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <SliderControl
              label="Speed"
              value={config.speed}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(v) => update('speed', v)}
              formatValue={(v) => v.toFixed(1)}
            />
            <SliderControl
              label="Field Scale"
              value={config.fieldScale}
              min={0.5}
              max={10}
              step={0.5}
              onChange={(v) => update('fieldScale', v)}
              formatValue={(v) => v.toFixed(1)}
            />
            <SliderControl
              label="Noise Octaves"
              value={config.noiseOctaves}
              min={1}
              max={8}
              step={1}
              onChange={(v) => update('noiseOctaves', v)}
            />
            <SliderControl
              label="Fade Rate"
              value={config.fadeRate}
              min={0.01}
              max={0.3}
              step={0.01}
              onChange={(v) => update('fadeRate', v)}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderControl
              label="Mouse Influence"
              value={config.mouseInfluence}
              min={0}
              max={3}
              step={0.1}
              onChange={(v) => update('mouseInfluence', v)}
              formatValue={(v) => v.toFixed(1)}
            />

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              <button
                onClick={onRandomize}
                className="w-full py-2 text-[11px] font-semibold tracking-wide uppercase rounded-lg
                  bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8]
                  hover:bg-[#6366f1]/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]
                  transition-all duration-200 active:scale-[0.98]"
              >
                ✦ Randomize
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onExport}
                  className="flex-1 py-2 text-[10px] font-medium tracking-wide uppercase rounded-lg
                    bg-white/[0.04] border border-white/[0.08] text-white/50
                    hover:bg-white/[0.08] hover:text-white/70
                    transition-all duration-200 active:scale-[0.98]"
                >
                  ↓ Export PNG
                </button>
                <button
                  onClick={onFullscreen}
                  className="flex-1 py-2 text-[10px] font-medium tracking-wide uppercase rounded-lg
                    bg-white/[0.04] border border-white/[0.08] text-white/50
                    hover:bg-white/[0.08] hover:text-white/70
                    transition-all duration-200 active:scale-[0.98]"
                >
                  ⛶ Fullscreen
                </button>
              </div>
            </div>

            {/* Hint */}
            <p className="mt-3 text-[9px] text-white/20 text-center">
              Move mouse to influence field • Controls auto-hide
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
