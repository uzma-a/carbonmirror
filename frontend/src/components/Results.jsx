import { useEffect, useRef, useState } from 'react'

/* ── helpers ─────────────────────────────────────────── */
function useVisible(delay = 0) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t) }, [delay])
  return v
}

function Tag({ children, variant }) {
  const styles = {
    emit: 'bg-red-900/15 border-red-800/30 text-red-400',
    risk: 'bg-amber-900/15 border-amber-700/25 text-amber-400',
    high: 'bg-red-900/15 border-red-800/30 text-red-400',
    medium: 'bg-amber-900/15 border-amber-700/25 text-amber-400',
    low:  'bg-emerald-900/15 border-emerald-800/20 text-emerald-400',
    easy: 'bg-teal-900/15 border-teal-800/20 text-teal-400',
    hard: 'bg-violet-900/15 border-violet-800/20 text-violet-400',
  }
  return (
    <span className={`inline-block font-mono text-[9px] tracking-wide px-2.5 py-1 rounded-full border ${styles[variant] || styles.medium}`}>
      {children}
    </span>
  )
}

function Reveal({ delay, children, className = '' }) {
  const v = useVisible(delay)
  return (
    <div className={`transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  )
}

/* Animated counter */
function Counter({ target, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round(p * p * target))
      if (p < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [target, duration])
  return <>{val.toLocaleString()}{suffix}</>
}

/* ── Impact bar ──────────────────────────────────────── */
function ImpactItem({ text, color, delay }) {
  const v = useVisible(delay)
  return (
    <li className="flex items-start gap-3 group">
      <div className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 transition-all duration-500 ${v ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-xs leading-relaxed" style={{ color: color + 'aa' }}>{text}</span>
    </li>
  )
}

/* ── Future Card ─────────────────────────────────────── */
function FutureCard({ data, variant, delay, items, itemKey }) {
  const v = useVisible(delay)
  const isA = variant === 'a'

  const cfg = isA
    ? {
        bg: 'linear-gradient(150deg, #1c0e08, #110a06)',
        border: 'rgba(232,93,26,0.35)',
        glow: 'rgba(232,93,26,0.06)',
        yearColor: '#e85d1a',
        label: 'PATH A · NO CHANGE',
        labelColor: 'rgba(232,93,26,0.55)',
        dotColor: '#e85d1a',
      }
    : {
        bg: 'linear-gradient(150deg, #091510, #060f0c)',
        border: 'rgba(74,222,128,0.22)',
        glow: 'rgba(74,222,128,0.05)',
        yearColor: '#4ade80',
        label: 'PATH B · YOU CHANGE',
        labelColor: 'rgba(74,222,128,0.5)',
        dotColor: '#4ade80',
      }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: v && isA ? '0 0 40px rgba(232,93,26,0.08)' : 'none',
        transition: 'opacity 0.7s, transform 0.7s, box-shadow 1s',
      }}
    >
      {/* Corner glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)` }} />

      {/* Scanline effect on A */}
      {isA && v && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 right-0 h-px opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${cfg.yearColor}, transparent)`,
              animation: 'scanline 3s linear infinite',
            }} />
        </div>
      )}

      <div className="p-5 sm:p-6 relative">
        <div className="font-mono text-[8px] tracking-[3px] uppercase mb-1" style={{ color: cfg.labelColor }}>
          {cfg.label}
        </div>
        <div className="font-serif leading-none mb-1.5" style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)', color: cfg.yearColor }}>
          2040
        </div>
        <h3 className="font-serif text-lg sm:text-xl text-[--text] mb-3 leading-snug">{data.title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: isA ? '#8a7870' : '#78907a' }}>
          {data.narrative}
        </p>
        <ul className="space-y-2.5">
          {(data[itemKey] || []).map((item, i) => (
            <ImpactItem key={i} text={item} color={cfg.dotColor} delay={delay + 200 + i * 100} />
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── Action Card ─────────────────────────────────────── */
function ActionCard({ action, index, delay }) {
  const v = useVisible(delay)
  const impLvl = (action.impact_level || '').toLowerCase()
  const diff   = (action.difficulty   || '').toLowerCase()

  return (
    <div
      className={`
        flex gap-4 p-4 sm:p-5 rounded-xl border transition-all duration-500
        hover:border-[rgba(74,222,128,0.2)] hover:-translate-y-0.5 hover:shadow-lg
        ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg"
        style={{ background: 'rgba(74,222,128,0.08)', color: 'rgba(74,222,128,0.4)' }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-1.5 mb-2">
          <p className="text-sm font-medium text-[--text] leading-snug flex-1 min-w-0">{action.action}</p>
          <div className="flex gap-1 flex-shrink-0">
            <Tag variant={impLvl}>{action.impact_level}</Tag>
            <Tag variant={diff}>{action.difficulty}</Tag>
          </div>
        </div>
        <p className="text-xs text-[--muted] leading-relaxed">{action.reason}</p>
      </div>
    </div>
  )
}

