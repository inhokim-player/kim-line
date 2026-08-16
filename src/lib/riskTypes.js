// 온보딩용 8문항 (지표당 1~2문항, 평균으로 집계)
export const QUIZ_QUESTIONS = [
  {
    id: 'sleep_1',
    metric: 'sleep_hours',
    text: '평소 하루 수면 시간은?',
    options: [
      { label: '5시간 미만', value: 4.5 },
      { label: '5~6시간', value: 5.5 },
      { label: '7~8시간', value: 7.5 },
      { label: '8시간 초과', value: 9 }
    ]
  },
  {
    id: 'sleep_2',
    metric: 'sleep_hours',
    text: '잠들 때까지 걸리는 시간은?',
    options: [
      { label: '30분 이상 뒤척임', value: 5 },
      { label: '15~30분', value: 6.5 },
      { label: '10~15분', value: 7.5 },
      { label: '눕자마자 잠듦', value: 8.5 }
    ]
  },
  {
    id: 'exercise_1',
    metric: 'exercise_minutes',
    text: '일주일 평균 운동/활동 시간은?',
    options: [
      { label: '거의 안 함', value: 0 },
      { label: '주 1~2회, 가볍게', value: 10 },
      { label: '주 3~4회, 30분 이상', value: 25 },
      { label: '거의 매일 30분 이상', value: 45 }
    ]
  },
  {
    id: 'driving_1',
    metric: 'driving_score',
    text: '운전 중 스마트폰 사용은?',
    options: [
      { label: '자주 확인한다', value: 20 },
      { label: '가끔 확인한다', value: 45 },
      { label: '신호 대기 때만', value: 70 },
      { label: '전혀 안 본다', value: 95 }
    ]
  },
  {
    id: 'driving_2',
    metric: 'driving_score',
    text: '제한 속도는 얼마나 지키나요?',
    options: [
      { label: '자주 초과한다', value: 20 },
      { label: '가끔 초과한다', value: 45 },
      { label: '대체로 지킨다', value: 70 },
      { label: '항상 지킨다', value: 95 }
    ]
  },
  {
    id: 'diet_1',
    metric: 'diet_score',
    text: '평소 식사 스타일은?',
    options: [
      { label: '배달/인스턴트 위주', value: 25 },
      { label: '그때그때 다르다', value: 50 },
      { label: '직접 요리 자주', value: 70 },
      { label: '균형 잡힌 식단 철저', value: 90 }
    ]
  },
  {
    id: 'stress_1',
    metric: 'stress_level',
    text: '요즘 스트레스 체감 수준은?',
    options: [
      { label: '매우 낮음', value: 10 },
      { label: '보통', value: 40 },
      { label: '높음', value: 65 },
      { label: '매우 높음', value: 90 }
    ]
  },
  {
    id: 'stress_2',
    metric: 'stress_level',
    text: '예상치 못한 일이 생기면 나는?',
    options: [
      { label: '크게 동요하지 않는다', value: 15 },
      { label: '조금 신경 쓰인다', value: 40 },
      { label: '하루 종일 생각난다', value: 65 },
      { label: '잠도 설친다', value: 90 }
    ]
  }
]

