import { describe, it, expect } from 'vitest'
import { QUIZ_QUESTIONS, DAILY_QUESTIONS, aggregateAnswers, buildArchetype, analyzeTraits } from '../riskTypes'

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

describe('buildArchetype', () => {
  it('안전운전+아침형+활력+평온이면 코드가 SLVC다', () => {
    const archetype = buildArchetype({
      sleep_hours: 7.5,
      exercise_minutes: 45,
      driving_score: 90,
      diet_score: 90,
      stress_level: 10
    })
    expect(archetype.code).toBe('SLVC')
  })

  it('반대 성향이면 코드가 WODT다', () => {
    const archetype = buildArchetype({
      sleep_hours: 3,
      exercise_minutes: 0,
      driving_score: 10,
      diet_score: 10,
      stress_level: 90
    })
    expect(archetype.code).toBe('WODT')
  })

  it('결과에는 항상 4글자 코드, 이모지, 이름, 설명이 포함된다', () => {
    const archetype = buildArchetype({
      sleep_hours: 7,
      exercise_minutes: 20,
      driving_score: 70,
      diet_score: 70,
      stress_level: 30
    })
    expect(archetype.code).toHaveLength(4)
    expect(archetype.emoji).toBeTruthy()
    expect(archetype.name).toBeTruthy()
    expect(archetype.description.length).toBeGreaterThan(10)
  })
})

describe('analyzeTraits', () => {
  it('4개 축을 모두 반환한다', () => {
    const analysis = analyzeTraits({
      sleep_hours: 7,
      exercise_minutes: 20,
      driving_score: 70,
      diet_score: 70,
      stress_level: 30
    })
    expect(analysis.axes).toHaveLength(4)
    analysis.axes.forEach((a) => {
      expect(a.score).toBeGreaterThanOrEqual(0)
      expect(a.score).toBeLessThanOrEqual(100)
    })
  })

  it('약점 지표가 growthAreas에 정확히 잡힌다', () => {
    const analysis = analyzeTraits({
      sleep_hours: 7.5,
      exercise_minutes: 45,
      driving_score: 90,
      diet_score: 90,
      stress_level: 95 // 스트레스만 매우 나쁨
    })
    expect(analysis.growthAreas.some((a) => a.key === 'mind')).toBe(true)
    expect(analysis.topGrowth.key).toBe('mind')
  })

  it('모든 항목이 좋으면 추천 문구가 긍정적으로 나온다', () => {
    const analysis = analyzeTraits({
      sleep_hours: 7.5,
      exercise_minutes: 45,
      driving_score: 90,
      diet_score: 90,
      stress_level: 10
    })
    expect(analysis.growthAreas).toHaveLength(0)
    expect(analysis.topGrowth).toBeNull()
    expect(analysis.recommendation).toContain('균형')
    expect(analysis.recommendation).not.toContain('리스크가 감지')
  })
})
