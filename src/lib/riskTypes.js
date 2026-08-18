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

