import { useEffect, useState } from 'react'

function useVisible(delay = 0) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t) }, [delay])
  return v
}

function AnimatedNumber({ target, duration = 1500 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])
  return <>{val}</>
}

const GRADE_CONFIG = {
  Excellent: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)', emoji: '🌟' },
  Good:      { color: '#86efac', bg: 'rgba(134,239,172,0.1)', border: 'rgba(134,239,172,0.2)', emoji: '✅' },
  Fair:      { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', emoji: '⚠️' },
  Poor:      { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', emoji: '🔴' },
  Critical:  { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', emoji: '🚨' },
}

const CATEGORY_ICONS = {
  Transport:   '🚗',
  Diet:        '🥩',
  Electricity: '⚡',
  'AC Usage':  '❄️',
  Flights:     '✈️',
}

export default function ScoreCard({ score }) {
  const visible = useVisible(100)
  const [showBreakdown, setShowBreakdown] = useState(false)

  if (!score) return null

  const { total, max, grade, breakdown, improved_total } = score
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.Fair
  const pct = (total / max) * 100
  const improvedPct = (improved_total / max) * 100

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ background: cfg.bg }}>
          🎯
        </div>
        <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-[--muted]">
          Your Carbon Score
        </span>
      </div>

      {/* Main score */}
      <div className="flex items-center gap-6 mb-5">
        {/* Circular score */}
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            {/* Background ring */}
            <circle cx="45" cy="45" r="38" fill="none" stroke="#1e2a1c" strokeWidth="8"/>
            {/* Score ring */}
            <circle
              cx="45" cy="45" r="38"
              fill="none"
              stroke={cfg.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
              transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl leading-none" style={{ color: cfg.color }}>
              <AnimatedNumber target={total} />
            </span>
            <span className="font-mono text-[8px] text-[--muted]">/{max}</span>
          </div>
        </div>

        {/* Grade + comparison */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{cfg.emoji}</span>
            <span className="font-serif text-xl" style={{ color: cfg.color }}>{grade}</span>
          </div>
          <p className="font-mono text-[10px] text-[--muted] leading-relaxed mb-3">
            {grade === 'Excellent' && 'You\'re a climate champion!'}
            {grade === 'Good' && 'Great habits, small improvements left.'}
            {grade === 'Fair' && 'Room to improve — you can do it!'}
            {grade === 'Poor' && 'Significant changes needed.'}
            {grade === 'Critical' && 'High impact lifestyle — act now.'}
          </p>
          {/* Before/after mini bar */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[--muted] w-14">Now</span>
              <div className="flex-1 h-1.5 bg-[--border] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: cfg.color }} />
              </div>
              <span className="font-mono text-[9px]" style={{ color: cfg.color }}>{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[--muted] w-14">Potential</span>
              <div className="flex-1 h-1.5 bg-[--border] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 delay-300"
                  style={{ width: `${improvedPct}%`, background: '#4ade80' }} />
              </div>
              <span className="font-mono text-[9px] text-[#4ade80]">{improved_total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown toggle */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-[--surface2]"
        style={{ border: '1px solid var(--border)' }}
      >
        <span className="font-mono text-[9px] tracking-[2px] uppercase text-[--muted]">
          Category Breakdown
        </span>
        <span className="text-[--muted] text-xs">{showBreakdown ? '▲' : '▼'}</span>
      </button>

      {/* Breakdown bars */}
      {showBreakdown && (
        <div className="mt-3 space-y-2.5">
          {Object.entries(breakdown).map(([key, item]) => {
            const itemPct = (item.score / item.max) * 100
            const itemCfg = itemPct >= 80 ? GRADE_CONFIG.Excellent :
                            itemPct >= 60 ? GRADE_CONFIG.Good :
                            itemPct >= 40 ? GRADE_CONFIG.Fair :
                            itemPct >= 20 ? GRADE_CONFIG.Poor : GRADE_CONFIG.Critical
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm w-5">{CATEGORY_ICONS[item.label]}</span>
                <span className="font-mono text-[10px] text-[--muted] w-20">{item.label}</span>
                <div className="flex-1 h-1.5 bg-[--border] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${itemPct}%`, background: itemCfg.color }}
                  />
                </div>
                <span className="font-mono text-[9px] w-8 text-right" style={{ color: itemCfg.color }}>
                  {item.score}/{item.max}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}