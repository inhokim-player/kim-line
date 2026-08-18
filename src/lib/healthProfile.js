// 자가 입력형 건강 설문 — 실제 병원 기록 연동이 아니라 사용자가 직접 입력하는 정보입니다.
// 진단이 아니라 "이미 알고 있는 정보"를 바탕으로 보험 카테고리를 매칭하는 참고용 도구입니다.

export const CONDITION_OPTIONS = [
  { key: 'hypertension', label: '고혈압' },
  { key: 'diabetes', label: '당뇨병' },
  { key: 'dyslipidemia', label: '고지혈증' },
  { key: 'heart', label: '심장질환' },
  { key: 'cerebrovascular', label: '뇌혈관질환' },
  { key: 'cancer', label: '암 (과거 또는 현재)' },
  { key: 'liver', label: '간질환' },
  { key: 'mental', label: '정신건강 (우울·불안 등) 진단 이력' },
  { key: 'respiratory', label: '천식·만성폐질환' },
  { key: 'thyroid', label: '갑상선질환' },
  { key: 'kidney', label: '신장질환' },
  { key: 'autoimmune', label: '자가면역질환' },
  { key: 'allergy', label: '중증 알레르기' }
]

export const SURGERY_OPTIONS = [
  { key: 'heart', label: '심장 관련 수술' },
  { key: 'cancer', label: '암 관련 수술' },
  { key: 'ortho', label: '정형외과(관절·척추) 수술' },
  { key: 'other', label: '기타 수술' }
]

export const MEDICATION_OPTIONS = [
  { key: 'none', label: '정기 복용 약물 없음' },
  { key: 'one_two', label: '1~2종 복용 중' },
  { key: 'three_plus', label: '3종 이상 복용 중' }
]

export const FAMILY_HISTORY_OPTIONS = [
  { key: 'cancer', label: '암' },
  { key: 'heart', label: '심장질환' },
  { key: 'cerebrovascular', label: '뇌혈관질환' },
  { key: 'diabetes', label: '당뇨병' }
]

export function computeBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null
  const h = heightCm / 100
  return Number((weightKg / (h * h)).toFixed(1))
}

// 대한비만학회 기준 (한국인 기준은 서구 기준보다 낮음)
export function bmiCategory(bmi) {
  if (bmi == null) return null
  if (bmi < 18.5) return { label: '저체중', tone: 'neutral' }
  if (bmi < 23) return { label: '정상', tone: 'good' }
  if (bmi < 25) return { label: '과체중', tone: 'caution' }
  if (bmi < 30) return { label: '비만', tone: 'risk' }
  return { label: '고도비만', tone: 'risk' }
}

const CONDITION_INSURANCE_MAP = {
  hypertension: {
    categories: ['심장질환보험', '뇌혈관질환보험'],
    note: '고혈압은 심장·뇌혈관 질환의 주요 위험 요인이에요. 관련 진단비 특약을 확인해보세요.'
  },
  diabetes: {
    categories: ['실손의료보험', '당뇨합병증 특약'],
    note: '당뇨 합병증(신장·눈·심혈관)을 보장하는 특약이 있는지 확인해보세요.'
  },
  dyslipidemia: {
    categories: ['심장질환보험'],
    note: '고지혈증은 심장질환 리스크를 높이는 요인이에요.'
  },
  heart: {
    categories: ['심장질환보험', '정기보험'],
    note: '기존 심장질환 이력이 있으면 신규 가입 심사에서 보장 범위나 보험료가 달라질 수 있어요.'
  },
  cerebrovascular: {
    categories: ['뇌혈관질환보험'],
    note: '기존 뇌혈관질환 이력은 가입 심사 시 고지 대상이에요.'
  },
  cancer: {
    categories: ['암보험(재발·전이 보장형)'],
    note: '기존 암 이력이 있으면 일반 암보험 신규 가입이 제한될 수 있어요. 유병자 전용 상품을 확인해보세요.'
  },
  liver: {
    categories: ['실손의료보험'],
    note: '간질환은 정기 검진과 연계된 보장을 우선 확인해보세요.'
  },
  mental: {
    categories: ['정신건강 특약', '상담 지원 EAP'],
    note: '정신건강 관련 보장은 상품마다 편차가 커요. 가입 전 보장 범위를 꼭 확인하세요.'
  },
  respiratory: {
    categories: ['실손의료보험', '호흡기질환 특약'],
    note: '천식·만성폐질환은 계절 변화에 영향을 받으니 정기 관리와 함께 확인해보세요.'
  },
  thyroid: {
    categories: ['실손의료보험'],
    note: '갑상선질환은 대개 관리 가능하지만 가입 심사 시 고지 대상이에요.'
  },
  kidney: {
    categories: ['실손의료보험', '신장질환 특약'],
    note: '신장질환은 장기 관리가 필요한 경우가 많아 관련 특약을 확인해보세요.'
  },
  autoimmune: {
    categories: ['실손의료보험'],
    note: '자가면역질환은 상품별로 보장 범위 차이가 커서 약관을 꼼꼼히 봐야 해요.'
  },
  allergy: {
    categories: ['실손의료보험'],
    note: '중증 알레르기는 응급 상황 대비 보장도 함께 확인해보세요.'
  }
}

