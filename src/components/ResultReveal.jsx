import { useState } from 'react'
import { computeRiskScore, computePremium, riskTier } from '../lib/riskCalculator'
import { weakBodyPartsDetailed } from '../lib/bodyInsuranceMap'

export default function ResultReveal({ metrics, basePremium, onContinue }) {
  const [copied, setCopied] = useState(false)
  const { riskScore } = computeRiskScore(metrics)
  const { premium, discountPct } = computePremium(basePremium, riskScore)
  const tier = riskTier(riskScore)
  const isSafe = tier.tone === 'pulse'
  const weakParts = weakBodyPartsDetailed(metrics)
  const categories = [...new Set(weakParts.flatMap((p) => p.insuranceCategories))]

  async function handleShare() {
    const text = `[RiskNow 리스크 진단]\n리스크 점수 ${riskScore}점 (${tier.label}) · 예상 보험료 ₩${premium.toLocaleString()}\n맞춤 보험 카테고리: ${categories.join(', ')}`
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
      <div className="w-full max-w-sm rounded-card bg-surface overflow-hidden">
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: isSafe ? '#EAF7F3' : '#FBE4DF' }}
        >
          <p className="text-xs font-medium text-subink mb-3 tracking-wide">RISK SCORE</p>
          <p className="tabular font-mono text-5xl font-bold text-ink mb-2">{riskScore}</p>
          <span
            className="inline-block px-3 py-1 rounded-pill text-xs font-medium"
            style={{
              backgroundColor: isSafe ? '#CFEEE3' : '#FBE4DF',
              color: isSafe ? '#0C7E69' : '#C7412F'
            }}
          >
            {tier.label}
          </span>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 rounded-xl bg-canvas p-3 text-center">
              <p className="text-xs text-subink">예상 보험료</p>
              <p className="tabular font-mono text-xl font-bold text-ink mt-0.5">
                ₩{premium.toLocaleString()}
              </p>
            </div>
          </div>
          {discountPct !== 0 && (
            <p className={`text-center text-xs font-medium mb-5 ${discountPct > 0 ? 'text-pulse-600' : 'text-alert-500'}`}>
              {discountPct > 0 ? `기준가 대비 ${discountPct}% 할인 적용` : `기준가 대비 ${Math.abs(discountPct)}% 할증`}
            </p>
          )}

          <h3 className="font-display font-semibold text-ink mb-1">주의가 필요한 부위</h3>
          <p className="text-xs text-subink mb-3">응답 기반으로 매칭한 신체부위와 보험 카테고리예요</p>
          <div className="space-y-3 mb-2">
            {weakParts.map((p) => (
              <div key={p.key} className="border-t border-line pt-3">
                <p className="text-sm text-ink flex items-center gap-1.5 mb-1">
                  <span>{p.icon || '⚕️'}</span>
                  {p.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.insuranceCategories.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2.5 py-1 rounded-full bg-shield-500/10 text-shield-600 border border-shield-500/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
