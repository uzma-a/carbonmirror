import { useEffect, useState } from 'react'

const STEPS = [
  { icon: '🗺', text: "Mapping your location's climate data" },
  { icon: '📊', text: 'Analyzing your emission sources' },
  { icon: '🔥', text: 'Simulating 2040 — the path of no change' },
  { icon: '🌱', text: 'Simulating 2040 — the path you choose' },
  { icon: '⚡', text: 'Generating your personalized action plan' },
  { icon: '🪞', text: 'Finalizing your climate mirror' },
]

function OrbitRing({ size, duration, opacity, delay = 0 }) {
  return (
    <div
      className="absolute rounded-full border border-[--fire]"
      style={{
        width: size, height: size,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        animation: `spinSlow ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export default function LoadingScreen() {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState(1)
  const [globeVisible, setGlobeVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setGlobeVisible(true), 100)
    const stepT = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 1900)
    const dotT  = setInterval(() => setDots(d => d >= 3 ? 1 : d + 1), 450)
    return () => { clearInterval(stepT); clearInterval(dotT) }
  }, [])

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Globe + orbit rings */}
      <div
        className={`relative mb-10 transition-all duration-700 ${globeVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ width: 120, height: 120 }}
      >
        <OrbitRing size={120} duration={12} opacity={0.15} />
        <OrbitRing size={90}  duration={8}  opacity={0.25} delay={-2} />
        <OrbitRing size={64}  duration={5}  opacity={0.35} delay={-1} />

        {/* Pulsing glow */}
        <div
          className="absolute inset-0 rounded-full pulse-ring"
          style={{ background: 'radial-gradient(circle, rgba(232,93,26,0.08), transparent 70%)' }}
        />

        {/* Globe */}
        <div className="absolute inset-0 flex items-center justify-center float-globe">
          <span style={{ fontSize: 40 }}>🌍</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-serif text-[clamp(1.5rem,5vw,2rem)] text-[--text] text-center mb-1">
        Simulating your 2040{'.'.repeat(dots)}
      </h2>
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-[--muted] text-center mb-10">
        Climate Intelligence Engine Active
      </p>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-2 mb-8">
        {STEPS.map((s, i) => {
          const done    = i < step
          const current = i === step
          const future  = i > step
          return (
            <div
              key={i}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl
                transition-all duration-400
                ${current ? 'bg-[--surface2] border border-[--border]' : ''}
                ${future ? 'opacity-20' : done ? 'opacity-45' : ''}
              `}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className={`text-base flex-shrink-0 transition-all duration-300 ${current ? 'scale-110' : 'scale-100'}`}>
                {done ? '✓' : s.icon}
              </span>
              <span className={`font-mono text-[11px] tracking-wide transition-colors duration-300 ${
                done    ? 'text-[--green]' :
                current ? 'text-[--text]' :
                          'text-[--dim]'
              }`}>
                {s.text}
              </span>
              {current && (
                <div className="ml-auto flex gap-0.5">
                  {[0,1,2].map(d => (
                    <div
                      key={d}
                      className="w-1 h-1 rounded-full bg-[--fire]"
                      style={{ animation: `pulseRing 1s ease-in-out ${d * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-px bg-[--border] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #e85d1a, #f5a623, #4ade80)',
              backgroundSize: '300% 100%',
              animation: 'gradientShift 2s ease infinite',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[8px] tracking-widest uppercase text-[--dim]">Analyzing</span>
          <span className="font-mono text-[8px] tracking-widest uppercase text-[--dim]">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}