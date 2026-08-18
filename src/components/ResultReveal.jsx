import { useState } from 'react'
import { computeRiskScore, computePremium, riskTier } from '../lib/riskCalculator'
import { analyzeTraits } from '../lib/riskTypes'
import TraitAnalysis from './TraitAnalysis'

export default function ResultReveal({ metrics, archetype, basePremium, onContinue }) {
  const [copied, setCopied] = useState(false)
  const { riskScore } = computeRiskScore(metrics)
  const { premium, discountPct } = computePremium(basePremium, riskScore)
  const tier = riskTier(riskScore)
  const isSafe = tier.tone === 'pulse'
  const analysis = analyzeTraits(metrics)

  async function handleShare() {
    const text = `[RiskNow 리스크 유형 테스트]\n${archetype.emoji} ${archetype.name} · ${archetype.subtitle}\n리스크 점수 ${riskScore}점 · 예상 보험료 ₩${premium.toLocaleString()}\n${archetype.description}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-card bg-surface shadow-card overflow-hidden">
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: isSafe ? '#EAF7F3' : '#FBE4DF' }}
        >
          <p className="text-xs font-medium text-subink mb-3 tracking-wide">YOUR RISK TYPE</p>
          <div className="text-5xl mb-3">{archetype.emoji}</div>
          <h1 className="font-display text-2xl font-bold text-ink">{archetype.name}</h1>
          <p className="mt-1 text-sm text-subink">{archetype.subtitle}</p>
          <span className="inline-block mt-3 px-3 py-1 rounded-pill bg-white/70 text-xs font-mono tabular text-ink">
            {archetype.code}
          </span>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-ink leading-relaxed">{archetype.description}</p>

          <div className="mt-5 flex gap-3">
            <div className="flex-1 rounded-xl bg-canvas p-3 text-center">
              <p className="text-xs text-subink">리스크 점수</p>
              <p className="tabular font-mono text-xl font-bold text-ink mt-0.5">{riskScore}</p>
            </div>
            <div className="flex-1 rounded-xl bg-canvas p-3 text-center">
              <p className="text-xs text-subink">예상 보험료</p>
              <p className="tabular font-mono text-xl font-bold text-ink mt-0.5">
                ₩{Math.round(premium / 1000)}k
              </p>
            </div>
          </div>
          {discountPct !== 0 && (
            <p className={`mt-2 text-center text-xs font-medium ${discountPct > 0 ? 'text-pulse-600' : 'text-alert-500'}`}>
              {discountPct > 0 ? `기준가 대비 ${discountPct}% 할인 적용` : `기준가 대비 ${Math.abs(discountPct)}% 할증`}
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm mt-4">
        <TraitAnalysis analysis={analysis} />
      </div>

      <div className="w-full max-w-sm mt-5 space-y-2.5">
        <button
          onClick={handleShare}
          className="w-full rounded-xl border border-line bg-surface py-3 font-medium text-ink hover:bg-canvas transition"
        >
          {copied ? '복사됐어요 ✓' : '결과 복사해서 공유하기'}
        </button>
        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-ink text-white py-3 font-medium hover:bg-pulse-600 transition"
        >
          대시보드로 이동
        </button>
      </div>
    </div>
  )
}
