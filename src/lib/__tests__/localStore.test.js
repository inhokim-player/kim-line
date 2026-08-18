import { describe, it, expect, beforeEach } from 'vitest'
import { upsertLog, getStreak, clearAllData } from '../localStore'

describe('getStreak', () => {
  beforeEach(() => {
    clearAllData()
  })

  it('기록이 하나도 없으면 0이다', () => {
    expect(getStreak('2026-08-16')).toBe(0)
  })

  it('오늘 기록만 있으면 1이다', () => {
    upsertLog('2026-08-16', { sleep_hours: 7 })
    expect(getStreak('2026-08-16')).toBe(1)
  })

  it('연속 3일 기록이 있으면 3이다', () => {
    upsertLog('2026-08-14', { sleep_hours: 7 })
    upsertLog('2026-08-15', { sleep_hours: 7 })
    upsertLog('2026-08-16', { sleep_hours: 7 })
    expect(getStreak('2026-08-16')).toBe(3)
  })

  it('중간에 하루가 비면 그 이전 기록은 카운트하지 않는다', () => {
    upsertLog('2026-08-12', { sleep_hours: 7 }) // 끊긴 과거 기록
    upsertLog('2026-08-15', { sleep_hours: 7 })
    upsertLog('2026-08-16', { sleep_hours: 7 })
    expect(getStreak('2026-08-16')).toBe(2) // 8/14가 비어있으므로 8/15, 8/16만 카운트
  })

  it('오늘 기록이 없으면 어제까지 기록이 있어도 0이다', () => {
    upsertLog('2026-08-15', { sleep_hours: 7 })
    expect(getStreak('2026-08-16')).toBe(0)
  })

  it('월 경계를 넘어가는 연속 기록도 정확히 센다', () => {
    upsertLog('2026-07-31', { sleep_hours: 7 })
    upsertLog('2026-08-01', { sleep_hours: 7 })
    upsertLog('2026-08-02', { sleep_hours: 7 })
    expect(getStreak('2026-08-02')).toBe(3)
  })

  it('연도 경계를 넘어가는 연속 기록도 정확히 센다', () => {
    upsertLog('2025-12-31', { sleep_hours: 7 })
    upsertLog('2026-01-01', { sleep_hours: 7 })
    expect(getStreak('2026-01-01')).toBe(2)
  })
})
