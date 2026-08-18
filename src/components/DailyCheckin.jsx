import { useState } from 'react'
import { DAILY_QUESTIONS, aggregateAnswers } from '../lib/riskTypes'
import QuestionCard from './QuestionCard'

export default function DailyCheckin({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  function handleAnswer(value) {
    const q = DAILY_QUESTIONS[step]
    const next = { ...answers, [q.id]: value }
    setAnswers(next)

    if (step + 1 >= DAILY_QUESTIONS.length) {
      const metrics = aggregateAnswers(DAILY_QUESTIONS, next)
      onComplete(metrics)
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step === 0) return
    setStep(step - 1)
  }

  return (
    <QuestionCard
      step={step + 1}
      total={DAILY_QUESTIONS.length}
      question={DAILY_QUESTIONS[step]}
      onAnswer={handleAnswer}
      onBack={step > 0 ? handleBack : null}
    />
  )
}
