import { describe, it, expect } from 'vitest'
import { secondsSinceKstMidnight, daysInKstYear, kstDateISO, isLeapYear } from '../kst'

describe('secondsSinceKstMidnight', () => {
  it('한국시간 자정 직후에는 0에 가깝다', () => {
    // 2026-08-16 00:00:05 KST = 2026-08-15 15:00:05 UTC
    const t = new Date('2026-08-15T15:00:05.000Z')
    const sec = secondsSinceKstMidnight(t)
    expect(sec).toBeGreaterThanOrEqual(4)
    expect(sec).toBeLessThan(6)
  })

  it('한국시간 자정 직전에는 86400에 가깝다', () => {
    // 2026-08-16 23:59:55 KST = 2026-08-16 14:59:55 UTC
    const t = new Date('2026-08-16T14:59:55.000Z')
    const sec = secondsSinceKstMidnight(t)
    expect(sec).toBeGreaterThan(86390)
    expect(sec).toBeLessThan(86400)
  })

  it('자정을 넘어가는 순간 값이 리셋된다 (드리프트 없음)', () => {
    const beforeMidnight = new Date('2026-08-16T14:59:59.000Z') // KST 23:59:59
    const afterMidnight = new Date('2026-08-16T15:00:01.000Z') // KST 00:00:01 (다음날)

    const before = secondsSinceKstMidnight(beforeMidnight)
    const after = secondsSinceKstMidnight(afterMidnight)

    expect(before).toBeGreaterThan(86000)
    expect(after).toBeLessThan(5)
  })

  it('항상 0 이상 86400 미만이다 (하루 중 임의 100개 시점 검증)', () => {
    for (let i = 0; i < 100; i++) {
      const randomMs = Date.parse('2026-08-16T00:00:00.000Z') + Math.floor(Math.random() * 86400000)
      const sec = secondsSinceKstMidnight(new Date(randomMs))
      expect(sec).toBeGreaterThanOrEqual(0)
      expect(sec).toBeLessThan(86400)
    }
  })
})

describe('daysInKstYear / isLeapYear', () => {
  it('2024년은 윤년이라 366일이다', () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(daysInKstYear(new Date('2024-06-01T00:00:00.000Z'))).toBe(366)
  })

  it('2025년, 2026년은 평년이라 365일이다', () => {
    expect(isLeapYear(2025)).toBe(false)
    expect(isLeapYear(2026)).toBe(false)
    expect(daysInKstYear(new Date('2026-08-16T00:00:00.000Z'))).toBe(365)
  })

  it('100의 배수이지만 400의 배수가 아닌 해는 평년이다', () => {
    expect(isLeapYear(1900)).toBe(false)
    expect(isLeapYear(2000)).toBe(true)
  })
})

describe('kstDateISO', () => {
  it('offsetDays로 어제/오늘/내일을 정확히 계산한다', () => {
    const t = new Date('2026-08-16T10:00:00.000Z') // KST 19:00
    expect(kstDateISO(0, t)).toBe('2026-08-16')
    expect(kstDateISO(-1, t)).toBe('2026-08-15')
    expect(kstDateISO(1, t)).toBe('2026-08-17')
  })

  it('UTC로는 다음날이어도 KST 기준 날짜를 정확히 반환한다', () => {
    // UTC 2026-08-16 20:00 = KST 2026-08-17 05:00
    const t = new Date('2026-08-16T20:00:00.000Z')
    expect(kstDateISO(0, t)).toBe('2026-08-17')
  })

  it('방문자 시간대와 무관하게 항상 같은 KST 날짜를 반환한다', () => {
    // 같은 절대 시각(UTC epoch)이면 함수 호출 환경(로컬 시간대)과 무관하게 결과가 같아야 함
    const t = new Date('2026-08-16T16:00:00.000Z')
    const result1 = kstDateISO(0, t)
    const result2 = kstDateISO(0, new Date(t.getTime()))
    expect(result1).toBe(result2)
    expect(result1).toBe('2026-08-17')
  })
})
