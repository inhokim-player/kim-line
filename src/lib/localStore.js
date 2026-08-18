// 계정/로그인 없이 브라우저(localStorage)에만 저장합니다.
// 모두가 즉시 접속해서 쓸 수 있도록 하기 위한 선택입니다 — 서버에 개인정보가 남지 않습니다.

import { kstDateISO } from './kst'

const PROFILE_KEY = 'risknow_profile'
const LOGS_KEY = 'risknow_logs'

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : { base_premium: 85000 }
  } catch {
    return { base_premium: 85000 }
  }
}

export function setProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // 저장 실패 시 무시 (프라이빗 브라우징 등)
  }
}

function getLogsMap() {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setLogsMap(map) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(map))
  } catch {
    // 저장 실패 시 무시
  }
}

export function getLog(dateISO) {
  const map = getLogsMap()
  return map[dateISO] || null
}

export function upsertLog(dateISO, metrics) {
  const map = getLogsMap()
  map[dateISO] = { ...metrics, log_date: dateISO }
  setLogsMap(map)
}

export function getRecentLogs(limit = 30) {
  const map = getLogsMap()
  return Object.values(map)
    .sort((a, b) => a.log_date.localeCompare(b.log_date))
    .slice(-limit)
}

export function hasAnyLog() {
  return Object.keys(getLogsMap()).length > 0
}

// 오늘(todayISO)부터 거꾸로 하루씩 확인하며, 기록이 끊기지 않은 연속 일수를 센다.
// todayISO를 인자로 받는 이유는 테스트에서 날짜를 주입해 자정 경계를 검증하기 위함.
export function getStreak(todayISO = kstDateISO()) {
  const map = getLogsMap()
  let streak = 0
  while (true) {
    const d = new Date(todayISO)
    d.setDate(d.getDate() - streak)
    const key = d.toISOString().slice(0, 10)
    if (!map[key]) break
    streak++
  }
  return streak
}

export function clearAllData() {
  try {
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(LOGS_KEY)
  } catch {
    // 무시
  }
}
