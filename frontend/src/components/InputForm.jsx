import { useState } from 'react'

const FIELDS = {
  transport: [
    ['personal car (daily)', '🚗 Personal car (daily)'],
    ['motorcycle (daily)', '🏍 Motorcycle (daily)'],
    ['public transport (daily)', '🚌 Public transport (daily)'],
    ['mix of car and public transit', '🔀 Mix of car & transit'],
    ['mostly walking or cycling', '🚶 Walking / cycling'],
    ['ride-sharing services', '🚕 Ride-sharing'],
  ],
  diet: [
    ['heavy meat-eater (daily beef/lamb)', '🥩 Heavy meat-eater'],
    ['regular meat-eater (chicken/pork daily)', '🍗 Regular meat-eater'],
    ['flexitarian (meat 2–3x/week)', '🥗 Flexitarian'],
    ['vegetarian', '🥦 Vegetarian'],
    ['vegan', '🌱 Vegan'],
  ],
  electricity: [
    ['very high (above 500 units/month)', '🔴 Very high (500+ units/mo)'],
    ['high (300–500 units/month)', '🟠 High (300–500 units/mo)'],
    ['moderate (150–300 units/month)', '🟡 Moderate (150–300 units/mo)'],
    ['low (under 150 units/month)', '🟢 Low (<150 units/mo)'],
  ],
  ac_usage: [
    ['heavy (18+ hours/day in summer)', '🥵 Heavy (18+ hrs/day)'],
    ['moderate (8–12 hours/day in summer)', '😓 Moderate (8–12 hrs/day)'],
    ['occasional (nights or peak hours only)', '🌙 Occasional (nights/peak)'],
    ['rarely or no AC', '✅ Rarely or no AC'],
  ],
  flights: [
    ['more than 6 flights per year', '✈️ More than 6/year'],
    ['3–6 flights per year', '✈️ 3–6/year'],
    ['1–2 flights per year', '✈️ 1–2/year'],
    ['no flights', '🚫 No flights'],
  ],
}

const FORM_FIELDS = [
  { key: 'transport',   label: 'Primary Transport',   icon: '🚗' },
  { key: 'diet',        label: 'Diet Type',            icon: '🥩' },
  { key: 'electricity', label: 'Electricity Usage',    icon: '⚡' },
  { key: 'ac_usage',   label: 'AC Usage',             icon: '❄️' },
]

function SelectField({ fieldKey, label, value, onChange }) {
  const isFilled = !!value
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-[2px] uppercase text-[--muted]">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={e => onChange(fieldKey, e.target.value)}
          className={`
            w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none cursor-pointer
            border transition-all duration-200 appearance-none
            bg-[--surface2]
            ${isFilled
              ? 'border-[#2a3a28] text-[--text]'
              : 'border-[--border] text-[--muted]'}
            focus:border-[--fire] focus:bg-[#161e14]
            hover:border-[#2e3e2c]
          `}
        >
          <option value="">Select…</option>
          {FIELDS[fieldKey].map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        {/* Custom arrow */}
        <div className={`
          absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
          transition-colors duration-200
          ${isFilled ? 'text-[--fire]' : 'text-[--dim]'}
        `}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* Fill indicator dot */}
        {isFilled && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-[--fire] opacity-60" />
        )}
      </div>
    </div>
  )
}

