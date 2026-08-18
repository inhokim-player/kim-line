import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import LandingPage from './components/landing/LandingPage'
import { hasAnyLog } from './lib/localStore'

export default function App() {
  const [mode, setMode] = useState('loading') // loading | landing | dashboard
  const [pendingResult, setPendingResult] = useState(null)

  useEffect(() => {
    setMode(hasAnyLog() ? 'dashboard' : 'landing')
  }, [])

  function handleQuizResult(result) {
    setPendingResult(result)
    setMode('dashboard')
  }

  if (mode === 'loading') return null

  if (mode === 'dashboard') {
    return (
      <Dashboard
        initialResult={pendingResult}
        onExitToLanding={() => {
          setPendingResult(null)
          setMode('landing')
        }}
      />
    )
  }

  return <LandingPage onQuizResult={handleQuizResult} />
}
