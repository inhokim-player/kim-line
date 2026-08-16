// 방문자의 기기 시간대와 무관하게 항상 한국 시간(Asia/Seoul) 기준으로 계산합니다.

export function kstNow(now = new Date()) {
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
}

// 한국 시간 기준 오늘(YYYY-MM-DD). offsetDays로 어제/내일도 구할 수 있음
export function kstDateISO(offsetDays = 0, now = new Date()) {
  const d = kstNow(now)
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function secondsSinceKstMidnight(now = new Date()) {
  const kst = kstNow(now)
  const midnight = new Date(kst.getFullYear(), kst.getMonth(), kst.getDate())
  return (kst - midnight) / 1000
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// 현재 한국 연도의 총 일수 (윤년 자동 반영)
export function daysInKstYear(now = new Date()) {
  return isLeapYear(kstNow(now).getFullYear()) ? 366 : 365
}

// 화면에 보여줄 한국 시간 문자열 (예: 2026년 8월 16일 (일) 오후 3:24:07)
export function formatKstClock(now = new Date()) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now)
}
