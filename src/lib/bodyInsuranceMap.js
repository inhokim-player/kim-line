// 특정 보험사의 상품·가격이 아니라, 국내에 일반적으로 존재하는 보험 "상품군" 카테고리입니다.
// 실제 가입 가능한 상품/가격은 보험사별로 다르므로 여기서는 카테고리 안내까지만 제공합니다.
//
// nutrition의 nutrients 항목은 "2020 한국인 영양소 섭취기준(KDRI)"
// (보건복지부·한국영양학회 공동 발표, 성인 기준 근사치)을 참고했습니다.
// 개인 처방이 아니라 일반적인 성인 기준 참고 수치입니다.

import { computePremium } from './riskCalculator'

export const NUTRITION_META = {
  source: '2020 한국인 영양소 섭취기준(KDRI) — 보건복지부·한국영양학회',
  disclaimer: '성인 평균 기준 근사치입니다. 연령·성별·건강상태에 따라 실제 필요량은 달라질 수 있어요.'
}

export const BODY_PARTS = [
  {
    key: 'brain',
    label: '뇌·신경',
    cx: 50,
    cy: 8,
    r: 7,
    sampleRiskScore: 60,
    stat: '뇌혈관 질환은 국내 주요 질환 중 하나예요.',
    nutrition: {
      nutrients: [
        { name: '오메가3 지방산(EPA·DHA)', amount: '1.2~1.6', unit: 'g/일' },
        { name: '비타민B12', amount: '2.4', unit: 'μg/일' }
      ],
      foods: ['등푸른생선(고등어·연어)', '견과류', '블루베리'],
      mechanism: 'DHA는 뇌세포막의 주요 구성 성분이고, 항산화 성분은 인지기능 유지에 관여해요.'
    },
    insuranceCategories: ['뇌혈관질환보험', '치매보험', '정기보험'],
    tip: '가족력이 있거나 고혈압·당뇨가 있다면 뇌혈관질환 진단비 특약을 우선 확인해보세요.'
  },
  {
    key: 'mind',
    label: '정신 건강',
    cx: 50,
    cy: 8,
    r: 7,
    hidden: true,
    sampleRiskScore: 62,
    stat: '스트레스·수면 관리가 부족하면 여러 만성질환 리스크가 함께 올라가요.',
    nutrition: {
      nutrients: [
        { name: '마그네슘', amount: '280~370', unit: 'mg/일' },
        { name: '트립토판(단백질 섭취로 보충)', amount: '체중 1kg당 0.91', unit: 'g/일(단백질 기준)' }
      ],
      foods: ['바나나', '견과류', '다크초콜릿', '따뜻한 우유'],
      mechanism: '마그네슘·트립토판은 세로토닌 합성 경로에 관여해 스트레스 완화에 도움을 줄 수 있어요.'
    },
    insuranceCategories: ['정신건강 특약', '상담 지원 EAP', '실손의료보험'],
    tip: '최근에는 우울·불안 상담을 보장하는 특약도 늘고 있어요.'
  },
  {
    key: 'heart',
    label: '심장',
    cx: 44,
    cy: 30,
    r: 7,
    sampleRiskScore: 65,
    stat: '심장 질환은 국내 주요 질환 중 큰 비중을 차지해요.',
    nutrition: {
      nutrients: [
        { name: '오메가3 지방산', amount: '1.2~1.6', unit: 'g/일' },
        { name: '나트륨(상한)', amount: '2,300 이하', unit: 'mg/일' },
        { name: '식이섬유', amount: '20~30', unit: 'g/일' }
      ],
      foods: ['등푸른생선', '올리브오일', '견과류', '통곡물'],
      mechanism: '불포화지방산은 혈중 콜레스테롤 관리에, 나트륨 제한은 혈압 관리에 직접 연관돼요. 한국인 평균 나트륨 섭취량(3,255mg/일)은 권장 상한을 넘어서요.'
    },
    insuranceCategories: ['심장질환보험', '실손의료보험', '정기보험'],
    tip: '고혈압·고지혈증이 있다면 심장질환 진단비 보장을 확인해보세요.'
  },
  {
    key: 'lungs',
    label: '폐·호흡기',
    cx: 56,
    cy: 30,
    r: 7,
    sampleRiskScore: 55,
    stat: '폐 질환은 흡연·미세먼지 노출과 밀접하게 연관돼요.',
    nutrition: {
      nutrients: [
        { name: '비타민C', amount: '100', unit: 'mg/일' },
        { name: '비타민A', amount: '650~750', unit: 'μgRAE/일' }
      ],
      foods: ['귤·키위 등 비타민C 과일', '도라지·배', '녹황색 채소'],
      mechanism: '항산화 비타민은 호흡기 점막 보호에 관여해요. 도라지·배는 전통적으로 기관지 건강 식재료로 알려져 있어요.'
    },
    insuranceCategories: ['실손의료보험', '호흡기질환 특약'],
    tip: '흡연 이력이 있다면 폐 관련 특약을 눈여겨보세요.'
  },
  {
    key: 'stomach',
    label: '소화기',
    cx: 50,
    cy: 45,
    r: 8,
    sampleRiskScore: 58,
    stat: '위암·대장암은 국내에서 발생률이 높은 암종에 속해요.',
    nutrition: {
      nutrients: [
        { name: '식이섬유', amount: '20~30', unit: 'g/일' },
        { name: '수분', amount: '2,000~2,600', unit: 'mL/일(음식 포함)' }
      ],
      foods: ['발효식품(김치·요거트)', '현미·귀리', '충분한 물'],
      mechanism: '유산균은 장내 미생물 균형에, 식이섬유는 장 운동과 노폐물 배출을 돕는다고 알려져 있어요.'
    },
    insuranceCategories: ['암보험(위암·대장암 특화)', '실손의료보험'],
    tip: '가족력이 있으면 소화기암 진단비를 별도로 확인해보세요.'
  },
  {
    key: 'spine',
    label: '척추·관절',
    cx: 50,
    cy: 62,
    r: 8,
    sampleRiskScore: 50,
    stat: '낙상·상해로 인한 척추·관절 손상은 전 연령대에서 발생 빈도가 높아요.',
    nutrition: {
      nutrients: [
        { name: '칼슘', amount: '700~800', unit: 'mg/일' },
        { name: '비타민D', amount: '10 (65세 이상 15)', unit: 'μg/일' }
      ],
      foods: ['유제품', '멸치·뼈째 먹는 생선', '햇볕(비타민D 합성)'],
      mechanism: '칼슘은 뼈의 구성 성분이고, 비타민D는 장에서 칼슘 흡수를 돕는 보조 역할을 해요.'
    },
    insuranceCategories: ['상해보험', '실손의료보험', '골절진단비 특약'],
    tip: '운동을 즐긴다면 상해보험의 골절·탈구 보장을 확인해보세요.'
  },
  {
    key: 'skin',
    label: '피부',
    cx: 50,
    cy: 20,
    r: 6,
    hidden: true,
    sampleRiskScore: 35,
    stat: '피부암은 조기 발견 시 생존율이 높지만 보장에서 누락되기 쉬운 항목이에요.',
    nutrition: {
      nutrients: [
        { name: '베타카로틴(비타민A 전구체)', amount: '650~750', unit: 'μgRAE/일' },
        { name: '비타민C', amount: '100', unit: 'mg/일' }
      ],
      foods: ['토마토', '당근·호박 등 녹황색 채소', '충분한 물'],
      mechanism: '베타카로틴·리코펜 같은 항산화 성분은 자외선으로 인한 세포 손상 방어 기전에 관여한다고 알려져 있어요.'
    },
    insuranceCategories: ['암보험(피부암 포함형)', '실손의료보험'],
    tip: '암보험 가입 시 피부암 보장 포함 여부를 꼭 확인하세요.'
  },
  {
    key: 'legs',
    label: '다리·보행',
    cx: 50,
    cy: 85,
    r: 8,
    sampleRiskScore: 50,
    stat: '고령층 낙상은 골절과 장기 요양으로 이어지는 주요 원인이에요.',
    nutrition: {
      nutrients: [
        { name: '단백질', amount: '체중 1kg당 0.91', unit: 'g/일' },
        { name: '칼슘', amount: '700~800', unit: 'mg/일' }
      ],
      foods: ['살코기·두부·달걀', '유제품', '충분한 수분'],
      mechanism: '단백질은 근육 합성에 필수적이고, 근력이 유지돼야 낙상 위험이 줄어든다고 알려져 있어요.'
    },
    insuranceCategories: ['상해보험', '간병보험', '실손의료보험'],
    tip: '부모님 보험을 챙긴다면 낙상·골절 보장을 꼭 확인해보세요.'
  }
]

