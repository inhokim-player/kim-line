import { describe, it, expect } from 'vitest'
import { computeLivePace } from '../livePace'

describe('computeLivePace', () => {
  it('연간 358,569명 기준으로 하루가 지나면 대략 전체 값에 수렴한다', () => {
    const almostMidnight = new Date('2026-08-16T14:59:59.000Z') // KST 23:59:59
    const pace = computeLivePace(358569, almostMidnight)
    // 365일로 나눈 하루치(약 982명)에 근접해야 함
    expect(pace).toBeGreaterThan(970)
    expect(pace).toBeLessThan(985)
  })

  it('자정 직후에는 0에 가깝다', () => {
    const justAfterMidnight = new Date('2026-08-15T15:00:02.000Z') // KST 00:00:02
    const pace = computeLivePace(358569, justAfterMidnight)
    expect(pace).toBeGreaterThanOrEqual(0)
    expect(pace).toBeLessThan(5)
  })

  it('시간이 흐르면 값은 절대 감소하지 않는다 (같은 날 안에서)', () => {
    const t1 = new Date('2026-08-16T01:00:00.000Z') // KST 10:00
    const t2 = new Date('2026-08-16T05:00:00.000Z') // KST 14:00
    const t3 = new Date('2026-08-16T10:00:00.000Z') // KST 19:00

    const p1 = computeLivePace(358569, t1)
    const p2 = computeLivePace(358569, t2)
    const p3 = computeLivePace(358569, t3)

    expect(p2).toBeGreaterThanOrEqual(p1)
    expect(p3).toBeGreaterThanOrEqual(p2)
  })

  it('자정을 넘기면 누적되지 않고 새로 시작한다 (드리프트 없음)', () => {
    const lateNight = new Date('2026-08-16T14:59:50.000Z') // KST 23:59:50, 거의 하루치
    const nextDayEarly = new Date('2026-08-16T15:00:10.000Z') // KST 00:00:10, 다음날 시작

    const lateNightPace = computeLivePace(358569, lateNight)
    const nextDayPace = computeLivePace(358569, nextDayEarly)

    expect(lateNightPace).toBeGreaterThan(900)
    expect(nextDayPace).toBeLessThan(20)
  })

  it('항상 0 이상의 정수를 반환한다', () => {
    for (let h = 0; h < 24; h++) {
      const t = new Date(`2026-08-16T${String(h).padStart(2, '0')}:00:00.000Z`)
      const pace = computeLivePace(358569, t)
      expect(Number.isInteger(pace)).toBe(true)
      expect(pace).toBeGreaterThanOrEqual(0)
    }
  })

  it('값이 0인 통계는 항상 0을 반환한다', () => {
    expect(computeLivePace(0, new Date())).toBe(0)
  })
})