const FAMILY_HISTORY_INSURANCE_MAP = {
  cancer: { categories: ['암보험'], note: '가족력이 있으면 조기검진 특약이 포함된 암보험을 고려해보세요.' },
  heart: { categories: ['심장질환보험'], note: '가족력이 있으면 심장 관련 정기검진을 함께 챙기는 게 좋아요.' },
  cerebrovascular: { categories: ['뇌혈관질환보험'], note: '가족력이 있으면 뇌혈관질환 진단비 특약을 확인해보세요.' },
  diabetes: { categories: ['실손의료보험'], note: '가족력이 있으면 혈당 관리와 함께 정기 검진을 챙겨보세요.' }
}

// 자가 입력 건강 프로필을 받아 보험 카테고리 + 근거 코멘트를 도출
export function deriveHealthInsights(profile) {
  const categories = new Set()
  const notes = []

  const bmi = computeBMI(profile.heightCm, profile.weightKg)
  const bmiCat = bmiCategory(bmi)
  if (bmiCat && (bmiCat.tone === 'risk' || bmiCat.tone === 'caution')) {
    categories.add('실손의료보험')
    notes.push({
      source: 'BMI',
      text: `BMI ${bmi} (${bmiCat.label})는 대사증후군 리스크와 연결돼요.`
    })
  }

  ;(profile.conditions || []).forEach((key) => {
    const mapped = CONDITION_INSURANCE_MAP[key]
    if (!mapped) return
    mapped.categories.forEach((c) => categories.add(c))
    notes.push({ source: CONDITION_OPTIONS.find((c) => c.key === key)?.label, text: mapped.note })
  })

  ;(profile.familyHistory || []).forEach((key) => {
    const mapped = FAMILY_HISTORY_INSURANCE_MAP[key]
    if (!mapped) return
    mapped.categories.forEach((c) => categories.add(c))
    notes.push({
      source: `가족력·${FAMILY_HISTORY_OPTIONS.find((f) => f.key === key)?.label}`,
      text: mapped.note
    })
  })

  if (profile.smoking === 'current') {
    categories.add('암보험')
    notes.push({ source: '흡연', text: '흡연 여부는 대부분의 보험사에서 보험료 산정에 반영돼요.' })
  }

  if (profile.checkupAbnormal === 'yes') {
    categories.add('실손의료보험')
    notes.push({ source: '건강검진', text: '최근 검진에서 이상 소견이 있었다면 정밀검사 보장을 확인해보세요.' })
  }

  if (profile.medications === 'three_plus') {
    categories.add('실손의료보험')
    notes.push({
      source: '복용 약물',
      text: '3종 이상 정기 복용 약물이 있으면 가입 심사에서 관련 질환을 함께 고지해야 해요.'
    })
  }

  ;(profile.surgeries || []).forEach((key) => {
    const labelMap = { heart: '심장 수술', cancer: '암 수술', ortho: '정형외과 수술', other: '기타 수술' }
    if (key === 'heart') categories.add('심장질환보험')
    if (key === 'cancer') categories.add('암보험(재발·전이 보장형)')
    if (key === 'ortho') categories.add('상해보험')
    categories.add('실손의료보험')
    notes.push({
      source: labelMap[key] || '수술 이력',
      text: '수술 이력은 가입 심사(고지의무)에서 중요한 항목이에요. 보험사마다 판단 기준이 달라요.'
    })
  })

  if (categories.size === 0) categories.add('실손의료보험')

  return {
    bmi,
    bmiCategory: bmiCat,
    categories: [...categories],
    notes
  }
}
