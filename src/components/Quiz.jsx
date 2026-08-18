import { useState } from 'react'
import { QUIZ_QUESTIONS, aggregateAnswers, buildArchetype } from '../lib/riskTypes'
import QuestionCard from './QuestionCard'

export default function Quiz({ onComplete }) {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  function handleAnswer(value) {
    const q = QUIZ_QUESTIONS[step]
    const next = { ...answers, [q.id]: value }
    setAnswers(next)

    if (step + 1 >= QUIZ_QUESTIONS.length) {
      const metrics = aggregateAnswers(QUIZ_QUESTIONS, next)
      const archetype = buildArchetype(metrics)
      onComplete({ metrics, archetype })
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step === 0) return
    setStep(step - 1)
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-pulse-500 flex items-center justify-center mb-6">
          <span className="text-white text-3xl">✨</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink mb-3">
          내 리스크 유형은?
        </h1>
        <p className="text-sm text-subink leading-relaxed max-w-xs">
          8개의 질문으로 당신의 생활 습관을 분석해서
          <br />
          리스크 유형과 예상 보험료를 알려드려요
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-8 rounded-xl bg-ink text-white px-8 py-3.5 font-medium hover:bg-pulse-600 transition"
        >
          테스트 시작하기
        </button>
        <p className="mt-3 text-xs text-subink">약 1분 소요</p>
      </div>
    )
  }

  return (
    <QuestionCard
      step={step + 1}
      total={QUIZ_QUESTIONS.length}
      question={QUIZ_QUESTIONS[step]}
      onAnswer={handleAnswer}
      onBack={step > 0 ? handleBack : null}
    />
  )
}