export default function InputForm({ onSubmit, error }) {
  const [form, setForm] = useState({
    city: '', transport: '', diet: '', electricity: '', ac_usage: '', flights: ''
  })
  const [loading, setLoading] = useState(false)
  const [cityFocused, setCityFocused] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filledCount = Object.values(form).filter(Boolean).length
  const totalFields = 6
  const progress = (filledCount / totalFields) * 100
  const allFilled = filledCount === totalFields

  async function submit(e) {
    e.preventDefault()
    if (!allFilled || loading) return
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[--bg]/90 backdrop-blur-md border-b border-[--border] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[--fire] to-[#c94c12] flex items-center justify-center text-sm">🌍</div>
            <span className="font-serif text-base text-[--text]">
              Carbon<span className="text-[--fire]">Mirror</span>
            </span>
          </div>
          {/* Progress pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalFields }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < filledCount
                    ? 'w-4 bg-[--fire]'
                    : 'w-1.5 bg-[--border]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 pb-24">
        {/* Hero */}
        <div className="mb-8 anim-fadeup">
          <div className="font-mono text-[9px] tracking-[3px] uppercase text-[--muted] mb-3">
            Climate Intelligence System
          </div>
          <h1 className="font-serif text-[clamp(2rem,7vw,2.8rem)] leading-[1.1] tracking-tight text-[--text] mb-3">
            See your{' '}
            <span
              className="text-[--ember]"
              style={{
                background: 'linear-gradient(90deg, #f5a623, #e85d1a, #f5a623)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease infinite',
              }}
            >
              climate future
            </span>
            <br />before it arrives.
          </h1>
          <p className="text-[--muted] text-sm leading-relaxed">
            Enter your lifestyle below. CarbonMirror will simulate two versions of 2040 — one where nothing changes, and one where you do.
          </p>
        </div>

        <form onSubmit={submit} className="anim-fadeup" style={{ animationDelay: '0.12s' }}>
          {/* City */}
          <div className="mb-4">
            <label className="font-mono text-[10px] tracking-[2px] uppercase text-[--muted] block mb-1.5">
              📍 City / Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Delhi, Mumbai, Bangalore…"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                onFocus={() => setCityFocused(true)}
                onBlur={() => setCityFocused(false)}
                className={`
                  w-full rounded-xl px-4 py-3 text-sm outline-none
                  bg-[--surface2] border transition-all duration-200
                  placeholder:text-[--dim] text-[--text]
                  ${cityFocused || form.city
                    ? 'border-[--fire] bg-[#161e14]'
                    : 'border-[--border]'}
                `}
              />
              {form.city && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-[--fire] opacity-60" />
              )}
            </div>
          </div>

          {/* 2-col grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {FORM_FIELDS.map(({ key, label }) => (
              <SelectField
                key={key}
                fieldKey={key}
                label={label}
                value={form[key]}
                onChange={set}
              />
            ))}
          </div>

          {/* Flights full width */}
          <div className="mb-5">
            <SelectField
              fieldKey="flights"
              label="✈️ Flights Per Year"
              value={form.flights}
              onChange={set}
            />
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono text-[9px] tracking-widest uppercase text-[--dim]">
                Profile complete
              </span>
              <span className={`font-mono text-[9px] tracking-wide transition-colors duration-300 ${allFilled ? 'text-[--green]' : 'text-[--muted]'}`}>
                {filledCount}/{totalFields}
              </span>
            </div>
            <div className="h-0.5 bg-[--border] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: allFilled
                    ? 'linear-gradient(90deg, #4ade80, #2dd4bf)'
                    : 'linear-gradient(90deg, #e85d1a, #f5a623)',
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 font-mono text-xs leading-relaxed">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!allFilled || loading}
            className={`
              relative w-full py-4 px-6 rounded-xl font-semibold text-sm tracking-wide
              transition-all duration-200 overflow-hidden
              ${allFilled && !loading
                ? 'bg-gradient-to-r from-[--fire] to-[#c94c12] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(232,93,26,0.4)] active:translate-y-0'
                : 'bg-[--surface2] border border-[--border] text-[--dim] cursor-not-allowed'}
            `}
          >
            {/* Shimmer on active */}
            {allFilled && !loading && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
            )}
            <span className="relative">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31" strokeDashoffset="10"/>
                    </svg>
                    Simulating…
                  </span>
                : allFilled ? '🔍 Simulate My Climate Future' : 'Complete all fields to continue'}
            </span>
          </button>
        </form>
      </div>

      <footer className="text-center font-mono text-[8px] tracking-widest uppercase text-[--dim] pb-6">
        CarbonMirror · AI Climate Simulation · Not policy advice
      </footer>
    </div>
  )
}