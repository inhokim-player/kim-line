// 대한민국 질병·보험 데이터 스냅샷
// 사망 통계는 다루지 않습니다 — 질병 발생 통계와 보험 가입 통계에 집중합니다.
// 연 1회(연말) 갱신을 원칙으로 합니다. 갱신 방법은 UPDATE.md 참고.

// 데이터 버전 — 연 1회, 연말에 아래 출처들을 다시 확인해 갱신합니다 (UPDATE.md 참고)
export const DATA_VERSION = {
  year: 2026,
  updatedAt: '2026년 8월',
  nextReview: '2026년 12월 (연말 점검)',
  sources: [
    '보건복지부 「암등록통계」 — 연 1회 발표',
    '질병관리청 「법정감염병발생보고」 — 연 1회 발표',
    '금융위원회 실손의료보험 관련 보도자료 (2025.4) — 2024년말 기준',
    '국토교통부 자동차 등록 통계 — 2025년 6월말 기준',
    'Swiss Re Institute sigma / OECD Global Insurance Market Trends — 연 1회 발표'
  ]
}

// 질병 발생 통계 (사망이 아니라 "발생" 기준)
export const DISEASE_INCIDENCE = {
  newCancerCases: 288613, // 보건복지부 「암등록통계」, 연간 신규 암 발생자수
  infectiousDiseaseCases: 121639 // 질병관리청 「법정감염병발생보고」, 연간 발생건수
}

export const DISEASE_INCIDENCE_META = {
  source: '보건복지부 「암등록통계」, 질병관리청 「법정감염병발생보고」'
}

// 국내 보험 가입 규모 — 실제로 검증된 항목만 포함합니다.
// "가장 많이 드는 보험 TOP 10" 전체를 하나의 공식 출처로 확인하지는 못했습니다.
// 아래 2개는 정부 공식 발표로 확인된 수치이고, 나머지 유형(종신보험·암보험 등)은
// 가입자 수를 항목별로 공식 발표한 통합 출처를 찾지 못해 포함하지 않았습니다.
export const KOREA_INSURANCE_SUBSCRIBERS = [
  {
    rank: 1,
    name: '실손의료보험',
    subscribers: 40000000, // 피보험자 수, 2024년말 기준
    unit: '명',
    note: '국민 대다수가 가입해 "제2의 건강보험"으로 불려요.',
    source: '금융위원회 보도자료 (2025.4.1)'
  },
  {
    rank: 2,
    name: '자동차보험(책임보험)',
    subscribers: 26408000, // 자동차 누적등록대수, 2025년 6월말 — 사실상 전량 의무가입 대상
    unit: '대',
    note: '법정 의무보험이라 등록 차량 수와 거의 일치해요.',
    source: '국토교통부 자동차 등록 통계 (2025.6월말)'
  }
]

export const KOREA_INSURANCE_SUBSCRIBERS_META = {
  disclaimer:
    '전체 보험 상품을 아우르는 공식 "가입자 수 TOP 10" 순위표는 하나의 출처로 확인되지 않아, 정부 발표로 검증된 2개 항목만 표시합니다.'
}

// 글로벌 보험 시장 순위 (Swiss Re sigma 데이터 기반, 삼일PwC경영연구원 2024 재인용)
export const GLOBAL_INSURANCE_STATS = {
  koreaPremiumVolumeRank: 7, // 수입보험료 총액 기준 세계 순위
  koreaDensityRank: 18, // 보험밀도(1인당 수입보험료) 기준 세계 순위
  oecdPenetration: {
    highest: { country: '룩셈부르크', value: 33 }, // GDP 대비 보험료 비중(%), 2024
    lowest: { country: '루마니아', value: 1.1 }
  },
  source: 'Swiss Re Institute sigma, OECD Global Insurance Market Trends 2025 (2024년 기준)'
}
