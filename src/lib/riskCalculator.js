// 리스크 점수 계산 엔진
// 각 습관 지표를 0(리스크 낮음) ~ 100(리스크 높음) 스케일로 정규화한 뒤
// 가중 평균을 내어 종합 리스크 점수를 산출합니다.

export const METRIC_WEIGHTS = {
  sleep: 0.22,      // 수면
  exercise: 0.2,     // 운동
  driving: 0.28,     // 운전 습관 (보험료에 가장 큰 영향)
  diet: 0.15,        // 식습관
  stress: 0.15       // 스트레스
}

// 수면: 7~8시간이 최적. 부족하거나 과다하면 리스크 상승
function sleepRisk(hours) {
  const ideal = 7.5
  const diff = Math.abs(hours - ideal)
  return clamp(diff * 18, 0, 100)
}

// 운동: 하루 30분 이상이면 리스크 급감, 없으면 리스크 최대
function exerciseRisk(minutes) {
  if (minutes >= 45) return 5
  if (minutes >= 30) return 20
  if (minutes >= 15) return 45
  if (minutes > 0) return 65
  return 85
}

// 운전 습관 점수(사용자가 0~100으로 입력, 100이 가장 안전)를 리스크로 역변환
function drivingRisk(safetyScore) {
  return clamp(100 - safetyScore, 0, 100)
}

// 식습관 점수(0~100, 100이 가장 건강)를 리스크로 역변환
function dietRisk(healthScore) {
  return clamp(100 - healthScore, 0, 100)
}

// 스트레스(0~100, 100이 가장 높음)는 그대로 리스크로 반영
function stressRisk(level) {
  return clamp(level, 0, 100)
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

export function computeRiskScore(log) {
  const sleep = sleepRisk(log.sleep_hours)
  const exercise = exerciseRisk(log.exercise_minutes)
  const driving = drivingRisk(log.driving_score)
  const diet = dietRisk(log.diet_score)
  const stress = stressRisk(log.stress_level)

  const weighted =
    sleep * METRIC_WEIGHTS.sleep +
    exercise * METRIC_WEIGHTS.exercise +
    driving * METRIC_WEIGHTS.driving +
    diet * METRIC_WEIGHTS.diet +
    stress * METRIC_WEIGHTS.stress

  return {
    riskScore: Math.round(clamp(weighted, 0, 100)),
    breakdown: {
      sleep: Math.round(sleep),
      exercise: Math.round(exercise),
      driving: Math.round(driving),
      diet: Math.round(diet),
      stress: Math.round(stress)
    }
  }
}

// 리스크 점수(0~100)를 기준 보험료 대비 프리미엄 배율로 변환
// 리스크 0 -> -20% 할인, 리스크 50 -> 기준가, 리스크 100 -> +25% 할증
export function computePremium(basePremium, riskScore) {
  const MAX_DISCOUNT = 0.2
  const MAX_SURCHARGE = 0.25
  const midpoint = 50

  let multiplier
  if (riskScore <= midpoint) {
    const t = (midpoint - riskScore) / midpoint // 0~1
    multiplier = 1 - t * MAX_DISCOUNT
  } else {
    const t = (riskScore - midpoint) / midpoint // 0~1
    multiplier = 1 + t * MAX_SURCHARGE
  }

  const premium = Math.round(basePremium * multiplier)
  const discountPct = Math.round((1 - multiplier) * 100)

  return { premium, discountPct, multiplier }
}

export function riskTier(riskScore) {
  if (riskScore <= 25) return { label: '매우 안전', tone: 'pulse' }
  if (riskScore <= 50) return { label: '양호', tone: 'pulse' }
  if (riskScore <= 75) return { label: '주의', tone: 'alert' }
  return { label: '고위험', tone: 'alert' }
}