// 매일 체크인용 5문항 (지표당 1문항, 빠른 응답용)
export const DAILY_QUESTIONS = [
  {
    id: 'daily_sleep',
    metric: 'sleep_hours',
    text: '오늘 몇 시간 주무셨나요?',
    options: [
      { label: '5시간 미만', value: 4.5 },
      { label: '5~6시간', value: 5.5 },
      { label: '7~8시간', value: 7.5 },
      { label: '8시간 초과', value: 9 }
    ]
  },
  {
    id: 'daily_exercise',
    metric: 'exercise_minutes',
    text: '오늘 운동/활동 시간은?',
    options: [
      { label: '거의 안 함', value: 0 },
      { label: '가볍게 조금', value: 10 },
      { label: '30분 정도', value: 25 },
      { label: '45분 이상', value: 45 }
    ]
  },
  {
    id: 'daily_driving',
    metric: 'driving_score',
    text: '오늘 운전 습관은 어땠나요?',
    options: [
      { label: '급하고 경솔했다', value: 25 },
      { label: '보통이었다', value: 50 },
      { label: '조심스러웠다', value: 75 },
      { label: '매우 안전했다', value: 95 }
    ]
  },
  {
    id: 'daily_diet',
    metric: 'diet_score',
    text: '오늘 식사는 어땠나요?',
    options: [
      { label: '배달/인스턴트', value: 25 },
      { label: '그럭저럭', value: 50 },
      { label: '직접 챙겨 먹음', value: 70 },
      { label: '균형 잡힌 식단', value: 90 }
    ]
  },
  {
    id: 'daily_stress',
    metric: 'stress_level',
    text: '오늘 스트레스는 어느 정도였나요?',
    options: [
      { label: '매우 낮음', value: 10 },
      { label: '보통', value: 40 },
      { label: '높음', value: 65 },
      { label: '매우 높음', value: 90 }
    ]
  }
]

// 문항 답변(questionId -> value)을 지표별 평균으로 집계
export function aggregateAnswers(questions, answers) {
  const groups = {}
  questions.forEach((q) => {
    const v = answers[q.id]
    if (v == null) return
    if (!groups[q.metric]) groups[q.metric] = []
    groups[q.metric].push(v)
  })

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

  return {
    sleep_hours: groups.sleep_hours ? Number(avg(groups.sleep_hours).toFixed(1)) : 7,
    exercise_minutes: groups.exercise_minutes ? Math.round(avg(groups.exercise_minutes)) : 20,
    driving_score: groups.driving_score ? Math.round(avg(groups.driving_score)) : 70,
    diet_score: groups.diet_score ? Math.round(avg(groups.diet_score)) : 70,
    stress_level: groups.stress_level ? Math.round(avg(groups.stress_level)) : 30
  }
}

// 4개 축의 형용사 데이터
const AXES = {
  wheel: {
    S: { title: '안전운전러', line: '도로 위에서는 늘 차분하고 신중해요', icon: '🛡️' },
    W: { title: '스피드본능러', line: '가속페달에 마음이 먼저 반응하는 편이에요', icon: '🏎️' }
  },
  rhythm: {
    L: { title: '아침형', line: '하루를 일찍 시작하는 규칙적인 리듬을 가졌어요', icon: '🌅' },
    O: { title: '올빼미형', line: '밤이 되어야 진짜 컨디션이 올라와요', icon: '🌙' }
  },
  vitality: {
    V: { title: '에너자이저', line: '몸을 움직이고 잘 챙겨 먹는 걸 좋아해요', icon: '⚡' },
    D: { title: '저전력모드', line: '움직임보다는 충전과 휴식을 더 좋아해요', icon: '🦥' }
  },
  mind: {
    C: { title: '평온형', line: '웬만한 일에는 잘 흔들리지 않아요', icon: '🕊️' },
    T: { title: '긴장형', line: '작은 일에도 마음이 자주 분주해져요', icon: '🐿️' }
  }
}

const EMOJI_BY_RHYTHM_VITALITY = {
  LV: '🌤️',
  LD: '☕',
  OV: '🦉',
  OD: '🌙'
}

export function buildArchetype(metrics) {
  const wheel = metrics.driving_score >= 55 ? 'S' : 'W'
  const rhythm = metrics.sleep_hours >= 6.5 && metrics.sleep_hours <= 9 ? 'L' : 'O'
  const vitalityScore = (Math.min(100, metrics.exercise_minutes * 2) + metrics.diet_score) / 2
  const vitality = vitalityScore >= 55 ? 'V' : 'D'
  const mind = metrics.stress_level <= 45 ? 'C' : 'T'

  const code = `${wheel}${rhythm}${vitality}${mind}`
  const w = AXES.wheel[wheel]
  const r = AXES.rhythm[rhythm]
  const v = AXES.vitality[vitality]
  const m = AXES.mind[mind]

  return {
    code,
    emoji: EMOJI_BY_RHYTHM_VITALITY[`${rhythm}${vitality}`],
    name: `${r.title} ${v.title}`,
    subtitle: `${w.title} · ${m.title}`,
    traits: [w, r, v, m],
    description: `${r.line} ${v.line} ${w.line} ${m.line}`
  }
}

