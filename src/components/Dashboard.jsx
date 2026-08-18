import { useEffect, useMemo, useRef, useState } from 'react'
import { computeRiskScore, computePremium } from '../lib/riskCalculator'
import { buildArchetype, analyzeTraits } from '../lib/riskTypes'
import { kstDateISO } from '../lib/kst'
import {
  getProfile,
  getLog,
  upsertLog,
  getRecentLogs,
  hasAnyLog,
  clearAllData
} from '../lib/localStore'
import RiskGauge from './RiskGauge'
import DailyLogForm from './DailyLogForm'
import RewardBadge from './RewardBadge'
import PremiumTrend from './PremiumTrend'
import TraitAnalysis from './TraitAnalysis'
import Quiz from './Quiz'
import DailyCheckin from './DailyCheckin'
import ResultReveal from './ResultReveal'
import NationalStats from './NationalStats'

const DEFAULT_LOG = {
  sleep_hours: 7,
  exercise_minutes: 20,
  driving_score: 70,
  diet_score: 70,
  stress_level: 30
}

export default function Dashboard({ onExitToLanding, initialResult }) {
  const [mode, setMode] = useState('loading') // loading | onboarding | checkin | reveal | dashboard | stats
  const [values, setValues] = useState(DEFAULT_LOG)
  const [basePremium, setBasePremium] = useState(85000)
  const [yesterdayScore, setYesterdayScore] = useState(null)
  const [history, setHistory] = useState([])
  const [revealData, setRevealData] = useState(null)
  const [showFineTune, setShowFineTune] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  const saveTimer = useRef(null)

  useEffect(() => {
    const profile = getProfile()
    const base = profile.base_premium ?? 85000
    setBasePremium(base)

    const todayLog = getLog(kstDateISO())
    const yestLog = getLog(kstDateISO(-1))
    if (yestLog) setYesterdayScore(computeRiskScore(yestLog).riskScore)

    const recentLogs = getRecentLogs(7)
    if (recentLogs.length) {
      const trend = recentLogs.map((log) => {
        const { riskScore } = computeRiskScore(log)
        const { premium } = computePremium(base, riskScore)
        return { date: log.log_date, premium }
      })
      setHistory(trend)
    }

    if (todayLog) {
      setValues({
        sleep_hours: todayLog.sleep_hours,
        exercise_minutes: todayLog.exercise_minutes,
        driving_score: todayLog.driving_score,
        diet_score: todayLog.diet_score,
        stress_level: todayLog.stress_level
      })
      setMode('dashboard')
    } else if (initialResult) {
      // 랜딩 페이지에서 방금 진단을 마치고 들어온 경우, 그 결과를 첫 기록으로 사용
      setValues(initialResult.metrics)
      upsertLog(kstDateISO(), initialResult.metrics)
      setRevealData(initialResult)
      setMode('reveal')
    } else if (!hasAnyLog()) {
      setMode('onboarding')
    } else {
      setMode('checkin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { riskScore } = useMemo(() => computeRiskScore(values), [values])
  const { premium, discountPct } = useMemo(
    () => computePremium(basePremium, riskScore),
    [basePremium, riskScore]
  )
  const todayArchetype = useMemo(() => buildArchetype(values), [values])
  const analysis = useMemo(() => analyzeTraits(values), [values])

  function persistLog(metrics) {
    upsertLog(kstDateISO(), metrics)
  }

  function handleQuizComplete({ metrics, archetype }) {
    setValues(metrics)
    persistLog(metrics)
    setRevealData({ metrics, archetype })
    setMode('reveal')
  }

  function handleCheckinComplete(metrics) {
    setValues(metrics)
    persistLog(metrics)
    setMode('dashboard')
  }

  function handleFineTuneChange(key, value) {
    const next = { ...values, [key]: value }
    setValues(next)

    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveState('saving')
    saveTimer.current = setTimeout(() => {
      persistLog(next)
      setSaveState('saved')
    }, 500)
  }

  function handleReset() {
    if (!window.confirm('이 브라우저에 저장된 모든 기록을 삭제할까요? 되돌릴 수 없어요.')) return
    clearAllData()
    onExitToLanding?.()
  }

  if (mode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <p className="text-subink text-sm">불러오는 중…</p>
      </div>
    )
  }

  if (mode === 'onboarding') {
    return <Quiz onComplete={handleQuizComplete} />
  }

  if (mode === 'checkin') {
    return <DailyCheckin onComplete={handleCheckinComplete} />
  }

  if (mode === 'reveal' && revealData) {
    return (
      <ResultReveal
        metrics={revealData.metrics}
        archetype={revealData.archetype}
        basePremium={basePremium}
        onContinue={() => setMode('dashboard')}
      />
    )
  }

  if (mode === 'stats') {
    return <NationalStats values={values} onBack={() => setMode('dashboard')} />
  }

  const displayHistory = history.some((h) => h.date === kstDateISO())
    ? history
    : [...history, { date: kstDateISO(), premium }]

  return (
    <div className="min-h-screen bg-canvas pb-16">
      <header className="px-6 pt-8 pb-2 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-ink">RiskNow</p>
          <p className="text-xs text-subink mt-0.5 tabular">{kstDateISO()} (KST) · 이 브라우저에만 저장돼요</p>
        </div>
        <button onClick={handleReset} className="text-xs text-subink hover:text-ink transition">
          기록 초기화
        </button>
      </header>

      <main className="px-6 mt-4 space-y-4 max-w-md mx-auto">
        <div className="rounded-card bg-surface shadow-card p-6 flex flex-col items-center">
          <span className="text-xs text-subink mb-4 flex items-center gap-1.5">
            <span>{todayArchetype.emoji}</span>
            오늘의 유형 · {todayArchetype.name}
          </span>
          <RiskGauge riskScore={riskScore} premium={premium} discountPct={discountPct} />
        </div>

        <RewardBadge yesterdayScore={yesterdayScore} todayScore={riskScore} />

        <TraitAnalysis analysis={analysis} />

        <button
          onClick={() => setMode('stats')}
          className="w-full rounded-card bg-surface shadow-card p-4 flex items-center justify-between hover:bg-canvas transition"
        >
          <span className="font-medium text-ink text-sm">📊 전국 통계와 비교하기</span>
          <span className="text-subink">→</span>
        </button>

        <button
          onClick={() => setMode('checkin')}
          className="w-full rounded-card bg-surface shadow-card p-4 flex items-center justify-between hover:bg-canvas transition"
        >
          <span className="font-medium text-ink text-sm">오늘 답변 다시 하기</span>
          <span className="text-subink">→</span>
        </button>

        <PremiumTrend history={displayHistory} />

        <div className="rounded-card bg-surface shadow-card overflow-hidden">
          <button
            onClick={() => setShowFineTune((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <span className="font-medium text-ink text-sm">세부 조정 (슬라이더)</span>
            <span
              className="text-subink transition-transform"
              style={{ transform: showFineTune ? 'rotate(180deg)' : 'none' }}
            >
              ⌄
            </span>
          </button>
          {showFineTune && (
            <div className="px-5 pb-5 -mt-1">
              <DailyLogForm values={values} onChange={handleFineTuneChange} />
            </div>
          )}
        </div>

        <p className="text-center text-xs text-subink pt-1">
          {saveState === 'saving' ? '저장 중…' : ' '}
        </p>
      </main>
    </div>
  )
}
