import { useEffect, useRef, useState } from 'react'
import { riskTier } from '../lib/riskCalculator'

// 0~100 리스크 점수를 원형 링으로 표현.
// 점수가 바뀔 때마다 링과 숫자가 부드럽게 애니메이션되어
// "살아있는" 지표라는 컨셉을 시각적으로 전달합니다.
export default function RiskGauge({ riskScore, premium, discountPct }) {
  const [displayScore, setDisplayScore] = useState(riskScore)
  const [displayPremium, setDisplayPremium] = useState(premium)
  const raf = useRef(null)

  useEffect(() => {
    const startScore = displayScore
    const startPremium = displayPremium
    const startTime = performance.now()
    const duration = 600

    function tick(now) {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayScore(Math.round(startScore + (riskScore - startScore) * eased))
      setDisplayPremium(Math.round(startPremium + (premium - startPremium) * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskScore, premium])

  const tier = riskTier(displayScore)
  const isSafe = tier.tone === 'pulse'
  const ringColor = isSafe ? '#0F9D82' : '#E85D4E'

  const radius = 88
  const circumference = 2 * Math.PI * radius
  const progress = displayScore / 100
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#E5E8EB" strokeWidth="14" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke 400ms ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular font-mono text-5xl font-semibold text-ink">{displayScore}</span>
          <span className="mt-1 text-xs text-subink">리스크 점수</span>
          <span
            className="mt-3 px-3 py-1 rounded-pill text-xs font-medium"
            style={{
              backgroundColor: isSafe ? '#EAF7F3' : '#FBE4DF',
              color: isSafe ? '#0C7E69' : '#C7412F'
            }}
          >
            {tier.label}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-subink">오늘의 예상 보험료</p>
        <p className="tabular font-mono text-3xl font-bold text-ink mt-1">
          ₩{displayPremium.toLocaleString()}
        </p>
        {discountPct !== 0 && (
          <p className={`mt-1 text-sm font-medium ${discountPct > 0 ? 'text-pulse-600' : 'text-alert-500'}`}>
            {discountPct > 0 ? `기준가 대비 ${discountPct}% 할인` : `기준가 대비 ${Math.abs(discountPct)}% 할증`}
          </p>
        )}
      </div>
    </div>
  )
}
