import { useEffect, useState } from 'react'
import { OVERVIEW, INJURY_STATS, DISEASE_INCIDENCE, TOP_CAUSES } from '../../lib/nationalStats'
import { formatKstClock } from '../../lib/kst'
import { computeLivePace } from '../../lib/livePace'
import ShieldIcon from '../ShieldIcon'

function useLivePace(annualValue) {
  const [count, setCount] = useState(() => computeLivePace(annualValue))

  useEffect(() => {
    const tick = () => setCount(computeLivePace(annualValue))
    const id = setInterval(tick, 1000)
    // 탭이 백그라운드에 있다가 돌아오면 setInterval이 지연될 수 있으므로
    // 화면이 다시 보이는 즉시 한 번 더 재계산해 정확한 값으로 맞춘다
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [annualValue])

  return count
}

function useKstClock() {
  const [clock, setClock] = useState(formatKstClock())
  useEffect(() => {
    const id = setInterval(() => setClock(formatKstClock()), 1000)
    return () => clearInterval(id)
  }, [])
  return clock
}

export default function Hero({ onStartQuiz }) {
  const deaths = useLivePace(OVERVIEW.totalDeaths)
  const traffic = useLivePace(INJURY_STATS.trafficDeaths)
  const cancer = useLivePace(DISEASE_INCIDENCE.newCancerCases)
  const clock = useKstClock()
  const maxRate = Math.max(...TOP_CAUSES.map((c) => c.ratePer100k || 0), 1)
  const topSix = TOP_CAUSES.slice(0, 6)

  return (
    <section className="relative bg-navy-950 text-white overflow-hidden min-h-screen flex flex-col">
      <div className="absolute inset-0 grid-lines" aria-hidden="true" />

      <nav className="relative flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-7" />
          <span className="font-display font-bold text-sm">RiskNow</span>
        </div>
        <button
          onClick={onStartQuiz}
          className="rounded-lg bg-shield-500 hover:bg-shield-600 transition text-white text-sm font-medium px-4 py-2"
        >
          진단하기
        </button>
      </nav>

      <div className="relative flex-1 max-w-5xl mx-auto px-6 pb-10 w-full flex flex-col justify-center">
        <div className="text-center mb-10">
          <p className="tabular font-mono text-xs text-white/40 mb-2 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
            </span>
            {clock} KST · 실시간 자동 갱신 중
          </p>
          <h1 className="font-display text-xl md:text-2xl font-bold leading-snug mb-2">
            오늘, 대한민국에서
          </h1>
          <p className="tabular font-mono text-5xl md:text-7xl font-bold text-coral-500 my-3 tracking-tight">
            {deaths.toLocaleString()}
          </p>
          <p className="text-white/70 text-sm mb-2">
            명이 사망했을 것으로 추정돼요 <span className="text-white/40">(한국시간 자정 이후 누적 페이스)</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-card border border-navy-border bg-navy-900 p-5">
            <p className="text-xs text-white/50 mb-4">국내 사망원인 상위 6개 (10만명당)</p>
            <div className="space-y-3">
              {topSix.map((c) => (
                <div key={c.rank}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{c.rank}. {c.name}</span>
                    <span className="tabular text-white/50">{c.ratePer100k ? `${c.ratePer100k}명` : ''}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-shield-glow"
                      style={{ width: c.ratePer100k ? `${(c.ratePer100k / maxRate) * 100}%` : `${(7 - c.rank) * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-card border border-navy-border bg-navy-900 p-5 flex flex-col justify-center">
              <p className="text-xs text-white/50 mb-1">교통사고 사망 추정</p>
              <p className="tabular font-mono text-2xl font-bold">{traffic.toLocaleString()}</p>
            </div>
            <div className="rounded-card border border-navy-border bg-navy-900 p-5 flex flex-col justify-center">
              <p className="text-xs text-white/50 mb-1">신규 암 발생 추정</p>
              <p className="tabular font-mono text-2xl font-bold">{cancer.toLocaleString()}</p>
            </div>
            <div className="col-span-2 rounded-card border border-shield-500/30 bg-shield-500/10 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">내 리스크는 몇 점일까요?</p>
                <p className="text-xs text-white/50 mt-0.5">8개 질문, 1분이면 충분해요</p>
              </div>
              <button
                onClick={onStartQuiz}
                className="rounded-lg bg-white text-navy-950 text-sm font-medium px-4 py-2 whitespace-nowrap"
              >
                진단하기
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40 max-w-lg mx-auto text-center leading-relaxed">
          실시간 관측 데이터가 아니라, 통계청 연간 공식 통계를 한국시간(KST) 기준 하루·초
          단위로 균등하게 나눈 추정 페이스입니다. 실제 사고·질병 발생은 시간대·계절에 따라
          다르게 분포해요.
        </p>
      </div>

      <div className="relative flex justify-center pb-6 text-white/30 text-xs">
        <span>스크롤해서 더 보기 ↓</span>
      </div>
    </section>
  )
}
