import { useState } from 'react'
import InputForm from './components/InputForm'
import LoadingScreen from './components/LoadingScreen'
import Results from './components/Results'

// In dev: Vite proxy forwards /analyze → localhost:8000
// In prod: VITE_API_URL = https://your-backend.up.railway.app
const API_BASE = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [phase, setPhase] = useState('form') // 'form' | 'loading' | 'results'
  const [data, setData]   = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(formData) {
    setPhase('loading')
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        let detail = `Server error ${res.status}`
        try { detail = (await res.json()).detail || detail } catch {}
        throw new Error(detail)
      }
      const result = await res.json()
      setData(result)
      setPhase('results')
    } catch (e) {
      setError(e.message)
      setPhase('form')
    }
  }

  return (
    <div className="min-h-screen relative z-10">
      {phase === 'form'    && <InputForm    onSubmit={handleSubmit} error={error} />}
      {phase === 'loading' && <LoadingScreen />}
      {phase === 'results' && <Results      data={data} onReset={() => { setData(null); setPhase('form') }} />}
    </div>
  )
}