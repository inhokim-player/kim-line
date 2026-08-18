import { describe, it, expect } from 'vitest'
import { computeBMI, bmiCategory, deriveHealthInsights } from '../healthProfile'

describe('computeBMI', () => {
  it('키/몸무게로 BMI를 정확히 계산한다', () => {
    expect(computeBMI(170, 65)).toBeCloseTo(22.5, 1)
  })

  it('값이 없으면 null을 반환한다', () => {
    expect(computeBMI(null, 65)).toBeNull()
    expect(computeBMI(170, null)).toBeNull()
  })
})

describe('bmiCategory', () => {
  it('한국 기준 구간별로 올바른 라벨을 반환한다', () => {
    expect(bmiCategory(17).label).toBe('저체중')
    expect(bmiCategory(21).label).toBe('정상')
    expect(bmiCategory(24).label).toBe('과체중')
    expect(bmiCategory(27).label).toBe('비만')
    expect(bmiCategory(31).label).toBe('고도비만')
  })
})

describe('deriveHealthInsights', () => {
  it('고혈압을 선택하면 심장/뇌혈관 관련 카테고리가 포함된다', () => {
    const result = deriveHealthInsights({ conditions: ['hypertension'] })
    expect(result.categories).toContain('심장질환보험')
    expect(result.categories).toContain('뇌혈관질환보험')
  })

  it('아무 항목도 선택하지 않으면 기본값(실손의료보험)을 반환한다', () => {
    const result = deriveHealthInsights({})
    expect(result.categories).toEqual(['실손의료보험'])
  })

  it('가족력만 있어도 관련 카테고리가 반영된다', () => {
    const result = deriveHealthInsights({ familyHistory: ['cancer'] })
    expect(result.categories).toContain('암보험')
  })

  it('BMI가 비만 구간이면 실손의료보험이 포함된다', () => {
    const result = deriveHealthInsights({ heightCm: 170, weightKg: 90 })
    expect(result.bmiCategory.tone).toBe('risk')
    expect(result.categories).toContain('실손의료보험')
  })

  it('흡연 중이면 암보험이 포함된다', () => {
    const result = deriveHealthInsights({ smoking: 'current' })
    expect(result.categories).toContain('암보험')
  })
})