function clamp01to100(v) {
  return Math.min(100, Math.max(0, v))
}

// 축별 세부 점수 + 강점/보완점 + 맞춤 코멘트를 계산
// score는 항상 "높을수록 좋음" 방향으로 정규화 (안전/이상적 수면/활력/평온)
export function analyzeTraits(metrics) {
  const drivingScore = clamp01to100(metrics.driving_score)
  const sleepIdealness = clamp01to100(100 - Math.abs(metrics.sleep_hours - 7.5) * 18)
  const vitalityScore = clamp01to100(
    (Math.min(100, metrics.exercise_minutes * 2) + metrics.diet_score) / 2
  )
  const calmScore = clamp01to100(100 - metrics.stress_level)

  const axes = [
    {
      key: 'wheel',
      label: '운전 습관',
      icon: '🚗',
      score: Math.round(drivingScore),
      good: '급가속·급제동 없이 방어운전을 하고 있어요. 보험료에 가장 직접적으로 반영되는 항목이에요.',
      bad: '운전 중 속도나 스마트폰 사용에서 리스크가 감지돼요. 이 항목이 전체 점수에 가장 큰 비중(28%)을 차지해요.'
    },
    {
      key: 'rhythm',
      label: '수면 균형',
      icon: '🌙',
      score: Math.round(sleepIdealness),
      good: '7~8시간대의 이상적인 수면 시간에 가까워요. 회복력과 판단력 유지에 유리해요.',
      bad: '수면 시간이 이상 범위(7~8시간)에서 벗어나 있어요. 너무 짧거나 길면 둘 다 리스크로 반영돼요.'
    },
    {
      key: 'vitality',
      label: '활력 지수',
      icon: '⚡',
      score: Math.round(vitalityScore),
      good: '운동량과 식습관이 균형 잡혀 있어요. 심장질환·암 등 주요 사망원인 리스크를 낮추는 데 직접 기여해요.',
      bad: '운동 또는 식습관 중 하나 이상이 아쉬워요. 국내 사망원인 1·2위(암·심장질환)와 가장 밀접한 항목이에요.'
    },
    {
      key: 'mind',
      label: '마음 상태',
      icon: '🧘',
      score: Math.round(calmScore),
      good: '스트레스를 잘 조절하고 있어요. 장기적인 리스크 관리에서 자주 간과되는 부분이에요.',
      bad: '스트레스 체감 수준이 높은 편이에요. 수면·활력에도 영향을 줄 수 있어 우선 관리가 필요해요.'
    }
  ]

  const withTier = axes.map((a) => ({
    ...a,
    tier: a.score >= 65 ? 'strength' : a.score < 45 ? 'growth' : 'neutral',
    comment: a.score >= 55 ? a.good : a.bad
  }))

  const strengths = withTier.filter((a) => a.tier === 'strength').sort((a, b) => b.score - a.score)
  const growthAreas = withTier.filter((a) => a.tier === 'growth').sort((a, b) => a.score - b.score)

  const topGrowth = growthAreas[0]
  const topStrength = strengths[0] || withTier.slice().sort((a, b) => b.score - a.score)[0]

  return {
    axes: withTier,
    strengths,
    growthAreas,
    topStrength,
    topGrowth: topGrowth || null,
    recommendation: topGrowth
      ? `${topGrowth.label} 개선이 가장 큰 효과를 줄 거예요 — ${topGrowth.bad}`
      : '다섯 항목 모두 균형이 잘 잡혀 있어요. 지금 습관을 유지해보세요.'
  }
}