/* ── Main Results ────────────────────────────────────── */
export default function Results({ data, onReset }) {
  const { profile, future_current_path: futA, future_improved_path: futB, recommended_actions: actions } = data
  const [copied, setCopied] = useState(false)

  function copyResults() {
    const text = `🌍 CarbonMirror — My 2040 Climate Simulation\n\n` +
      `📍 Profile: ${profile.lifestyle_summary}\n\n` +
      `🔥 Path A (No Change): ${futA.title}\n${futA.narrative}\n\n` +
      `🌱 Path B (I Change): ${futB.title}\n${futB.narrative}\n\n` +
      `⚡ Top Actions:\n` +
      actions.map((a, i) => `${i+1}. ${a.action}`).join('\n') +
      `\n\nSimulated at carbonmirror.app`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-[--bg]/90 backdrop-blur-md border-b border-[--border] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[--fire] to-[#c94c12] flex items-center justify-center text-sm">🌍</div>
            <span className="font-serif text-base text-[--text]">Carbon<span className="text-[--fire]">Mirror</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyResults}
              className="font-mono text-[9px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-lg border border-[--border] text-[--muted] hover:text-[--green] hover:border-[rgba(74,222,128,0.3)] transition-all duration-200"
            >
              {copied ? '✓ Copied!' : '⎘ Share'}
            </button>
            <button
              onClick={onReset}
              className="font-mono text-[9px] tracking-[1.5px] uppercase px-3 py-1.5 rounded-lg border border-[--border] text-[--muted] hover:text-[--text] transition-all duration-200"
            >
              ← New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4 py-7 pb-16 space-y-4">
        {/* Profile */}
        <Reveal delay={0}>
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(74,222,128,0.1)' }}>👤</div>
              <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-[--muted]">Your Lifestyle Profile</span>
            </div>
            <p className="text-sm leading-relaxed text-[--text] mb-4 opacity-90">{profile.lifestyle_summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.top_emission_sources?.map(s => <Tag key={s} variant="emit">{s}</Tag>)}
              {profile.risk_factors?.map(r => <Tag key={r} variant="risk">⚠ {r}</Tag>)}
            </div>
          </div>
        </Reveal>

        {/* Divider with label */}
        <Reveal delay={400}>
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-[--border]" />
            <span className="font-mono text-[8px] tracking-[3px] uppercase text-[--dim]">Your two futures</span>
            <div className="flex-1 h-px bg-[--border]" />
          </div>
        </Reveal>

        {/* Future A */}
        <FutureCard
          data={futA}
          variant="a"
          delay={600}
          items={futA.key_impacts}
          itemKey="key_impacts"
        />

        {/* VS badge */}
        <Reveal delay={1300}>
          <div className="flex items-center justify-center">
            <div className="font-mono text-[9px] tracking-[4px] uppercase px-4 py-1.5 rounded-full border border-[--border] text-[--dim]">
              or
            </div>
          </div>
        </Reveal>

        {/* Future B */}
        <FutureCard
          data={futB}
          variant="b"
          delay={1500}
          items={futB.benefits}
          itemKey="benefits"
        />

        {/* Actions */}
        <Reveal delay={2200}>
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(45,212,191,0.1)' }}>⚡</div>
              <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-[--muted]">Your Top 3 Actions</span>
            </div>
            <div className="space-y-3">
              {actions?.map((a, i) => (
                <ActionCard key={i} action={a} index={i} delay={2400 + i * 150} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={3000}>
          <div className="text-center pt-2 pb-4">
            <button
              onClick={onReset}
              className="font-mono text-[10px] tracking-[2px] uppercase text-[--muted] hover:text-[--fire] transition-colors duration-200"
            >
              ← Run another simulation
            </button>
          </div>
        </Reveal>
      </div>

      <footer className="text-center font-mono text-[8px] tracking-widest uppercase text-[--dim] pb-6">
        CarbonMirror · AI Climate Simulation · Not policy advice
      </footer>
    </div>
  )
}