import { describe, it, expect } from 'vitest'
import { weakBodyPartsFromMetrics, weakBodyPartsDetailed, BODY_PARTS } from '../bodyInsuranceMap'

const GOOD = { sleep_hours: 7.5, exercise_minutes: 45, driving_score: 90, diet_score: 90, stress_level: 10 }

describe('weakBodyPartsFromMetrics', () => {
  it('운전 점수가 낮으면 spine, legs가 포함된다', () => {
    const parts = weakBodyPartsFromMetrics({ ...GOOD, driving_score: 20 })
    expect(parts).toContain('spine')
    expect(parts).toContain('legs')
  })

  it('수면이 이상 범위(7~8시간)에서 크게 벗어나면 brain이 포함된다', () => {
    const parts = weakBodyPartsFromMetrics({ ...GOOD, sleep_hours: 3 })
    expect(parts).toContain('brain')
  })

  it('활력(운동+식습관)이 낮으면 heart, stomach가 포함된다', () => {
    const parts = weakBodyPartsFromMetrics({ ...GOOD, exercise_minutes: 0, diet_score: 20 })
    expect(parts).toContain('heart')
    expect(parts).toContain('stomach')
  })

  it('스트레스가 높으면 mind가 포함된다', () => {
    const parts = weakBodyPartsFromMetrics({ ...GOOD, stress_level: 90 })
    expect(parts).toContain('mind')
  })

  it('모든 지표가 좋아도 최소 1개 부위는 반환한다 (빈 배열 없음)', () => {
    const parts = weakBodyPartsFromMetrics(GOOD)
    expect(parts.length).toBeGreaterThanOrEqual(1)
  })

  it('중복 없이 유니크한 키만 반환한다', () => {
    const parts = weakBodyPartsFromMetrics({ ...GOOD, driving_score: 10, exercise_minutes: 0, diet_score: 10 })
    expect(new Set(parts).size).toBe(parts.length)
  })
})

describe('weakBodyPartsDetailed', () => {
  it('각 항목에 BODY_PARTS의 전체 정보(보험 카테고리 포함)가 붙는다', () => {
    const details = weakBodyPartsDetailed({ ...GOOD, driving_score: 10 })
    expect(details.length).toBeGreaterThan(0)
    details.forEach((d) => {
      expect(d).toHaveProperty('label')
      expect(d).toHaveProperty('insuranceCategories')
      expect(d.insuranceCategories.length).toBeGreaterThan(0)
    })
  })
})

describe('BODY_PARTS 데이터 무결성', () => {
  it('모든 부위가 최소 1개 이상의 보험 카테고리를 가진다', () => {
    BODY_PARTS.forEach((p) => {
      expect(p.insuranceCategories.length).toBeGreaterThan(0)
    })
  })
})

describe('nutrition 데이터', () => {
  it('모든 부위가 nutrients(영양소+수치), foods(음식), mechanism(기전 설명)을 가진다', () => {
    BODY_PARTS.forEach((p) => {
      expect(p.nutrition).toBeDefined()
      expect(p.nutrition.nutrients.length).toBeGreaterThan(0)
      expect(p.nutrition.foods.length).toBeGreaterThan(0)
      expect(p.nutrition.mechanism.length).toBeGreaterThan(0)
    })
  })

  it('모든 영양소 항목에 이름·수치·단위가 있다', () => {
    BODY_PARTS.forEach((p) => {
      p.nutrition.nutrients.forEach((n) => {
        expect(n.name).toBeTruthy()
        expect(n.amount).toBeTruthy()
        expect(n.unit).toBeTruthy()
      })
    })
  })
})
