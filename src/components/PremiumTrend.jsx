// 외부 차트 라이브러리 없이 가벼운 SVG 스파크라인으로 구현
export default function PremiumTrend({ history }) {
  if (!history || history.length < 2) {
    return (
      <div className="rounded-card bg-surface p-5">
        <h2 className="font-display font-semibold text-ink mb-1">최근 추이</h2>
        <p className="text-sm text-subink mt-3">데이터가 쌓이면 추이가 표시돼요</p>
      </div>
    )
  }

  const width = 320
  const height = 80
  const padding = 8

  const values = history.map((h) => h.premium)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2)
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const last = points[points.length - 1]

  return (
    <div className="rounded-card bg-surface p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-semibold text-ink">최근 추이</h2>
        <span className="text-xs text-subink">최근 {history.length}일</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20" preserveAspectRatio="none">
        <path d={pathD} fill="none" stroke="#0F9D82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r="4" fill="#0F9D82" />
      </svg>
      <div className="flex justify-between mt-2 text-xs text-subink tabular">
        <span>₩{min.toLocaleString()}</span>
        <span>₩{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
