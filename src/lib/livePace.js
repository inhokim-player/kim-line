import { daysInKstYear, secondsSinceKstMidnight } from './kst'

// 연간 통계치를 한국시간 기준 "오늘 이 시각까지의 추정치"로 환산
// 매 호출마다 현재 시각을 기준으로 다시 계산하므로 드리프트가 발생하지 않음
// (누적 더하기 방식이 아니라 항상 절대 시각에서 재계산하는 방식)
export function computeLivePace(annualValue, now = new Date()) {
  const ratePerSecond = annualValue / daysInKstYear(now) / 86400
  return Math.floor(ratePerSecond * secondsSinceKstMidnight(now))
}
