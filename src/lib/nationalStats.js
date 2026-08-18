// 통계청(국가데이터처) 2024년 사망원인통계, KOSIS 100대 지표 기준 스냅샷
// 실제 서비스에서는 KOSIS Open API(https://kosis.kr/openapi)로 교체 권장
// (이 환경은 외부망이 제한되어 있어 고정 값으로 시작합니다. 갱신 방법은 README 참고)

export const NATIONAL_STATS_META = {
  year: 2024,
  source: '통계청(국가데이터처) 「사망원인통계」, KOSIS 100대 지표',
  fetchedNote: '2026년 발표 자료 기준 고정 스냅샷'
}

export const OVERVIEW = {
  totalDeaths: 358569,
  crudeDeathRate: 702.6, // 인구 10만 명당
  ageStandardizedRate: 294.6 // 인구 구조 보정, 10만 명당
}

// 10대 사망원인 순위 (2024년 기준). rate는 공식 발표에서 확인된 항목만 포함
export const TOP_CAUSES = [
  { rank: 1, name: '암(악성신생물)', ratePer100k: 174.3, share: 24.8 },
  { rank: 2, name: '심장 질환', ratePer100k: null, share: null },
  { rank: 3, name: '폐렴', ratePer100k: null, share: null },
  { rank: 4, name: '뇌혈관 질환', ratePer100k: null, share: null },
  { rank: 5, name: '고의적 자해(자살)', ratePer100k: 29.1, share: null },
  { rank: 6, name: '알츠하이머병', ratePer100k: null, share: null },
  { rank: 7, name: '당뇨병', ratePer100k: null, share: null },
  { rank: 8, name: '고혈압성 질환', ratePer100k: null, share: null },
  { rank: 9, name: '간 질환', ratePer100k: null, share: null },
  { rank: 10, name: '패혈증', ratePer100k: null, share: null }
]

export const TOP3_SHARE = 42.6 // 암·심장질환·폐렴이 전체 사망의 42.6%

export const INJURY_STATS = {
  trafficDeaths: 2521 // 경찰청 「경찰접수교통사고현황」, 연간 교통사고 사망자수
}

export const DISEASE_INCIDENCE = {
  newCancerCases: 288613, // 보건복지부 「암등록통계」, 연간 신규 암 발생자수
  infectiousDiseaseCases: 121639 // 질병관리청 「법정감염병발생보고」, 연간 발생건수
}

export const INTL_COMPARISON = {
  koreaSuicideRateStandardized: 26.2,
  oecdAvgSuicideRate: 10.8
}

// 사용자의 현재 습관 값에서 가장 약한 지표를 찾아 관련 국가 통계를 매칭
export function pickRelevantStat(values) {
  const weakness = []
  if (values.driving_score < 55) weakness.push({ key: 'driving', score: 55 - values.driving_score })
  if (values.stress_level > 55) weakness.push({ key: 'stress', score: values.stress_level - 55 })
  const vitality = (Math.min(100, values.exercise_minutes * 2) + values.diet_score) / 2
  if (vitality < 50) weakness.push({ key: 'vitality', score: 50 - vitality })

  weakness.sort((a, b) => b.score - a.score)
  const top = weakness[0]?.key

  if (top === 'driving') {
    return {
      icon: '🚗',
      title: '교통사고 사망',
      value: `${INJURY_STATS.trafficDeaths.toLocaleString()}명`,
      note: '연간 교통사고 사망자 수예요. 운전 습관 점수를 올리면 개인 리스크뿐 아니라 이 통계에도 기여해요.'
    }
  }
  if (top === 'vitality') {
    return {
      icon: '🫀',
      title: '심장 질환 · 암',
      value: '사망원인 1·2위',
      note: `암·심장질환·폐렴이 전체 사망의 ${TOP3_SHARE}%를 차지해요. 활동량과 식습관이 가장 직접적으로 연결되는 영역이에요.`
    }
  }
  if (top === 'stress') {
    return {
      icon: '🧠',
      title: '자살 사망률',
      value: `10만 명당 ${INTL_COMPARISON.koreaSuicideRateStandardized}명`,
      note: `OECD 평균(${INTL_COMPARISON.oecdAvgSuicideRate}명)보다 높은 수준이에요. 스트레스 관리가 통계적으로도 중요한 이유예요.`
    }
  }
  return {
    icon: '✅',
    title: '전반적으로 양호',
    value: '전국 평균 이상',
    note: '지금 습관을 유지하면 주요 사망원인 리스크 대부분에서 평균보다 안전한 편이에요.'
  }
}
