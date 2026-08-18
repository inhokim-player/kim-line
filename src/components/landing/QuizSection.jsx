import { useEffect, useRef, useState } from 'react'
import { QUIZ_QUESTIONS, aggregateAnswers } from '../../lib/riskTypes'
import { computeRiskScore, computePremium, riskTier } from '../../lib/riskCalculator'
import { topCauseForAge, AGE_BAND_META } from '../../lib/nationalStats'
import { weakBodyPartsDetailed } from '../../lib/bodyInsuranceMap'
import HealthSurvey from './HealthSurvey'

const BASE_PREMIUM = 85000

export default function QuizSection({ onFinish, onViewIn3D }) {
  const [step, setStep] = useState(0) // 0 intro+나이, 1..8 questions, 9 result
  const [age, setAge] = useState('')
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showHealthSurvey, setShowHealthSurvey] = useState(false)
  const [healthInsights, setHealthInsights] = useState(null)
  const answerLockRef = useRef(false)

  useEffect(() => {
    answerLockRef.current = false
  }, [step])

  function choose(q, value) {
    if (answerLockRef.current) return
    answerLockRef.current = true

    const next = { ...answers, [q.id]: value }
    setAnswers(next)

    if (step >= QUIZ_QUESTIONS.length) {
      const metrics = aggregateAnswers(QUIZ_QUESTIONS, next)
      setResult({ metrics, age: Number(age) })
      setStep(QUIZ_QUESTIONS.length + 1)
    } else {
      setStep(step + 1)
    }
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setResult(null)
    setHealthInsights(null)
  }

  async function share() {
    if (!result) return
    const { riskScore } = computeRiskScore(result.metrics)
    const { premium } = computePremium(BASE_PREMIUM, riskScore)
    const parts = weakBodyPartsDetailed(result.metrics)
    const cats = [...new Set(parts.flatMap((p) => p.insuranceCategories))]
    const text = `[RiskNow 리스크 진단]\n리스크 점수 ${riskScore}점 · 예상 보험료 ₩${premium.toLocaleString()}\n맞춤 보험 카테고리: ${cats.join(', ')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // 클립보드 접근 실패 시 조용히 무시
    }
  }

  const ageValid = Number(age) >= 1 && Number(age) <= 110

  return (
    <section id="quiz" className="bg-surface py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-md mx-auto">
        {step === 0 && (
          <div className="text-center">
            <p className="font-mono text-[11px] font-medium text-pulse-600 mb-2 tracking-widest uppercase">리스크 진단</p>
            <h2 className="font-display text-2xl font-bold text-ink mb-3">내 리스크 점수는?</h2>
            <p className="text-subink text-sm leading-relaxed mb-8">
              나이와 8개의 질문으로 생활 습관을 분석해서
              <br />
              리스크 점수, 예상 보험료, 맞춤 보험 카테고리를 알려드려요
            </p>

            <label className="block text-left text-sm font-medium text-ink mb-2" htmlFor="age">
              나이
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="110"
              inputMode="numeric"
              placeholder="예: 32"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full text-center text-lg border-b-2 border-line focus:border-shield-500 outline-none py-2 mb-6 bg-transparent"
            />

            <button
              onClick={() => setStep(1)}
              disabled={!ageValid}
              className="rounded-xl bg-ink text-white px-8 py-3.5 font-medium hover:bg-pulse-600 transition disabled:opacity-40"
            >
              테스트 시작하기
            </button>
            <p className="mt-3 text-xs text-subink">약 1분 소요 · 계정·로그인 없이 바로</p>
          </div>
        )}

        {step >= 1 && step <= QUIZ_QUESTIONS.length && (
          <div>
            <div className="flex gap-1.5 mb-6">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1"
                  style={{ backgroundColor: i < step ? '#0F9D82' : '#E5E8EB' }}
                />
              ))}
            </div>
            <p className="text-xs text-subink mb-2">{step} / {QUIZ_QUESTIONS.length}</p>
            <h3 className="font-display text-xl font-bold text-ink mb-6">
              {QUIZ_QUESTIONS[step - 1].text}
            </h3>
            <div className="space-y-2">
              {QUIZ_QUESTIONS[step - 1].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => choose(QUIZ_QUESTIONS[step - 1], opt.value)}
                  className="w-full text-left border-b border-line px-1 py-4 hover:border-shield-500 hover:pl-3 transition-all"
                >
                  <span className="font-medium text-ink">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === QUIZ_QUESTIONS.length + 1 && result && showHealthSurvey && (
          <HealthSurvey
            onFinish={(profile, insights) => {
              setHealthInsights(insights)
              setShowHealthSurvey(false)
            }}
          />
        )}

        {step === QUIZ_QUESTIONS.length + 1 && result && !showHealthSurvey && (
          <ResultCard
            result={result}
            copied={copied}
            onShare={share}
            onRestart={restart}
            onEnter={() => onFinish?.(result)}
            onViewIn3D={onViewIn3D}
            healthInsights={healthInsights}
            onStartHealthSurvey={() => setShowHealthSurvey(true)}
          />
        )}
      </div>
    </section>
  )
}

function ResultCard({ result, copied, onShare, onRestart, onEnter, onViewIn3D, healthInsights, onStartHealthSurvey }) {
  const { riskScore } = computeRiskScore(result.metrics)
  const { premium, discountPct } = computePremium(BASE_PREMIUM, riskScore)
  const tier = riskTier(riskScore)
  const isSafe = tier.tone === 'pulse'
  const ageTopCause = result.age ? topCauseForAge(result.age) : null
  const weakParts = weakBodyPartsDetailed(result.metrics)

  const categories = new Set(weakParts.flatMap((p) => p.insuranceCategories))
  if (ageTopCause?.cause.includes('암')) categories.add('암보험')
  if (ageTopCause?.cause.includes('자해')) categories.add('정신건강 특약')
  if (healthInsights) healthInsights.categories.forEach((c) => categories.add(c))

  return (
    <div>
      <div style={{ backgroundColor: isSafe ? '#EAF7F3' : '#FBE4DF' }} className="px-6 pt-8 pb-6 text-center">
        <p className="text-xs font-medium text-subink mb-3 tracking-wide">RISK SCORE</p>
        <p className="tabular font-mono text-5xl font-bold text-ink mb-2">{riskScore}</p>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: isSafe ? '#0C7E69' : '#C7412F' }}
        >
          {tier.label}
        </span>
      </div>

      <div className="flex gap-6 mt-5 border-b border-line pb-4">
        <div className="flex-1 text-center">
          <p className="text-xs text-subink">예상 보험료</p>
          <p className="tabular font-mono text-xl font-bold text-ink mt-0.5">
            ₩{premium.toLocaleString()}
          </p>
        </div>
      </div>
      {discountPct !== 0 && (
        <p className={`mt-2 text-center text-xs font-medium ${discountPct > 0 ? 'text-pulse-600' : 'text-coral-500'}`}>
          {discountPct > 0 ? `기준가 대비 ${discountPct}% 할인 적용` : `기준가 대비 ${Math.abs(discountPct)}% 할증`}
        </p>
      )}

      {ageTopCause && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-xs font-medium text-subink mb-1">{result.age}세 연령대 사망원인 1위</p>
          <p className="text-sm text-ink">{ageTopCause.cause}</p>
          <p className="text-xs text-subink mt-1">출처: {AGE_BAND_META.source}</p>
        </div>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-ink">주의가 필요한 부위</h3>
          {onViewIn3D && (
            <button
              onClick={() => onViewIn3D(weakParts.map((p) => p.key))}
              className="text-xs text-shield-600 hover:text-shield-500 font-medium transition"
            >
              3D로 보기 →
            </button>
          )}
        </div>
        <p className="text-xs text-subink mb-4">응답 기반으로 매칭한 신체부위예요</p>
        <div className="space-y-3">
          {weakParts.map((p) => (
            <div key={p.key} className="border-t border-line pt-3">
              <p className="text-sm text-ink flex items-center gap-1.5 mb-1.5">
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

      <div className="mt-6 border-t border-line pt-5">
        <h3 className="font-display font-semibold text-ink mb-1">맞춤 보험 카테고리 종합</h3>
        <p className="text-xs text-subink mb-3">
          {healthInsights
            ? '생활습관 + 건강 정보를 함께 반영한 결과예요.'
            : '지금은 생활습관만 반영한 결과예요. 기존 질환·가족력까지 입력하면 더 정교해져요.'}{' '}
          특정 보험사 상품이 아니라 국내에 일반적으로 존재하는 카테고리예요.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[...categories].map((c) => (
            <span
              key={c}
              className="text-sm px-3 py-1.5 rounded-full bg-shield-500/10 text-shield-600 border border-shield-500/20"
            >
              {c}
            </span>
          ))}
        </div>
        {!healthInsights && (
          <button
            onClick={onStartHealthSurvey}
            className="text-sm text-shield-600 hover:text-shield-500 transition font-medium"
          >
            + 정밀 건강 설문 추가하기 (기존 질환·가족력·BMI)
          </button>
        )}
      </div>

      <div className="mt-8 space-y-2.5">
        <button
          onClick={onEnter}
          className="w-full rounded-xl bg-pulse-500 text-white py-3.5 font-medium hover:bg-pulse-600 transition"
        >
          이 결과로 매일 관리 시작하기 →
        </button>
        <button
          onClick={onShare}
          className="w-full border border-line py-3 font-medium text-ink hover:bg-canvas transition"
        >
          {copied ? '복사됐어요 ✓' : '결과 복사해서 공유하기'}
        </button>
        <button onClick={onRestart} className="w-full text-subink py-2 text-sm hover:text-ink transition">
          다시 테스트하기
        </button>
      </div>
    </div>
  )
}
