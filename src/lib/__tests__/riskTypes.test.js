import { describe, it, expect } from 'vitest'
import { QUIZ_QUESTIONS, DAILY_QUESTIONS, aggregateAnswers } from '../riskTypes'

describe('aggregateAnswers', () => {
  it('온보딩 8문항에 모두 답하면 5개 지표를 모두 계산한다', () => {
    const answers = {}
    QUIZ_QUESTIONS.forEach((q) => {
      answers[q.id] = q.options[2].value // 각 문항에서 3번째 선택지로 답변
    })
    const metrics = aggregateAnswers(QUIZ_QUESTIONS, answers)
    expect(metrics).toHaveProperty('sleep_hours')
    expect(metrics).toHaveProperty('exercise_minutes')
    expect(metrics).toHaveProperty('driving_score')
    expect(metrics).toHaveProperty('diet_score')
    expect(metrics).toHaveProperty('stress_level')
  })

  it('같은 지표에 걸린 2문항은 평균으로 집계된다 (수면)', () => {
    const answers = { sleep_1: 5.5, sleep_2: 8.5 }
    const metrics = aggregateAnswers(QUIZ_QUESTIONS, answers)
    expect(metrics.sleep_hours).toBeCloseTo(7, 1)
  })

  it('일일 체크인 5문항은 지표당 1문항이라 답변값이 그대로 들어간다', () => {
    const answers = {}
    DAILY_QUESTIONS.forEach((q) => {
      answers[q.id] = q.options[0].value
    })
    const metrics = aggregateAnswers(DAILY_QUESTIONS, answers)
    expect(metrics.sleep_hours).toBe(DAILY_QUESTIONS[0].options[0].value)
  })

  it('답변이 없는 지표는 기본값으로 채워진다', () => {
    const metrics = aggregateAnswers(QUIZ_QUESTIONS, {})
    expect(metrics.sleep_hours).toBe(7)
    expect(metrics.driving_score).toBe(70)
  })
})
