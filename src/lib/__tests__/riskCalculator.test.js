import { describe, it, expect } from 'vitest'
import { computeRiskScore, computePremium, riskTier } from '../riskCalculator'

describe('computeRiskScore', () => {
  it('완벽한 습관이면 낮은 리스크 점수를 낸다', () => {
    const { riskScore } = computeRiskScore({
      sleep_hours: 7.5,
      exercise_minutes: 60,
      driving_score: 100,
      diet_score: 100,
      stress_level: 0
    })
    expect(riskScore).toBeLessThan(15)
  })

  it('나쁜 습관이면 높은 리스크 점수를 낸다', () => {
    const { riskScore } = computeRiskScore({
      sleep_hours: 2,
      exercise_minutes: 0,
      driving_score: 0,
      diet_score: 0,
      stress_level: 100
    })
    expect(riskScore).toBeGreaterThan(70)
  })

  it('점수는 항상 0~100 사이다', () => {
    const cases = [
      { sleep_hours: 0, exercise_minutes: 0, driving_score: 0, diet_score: 0, stress_level: 100 },
      { sleep_hours: 12, exercise_minutes: 90, driving_score: 100, diet_score: 100, stress_level: 0 }
    ]
    cases.forEach((c) => {
      const { riskScore } = computeRiskScore(c)
      expect(riskScore).toBeGreaterThanOrEqual(0)
      expect(riskScore).toBeLessThanOrEqual(100)
    })
  })
})

describe('computePremium', () => {
  it('리스크 0점이면 최대 할인율(-20%)에 가깝다', () => {
    const { discountPct } = computePremium(100000, 0)
    expect(discountPct).toBe(20)
  })

  it('리스크 100점이면 최대 할증율(+25%)에 가깝다', () => {
    const { discountPct } = computePremium(100000, 100)
    expect(discountPct).toBe(-25)
  })

  it('리스크 50점이면 기준 보험료와 동일하다', () => {
    const { premium, discountPct } = computePremium(100000, 50)
    expect(premium).toBe(100000)
    expect(discountPct).toBe(0)
  })
})

describe('riskTier', () => {
  it('점수 구간에 맞는 라벨을 반환한다', () => {
    expect(riskTier(10).label).toBe('매우 안전')
    expect(riskTier(40).label).toBe('양호')
    expect(riskTier(60).label).toBe('주의')
    expect(riskTier(90).label).toBe('고위험')
  })
})