// 부위별 "예시" 예상 보험료 — 실제 개인 진단이 아니라, 부위마다 다르게 부여한
// 참고용 리스크 점수(sampleRiskScore)로 계산한 예시값입니다.
export function estimatePremiumForPart(key, basePremium = 85000) {
  const part = BODY_PARTS.find((p) => p.key === key)
  if (!part) return null
  return computePremium(basePremium, part.sampleRiskScore)
}

export const VISIBLE_BODY_PARTS = BODY_PARTS.filter((p) => !p.hidden)
export const LIST_ONLY_BODY_PARTS = BODY_PARTS.filter((p) => p.hidden)

// 5개 리스크 지표에서 약점을 찾아 관련 신체부위 key 배열을 반환한다.
export function weakBodyPartsFromMetrics(metrics) {
  const weak = []

  if (metrics.driving_score < 55) weak.push('spine', 'legs')

  const sleepOffset = Math.abs(metrics.sleep_hours - 7.5)
  if (sleepOffset > 2) weak.push('brain')

  const vitality = (Math.min(100, metrics.exercise_minutes * 2) + metrics.diet_score) / 2
  if (vitality < 50) weak.push('heart', 'stomach')

  if (metrics.stress_level > 55) weak.push('mind')

  if (weak.length === 0) weak.push('heart')

  return [...new Set(weak)]
}

export function weakBodyPartsDetailed(metrics) {
  return weakBodyPartsFromMetrics(metrics)
    .map((key) => BODY_PARTS.find((p) => p.key === key))
    .filter(Boolean)
}
