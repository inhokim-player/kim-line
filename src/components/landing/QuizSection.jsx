import { useState } from 'react'
import { QUIZ_QUESTIONS, aggregateAnswers, buildArchetype, analyzeTraits } from '../../lib/riskTypes'
import { computeRiskScore, computePremium } from '../../lib/riskCalculator'

const BASE_PREMIUM = 85000

export default function QuizSection({ onFinish }) {
  const [step, setStep] = useState(0) // 0 intro, 1..8 questions, 9 result
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  function choose(q, value) {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)

    if (step >= QUIZ_QUESTIONS.length) {
      const metrics = aggregateAnswers(QUIZ_QUESTIONS, next)
      const archetype = buildArchetype(metrics)
      setResult({ metrics, archetype })
      setStep(QUIZ_QUESTIONS.length + 1)
    } else {
      setStep(step + 1)
    }
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  async function share() {
    if (!result) return
    const { riskScore } = computeRiskScore(result.metrics)
    const { premium } = computePremium(BASE_PREMIUM, riskScore)
    const text = `[RiskNow 리스크 유형 테스트]\n${result.archetype.emoji} ${result.archetype.name} · ${result.archetype.subtitle}\n리스크 점수 ${riskScore}점 · 예상 보험료 ₩${premium.toLocaleString()}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  }

  return (
    <section id="quiz" className="bg-surface py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-md mx-auto">
        {step === 0 && (
          <div className="text-center">
            <p className="text-xs font-medium text-pulse-600 mb-2 tracking-wide">리스크 유형 테스트</p>
            <h2 className="font-display text-2xl font-bold text-ink mb-3">내 리스크 유형은?</h2>
            <p className="text-subink text-sm leading-relaxed mb-8">
              8개의 질문으로 생활 습관을 분석해서
              <br />
              리스크 유형과 예상 보험료를 알려드려요
            </p>
            <button
              onClick={() => setStep(1)}
              className="rounded-xl bg-ink text-white px-8 py-3.5 font-medium hover:bg-pulse-600 transition"
            >
              테스트 시작하기
            </button>
            <p className="mt-3 text-xs text-subink">약 1분 소요 · 결과는 저장되지 않아요</p>
          </div>
        )}

        {step >= 1 && step <= QUIZ_QUESTIONS.length && (
          <div>
            <div className="flex gap-1.5 mb-6">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ backgroundColor: i < step ? '#0F9D82' : '#E5E8EB' }}
                />
              ))}
            </div>
            <p className="text-xs text-subink mb-2">{step} / {QUIZ_QUESTIONS.length}</p>
            <h3 className="font-display text-xl font-bold text-ink mb-6">
              {QUIZ_QUESTIONS[step - 1].text}
            </h3>
            <div className="space-y-3">
              {QUIZ_QUESTIONS[step - 1].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => choose(QUIZ_QUESTIONS[step - 1], opt.value)}
                  className="w-full text-left rounded-card border border-line px-5 py-4 hover:border-pulse-500 hover:bg-pulse-50 transition"
                >
                  <span className="font-medium text-ink">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === QUIZ_QUESTIONS.length + 1 && result && (
          <ResultCard
            result={result}
            copied={copied}
            onShare={share}
            onRestart={restart}
            onEnter={() => onFinish?.(result)}
          />
        )}
      </div>
    </section>
  )
}

function ResultCard({ result, copied, onShare, onRestart, onEnter }) {
  const { riskScore } = computeRiskScore(result.metrics)
  const { premium, discountPct } = computePremium(BASE_PREMIUM, riskScore)
  const isSafe = riskScore <= 50
  const analysis = analyzeTraits(result.metrics)

  return (
    <div>
      <div
        className="rounded-card overflow-hidden"
        style={{ backgroundColor: isSafe ? '#EAF7F3' : '#FBE4DF' }}
      >
        <div className="px-6 pt-8 pb-6 text-center">
          <p className="text-xs font-medium text-subink mb-3 tracking-wide">YOUR RISK TYPE</p>
          <div className="text-5xl mb-3">{result.archetype.emoji}</div>
          <h3 className="font-display text-2xl font-bold text-ink">{result.archetype.name}</h3>
          <p className="mt-1 text-sm text-subink">{result.archetype.subtitle}</p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/70 text-xs font-mono tabular text-ink">
            {result.archetype.code}
          </span>
        </div>
      </div>

      <p className="text-sm text-ink leading-relaxed mt-5">{result.archetype.description}</p>

      <div className="flex gap-3 mt-5">
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
        <p className={`mt-2 text-center text-xs font-medium ${discountPct > 0 ? 'text-pulse-600' : 'text-coral-500'}`}>
          {discountPct > 0 ? `기준가 대비 ${discountPct}% 할인 적용` : `기준가 대비 ${Math.abs(discountPct)}% 할증`}
        </p>
      )}

      <div className="rounded-card bg-canvas p-5 mt-6">
        <h3 className="font-display font-semibold text-ink mb-1">성향 분석</h3>
        <p className="text-xs text-subink mb-4">4개 축을 뜯어보면 이런 모습이에요</p>
        <div className="space-y-4 mb-5">
          {analysis.axes.map((a) => (
            <div key={a.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink flex items-center gap-1.5">
                  <span>{a.icon}</span>
                  {a.label}
                </span>
                <span className="tabular font-mono text-xs text-subink">{a.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${a.score}%`,
                    backgroundColor: a.tier === 'strength' ? '#0F9D82' : a.tier === 'growth' ? '#E85D4E' : '#CFEEE3'
                  }}
                />
              </div>
              <p className="text-xs text-subink leading-relaxed">{a.comment}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-medium text-ink mb-1">💡 지금 가장 신경 쓸 부분</p>
          <p className="text-xs text-subink leading-relaxed">{analysis.recommendation}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <button
          onClick={onEnter}
          className="w-full rounded-xl bg-pulse-500 text-white py-3.5 font-medium hover:bg-pulse-600 transition"
        >
          이 결과로 매일 관리 시작하기 →
        </button>
        <button
          onClick={onShare}
          className="w-full rounded-xl border border-line py-3 font-medium text-ink hover:bg-canvas transition"
        >
          {copied ? '복사됐어요 ✓' : '결과 복사해서 공유하기'}
        </button>
        <button
          onClick={onRestart}
          className="w-full rounded-xl text-subink py-2 text-sm hover:text-ink transition"
        >
          다시 테스트하기
        </button>
      </div>
    </div>
  )
}
